import {
  PutObjectCommand,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IFileStorageRepository, CompletedPart } from '../../domain/repositories/file-storage.repository.interface';
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
}
