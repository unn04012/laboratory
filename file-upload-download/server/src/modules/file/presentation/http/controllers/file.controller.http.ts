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
}
