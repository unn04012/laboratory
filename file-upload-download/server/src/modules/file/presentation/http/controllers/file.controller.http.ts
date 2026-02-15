import { Request } from 'express';
import { FileService } from '../../../application/services/file.service';
import { FileMapper } from '../mappers/file.mapper';
import {
  GetUploadUrlRequest,
  GetDownloadUrlRequest,
  GetUploadUrlResponse,
  GetDownloadUrlResponse,
  InitiateMultipartUploadRequest,
  InitiateMultipartUploadResponse,
  GetMultipartUploadUrlRequest,
  GetMultipartUploadUrlResponse,
  CompleteMultipartUploadRequest,
  AbortMultipartUploadRequest,
} from '../dto/request.dto';
import { UploadStreamCommand } from '../../../application/dto/service.dto';

export class FileControllerHttp {
  constructor(
    private readonly fileService: FileService,
    private readonly fileMapper: FileMapper,
  ) {}

  async getUploadUrl(request: GetUploadUrlRequest): Promise<GetUploadUrlResponse> {
    const command = this.fileMapper.toUploadCommand(request);
    const result = await this.fileService.getUploadUrl(command);
    return this.fileMapper.toUploadResponse(result);
  }

  async getDownloadUrl(request: GetDownloadUrlRequest): Promise<GetDownloadUrlResponse> {
    const command = this.fileMapper.toDownloadCommand(request);
    const result = await this.fileService.getDownloadUrl(command);
    return this.fileMapper.toDownloadResponse(result);
  }

  async initiateMultipartUpload(request: InitiateMultipartUploadRequest): Promise<InitiateMultipartUploadResponse> {
    const command = this.fileMapper.toInitiateMultipartCommand(request);
    const result = await this.fileService.initiateMultipartUpload(command);
    return this.fileMapper.toInitiateMultipartResponse(result);
  }

  async getMultipartUploadUrl(request: GetMultipartUploadUrlRequest): Promise<GetMultipartUploadUrlResponse> {
    const command = this.fileMapper.toGetMultipartUrlCommand(request);
    const result = await this.fileService.getMultipartUploadUrl(command);
    return this.fileMapper.toGetMultipartUrlResponse(result);
  }

  async completeMultipartUpload(request: CompleteMultipartUploadRequest): Promise<void> {
    const command = this.fileMapper.toCompleteMultipartCommand(request);
    await this.fileService.completeMultipartUpload(command);
  }

  async abortMultipartUpload(request: AbortMultipartUploadRequest): Promise<void> {
    const command = this.fileMapper.toAbortMultipartCommand(request);
    await this.fileService.abortMultipartUpload(command);
  }

  async uploadStreamBinary(req: Request, fileName: string, contentType: string) {
    const command: UploadStreamCommand = {
      fileName,
      contentType,
      stream: req,
    };

    const result = await this.fileService.uploadStream(command);

    return {
      success: true,
      fileKey: result.fileKey,
      etag: result.etag,
      versionId: result.versionId,
    };
  }

  async uploadStreamBusboy(req: Request): Promise<{ success: boolean; files: Array<{ fieldName: string; fileName: string; fileKey: string; etag?: string; versionId?: string }> }> {
    const busboy = require('busboy');

    return new Promise((resolve, reject) => {
      const bb = busboy({ headers: req.headers });
      const uploadedFiles: Array<{ fieldName: string; fileName: string; fileKey: string; etag?: string; versionId?: string }> = [];
      const uploadPromises: Promise<void>[] = [];

      bb.on('file', (fieldName: string, fileStream: NodeJS.ReadableStream, info: { filename: string; encoding: string; mimeType: string }) => {
        const { filename, mimeType } = info;

        console.log(`[Busboy] Receiving file: ${filename} (${mimeType}) from field: ${fieldName}`);

        const uploadPromise = (async () => {
          const command: UploadStreamCommand = {
            fileName: filename,
            contentType: mimeType,
            stream: fileStream,
          };

          const result = await this.fileService.uploadStream(command);

          uploadedFiles.push({
            fieldName,
            fileName: filename,
            fileKey: result.fileKey,
            etag: result.etag,
            versionId: result.versionId,
          });
        })();

        uploadPromises.push(uploadPromise);
      });

      bb.on('field', (name: string, value: string) => {
        console.log(`[Busboy] Field ${name}: ${value}`);
      });

      bb.on('finish', async () => {
        try {
          await Promise.all(uploadPromises);
          resolve({
            success: true,
            files: uploadedFiles,
          });
        } catch (error) {
          reject(error);
        }
      });

      bb.on('error', (error: Error) => {
        reject(error);
      });

      req.pipe(bb);
    });
  }
}
