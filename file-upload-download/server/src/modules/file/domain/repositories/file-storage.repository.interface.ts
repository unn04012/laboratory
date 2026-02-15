import { Readable } from 'stream';

export interface CompletedPart {
  partNumber: number;
  etag: string;
}

export interface UploadStreamResult {
  key: string;
  etag?: string;
  versionId?: string;
}

export interface UploadStreamOptions {
  chunkSize?: number; // 청크 크기 (bytes), 기본값: 64KB
}

export interface IFileStorageRepository {
  getUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string>;
  getDownloadUrl(key: string, expiresIn?: number): Promise<string>;

  // Stream Upload (Direct upload using PutObjectCommand with stream)
  uploadStream(key: string, stream: Readable, contentType: string, options?: UploadStreamOptions): Promise<UploadStreamResult>;

  // Multipart Upload
  initiateMultipartUpload(key: string, contentType: string): Promise<string>;
  getMultipartUploadUrl(key: string, uploadId: string, partNumber: number, expiresIn?: number): Promise<string>;
  completeMultipartUpload(key: string, uploadId: string, parts: CompletedPart[]): Promise<void>;
  abortMultipartUpload(key: string, uploadId: string): Promise<void>;
}
