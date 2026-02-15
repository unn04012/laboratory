import {
  PutObjectCommand,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable, Transform } from 'stream';
import {
  IFileStorageRepository,
  CompletedPart,
  UploadStreamResult,
  UploadStreamOptions,
} from '../../domain/repositories/file-storage.repository.interface';
import { S3Config } from '../../../../config/aws.config';
export class FileStorageRepositoryS3 implements IFileStorageRepository {
  constructor(private readonly s3Config: S3Config) {}

  async getUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.s3Config.bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Config.client, command, {
      expiresIn: expiresIn || this.s3Config.defaultExpiresIn,
    });
  }

  async getDownloadUrl(key: string, expiresIn?: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.s3Config.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Config.client, command, {
      expiresIn: expiresIn || this.s3Config.defaultExpiresIn,
    });
  }

  async initiateMultipartUpload(key: string, contentType: string): Promise<string> {
    const command = new CreateMultipartUploadCommand({
      Bucket: this.s3Config.bucket,
      Key: key,
      ContentType: contentType,
    });

    const response = await this.s3Config.client.send(command);
    if (!response.UploadId) {
      throw new Error('Failed to initiate multipart upload');
    }
    return response.UploadId;
  }

  async getMultipartUploadUrl(key: string, uploadId: string, partNumber: number, expiresIn?: number): Promise<string> {
    const command = new UploadPartCommand({
      Bucket: this.s3Config.bucket,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    });

    return getSignedUrl(this.s3Config.client, command, {
      expiresIn: expiresIn || this.s3Config.defaultExpiresIn,
    });
  }

  async completeMultipartUpload(key: string, uploadId: string, parts: CompletedPart[]): Promise<void> {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.s3Config.bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map((part) => ({
          PartNumber: part.partNumber,
          ETag: part.etag,
        })),
      },
    });

    await this.s3Config.client.send(command);
  }

  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
    const command = new AbortMultipartUploadCommand({
      Bucket: this.s3Config.bucket,
      Key: key,
      UploadId: uploadId,
    });

    await this.s3Config.client.send(command);
  }

  async uploadStream(key: string, stream: Readable, contentType: string, options?: UploadStreamOptions): Promise<UploadStreamResult> {
    // 메모리 프로파일링 시작
    const memBefore = process.memoryUsage();
    console.log('[Memory Before Upload]', {
      rss: `${(memBefore.rss / 1024 / 1024).toFixed(2)}MB`,
      heapUsed: `${(memBefore.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      heapTotal: `${(memBefore.heapTotal / 1024 / 1024).toFixed(2)}MB`,
      external: `${(memBefore.external / 1024 / 1024).toFixed(2)}MB`,
    });

    // Express에서 읽는 청크 크기 (로깅용)
    const expressChunkSize = 64 * 1024; // 64KB
    // S3 multipart upload 파트 크기 (최소 5MB)
    const s3PartSize = options?.chunkSize || 5 * 1024 * 1024; // 기본값: 5MB

    let totalBytes = 0;
    let chunkCount = 0;
    let s3ChunkCount = 0;
    let s3TotalBytes = 0;

    // Express Request에서 들어오는 원본 청크 로깅
    const expressLoggingStream = new Transform({
      transform(chunk: Buffer, _encoding: string, callback: (error?: Error | null, data?: any) => void) {
        chunkCount++;
        totalBytes += chunk.length;
        console.log(`[Express Request] Chunk #${chunkCount}: ${chunk.length} bytes (Total: ${totalBytes} bytes)`);
        this.push(chunk);
        callback();
      },
    });

    let buffer = Buffer.alloc(0);

    // S3로 보낼 청크 크기 조정 및 로깅
    const s3ChunkingStream = new Transform({
      transform(chunk: Buffer, _encoding: string, callback: (error?: Error | null, data?: any) => void) {
        buffer = Buffer.concat([buffer as any, chunk]);

        // 설정된 청크 사이즈만큼 데이터가 모이면 emit
        while (buffer.length >= s3PartSize) {
          // subarray는 같은 메모리를 참조하므로 새 Buffer로 복사
          const toEmit = Buffer.concat([buffer.subarray(0, s3PartSize) as any]);
          buffer = Buffer.concat([buffer.subarray(s3PartSize) as any]);

          s3ChunkCount++;
          s3TotalBytes += toEmit.length;
          console.log(`[S3 Upload] Chunk #${s3ChunkCount}: ${toEmit.length} bytes (Total: ${s3TotalBytes} bytes)`);
          this.push(toEmit);
        }
        callback();
      },
      flush(callback: (error?: Error | null, data?: any) => void) {
        // 남은 데이터 처리
        if (buffer.length > 0) {
          s3ChunkCount++;
          s3TotalBytes += buffer.length;
          console.log(`[S3 Upload] Final Chunk #${s3ChunkCount}: ${buffer.length} bytes (Total: ${s3TotalBytes} bytes)`);
          this.push(buffer);
          buffer = Buffer.alloc(0);
        }
        callback();
      },
    });

    // Express Request -> Express 로깅 -> S3 청킹 -> S3 업로드
    const monitoredStream = stream.pipe(expressLoggingStream).pipe(s3ChunkingStream);

    console.log(`[Stream Upload] Starting upload for key: ${key} (S3 part size: ${s3PartSize} bytes = ${s3PartSize / 1024 / 1024}MB)`);
    const startTime = Date.now();

    // Upload 클래스를 사용하여 스트림 업로드 (multipart 자동 처리)
    // queueSize를 줄이면 메모리 사용량 감소, 업로드 속도 약간 감소
    // 메모리 사용량 = queueSize × partSize
    // 예: queueSize=2, partSize=5MB → 10MB + 버퍼(5MB) = 15MB/request
    const upload = new Upload({
      client: this.s3Config.client,
      params: {
        Bucket: this.s3Config.bucket,
        Key: key,
        Body: monitoredStream,
        ContentType: contentType,
      },
      queueSize: 2, // 동시 업로드 파트 수 (기존 4 → 2로 감소)
      partSize: s3PartSize, // S3 파트 크기 (최소 5MB)
    });

    // 피크 메모리 추적
    let peakHeapUsed = memBefore.heapUsed;
    let peakRss = memBefore.rss;

    // 업로드 진행률 및 메모리 로깅
    upload.on('httpUploadProgress', (progress) => {
      const currentMem = process.memoryUsage();
      peakHeapUsed = Math.max(peakHeapUsed, currentMem.heapUsed);
      peakRss = Math.max(peakRss, currentMem.rss);

      if (progress.loaded && progress.total) {
        const percent = ((progress.loaded / progress.total) * 100).toFixed(2);
        console.log(
          `[S3 Upload Progress] ${percent}% (${progress.loaded}/${progress.total} bytes) | Heap: ${(currentMem.heapUsed / 1024 / 1024).toFixed(2)}MB`,
        );
      }
    });

    const response = await upload.done();

    const duration = Date.now() - startTime;
    console.log(`[Stream Upload] Completed in ${duration}ms`);
    console.log(`[Express Request] Total chunks: ${chunkCount}, Total bytes: ${totalBytes}`);
    console.log(`[S3 Upload] Total chunks: ${s3ChunkCount}, Total bytes: ${s3TotalBytes}`);

    // 메모리 프로파일링 종료
    const memAfter = process.memoryUsage();
    console.log('[Memory After Upload]', {
      rss: `${(memAfter.rss / 1024 / 1024).toFixed(2)}MB`,
      heapUsed: `${(memAfter.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      heapTotal: `${(memAfter.heapTotal / 1024 / 1024).toFixed(2)}MB`,
      external: `${(memAfter.external / 1024 / 1024).toFixed(2)}MB`,
    });
    console.log('[Memory Delta]', {
      rss: `${((memAfter.rss - memBefore.rss) / 1024 / 1024).toFixed(2)}MB`,
      heapUsed: `${((memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024).toFixed(2)}MB`,
      heapTotal: `${((memAfter.heapTotal - memBefore.heapTotal) / 1024 / 1024).toFixed(2)}MB`,
      external: `${((memAfter.external - memBefore.external) / 1024 / 1024).toFixed(2)}MB`,
    });
    console.log('[Memory Peak During Upload]', {
      peakRss: `${(peakRss / 1024 / 1024).toFixed(2)}MB`,
      peakHeapUsed: `${(peakHeapUsed / 1024 / 1024).toFixed(2)}MB`,
      peakRssDelta: `${((peakRss - memBefore.rss) / 1024 / 1024).toFixed(2)}MB`,
      peakHeapDelta: `${((peakHeapUsed - memBefore.heapUsed) / 1024 / 1024).toFixed(2)}MB`,
    });

    // Garbage Collection 제안 (프로덕션에서는 제거 권장)
    if (global.gc) {
      const beforeGC = process.memoryUsage().heapUsed;
      global.gc();
      const afterGC = process.memoryUsage().heapUsed;
      console.log('[GC] Freed memory:', `${((beforeGC - afterGC) / 1024 / 1024).toFixed(2)}MB`);
    }

    return {
      key,
      etag: response.ETag,
      versionId: response.VersionId,
    };
  }
}
