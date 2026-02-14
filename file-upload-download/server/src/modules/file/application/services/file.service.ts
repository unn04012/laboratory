import { v4 as uuidv4 } from 'uuid';
import { IFileStorageRepository } from '../../domain/repositories/file-storage.repository.interface';
import {
  GetUploadUrlCommand,
  GetDownloadUrlCommand,
  UploadUrlResult,
  DownloadUrlResult,
  InitiateMultipartUploadCommand,
  InitiateMultipartUploadResult,
  GetMultipartUploadUrlCommand,
  GetMultipartUploadUrlResult,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '../dto/service.dto';

export class FileService {
  private readonly defaultExpiresIn = 3600;

  constructor(private readonly fileStorageRepository: IFileStorageRepository) {}

  public async getUploadUrl(command: GetUploadUrlCommand): Promise<UploadUrlResult> {
    const { fileName, contentType, expiresIn } = command;
    const fileKey = this.generateFileKey(fileName);
    const expiration = expiresIn || this.defaultExpiresIn;

    const uploadUrl = await this.fileStorageRepository.getUploadUrl(fileKey, contentType, expiration);

    return {
      uploadUrl,
      fileKey,
      expiresIn: expiration,
    };
  }

  public async getDownloadUrl(command: GetDownloadUrlCommand): Promise<DownloadUrlResult> {
    const { fileKey, expiresIn } = command;
    const expiration = expiresIn || this.defaultExpiresIn;

    const downloadUrl = await this.fileStorageRepository.getDownloadUrl(fileKey, expiration);

    return {
      downloadUrl,
      expiresIn: expiration,
    };
  }

  async initiateMultipartUpload(command: InitiateMultipartUploadCommand): Promise<InitiateMultipartUploadResult> {
    const { fileName, contentType } = command;
    const fileKey = this.generateFileKey(fileName);

    const uploadId = await this.fileStorageRepository.initiateMultipartUpload(fileKey, contentType);

    return {
      uploadId,
      fileKey,
    };
  }

  async getMultipartUploadUrl(command: GetMultipartUploadUrlCommand): Promise<GetMultipartUploadUrlResult> {
    const { fileKey, uploadId, partNumber, expiresIn } = command;
    const expiration = expiresIn || this.defaultExpiresIn;

    const uploadUrl = await this.fileStorageRepository.getMultipartUploadUrl(fileKey, uploadId, partNumber, expiration);

    return {
      uploadUrl,
      partNumber,
      expiresIn: expiration,
    };
  }

  async completeMultipartUpload(command: CompleteMultipartUploadCommand): Promise<void> {
    const { fileKey, uploadId, parts } = command;
    await this.fileStorageRepository.completeMultipartUpload(fileKey, uploadId, parts);
  }

  async abortMultipartUpload(command: AbortMultipartUploadCommand): Promise<void> {
    const { fileKey, uploadId } = command;
    await this.fileStorageRepository.abortMultipartUpload(fileKey, uploadId);
  }

  private generateFileKey(fileName: string): string {
    const uuid = uuidv4();
    const extension = fileName.includes('.') ? fileName.split('.').pop() : '';
    return `uploads/${uuid}${extension ? `.${extension}` : ''}`;
  }
}
