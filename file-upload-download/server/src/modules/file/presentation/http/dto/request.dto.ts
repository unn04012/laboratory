import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUploadUrlRequest {
  @IsString()
  fileName: string;

  @IsString()
  contentType: string;

  @IsOptional()
  @IsNumber()
  expiresIn?: number;
}

export class GetDownloadUrlRequest {
  @IsString()
  fileKey: string;

  @IsOptional()
  @IsNumber()
  expiresIn?: number;
}

export class GetUploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
}

export class GetDownloadUrlResponse {
  downloadUrl: string;
  expiresIn: number;
}

// Multipart Upload DTOs
export class InitiateMultipartUploadRequest {
  @IsString()
  fileName: string;

  @IsString()
  contentType: string;
}

export class InitiateMultipartUploadResponse {
  uploadId: string;
  fileKey: string;
}

export class GetMultipartUploadUrlRequest {
  @IsString()
  fileKey: string;

  @IsString()
  uploadId: string;

  @IsInt()
  @Min(1)
  partNumber: number;

  @IsOptional()
  @IsNumber()
  expiresIn?: number;
}

export class GetMultipartUploadUrlResponse {
  uploadUrl: string;
  partNumber: number;
  expiresIn: number;
}

export class CompletedPartRequest {
  @IsInt()
  @Min(1)
  partNumber: number;

  @IsString()
  etag: string;
}

export class CompleteMultipartUploadRequest {
  @IsString()
  fileKey: string;

  @IsString()
  uploadId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompletedPartRequest)
  parts: CompletedPartRequest[];
}

export class AbortMultipartUploadRequest {
  @IsString()
  fileKey: string;

  @IsString()
  uploadId: string;
}
