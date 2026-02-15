export class GetUploadUrlCommand {
  fileName: string;
  contentType: string;
  expiresIn?: number;
}

export class GetDownloadUrlCommand {
  fileKey: string;
  expiresIn?: number;
}

export class UploadUrlResult {
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
}

export class DownloadUrlResult {
  downloadUrl: string;
  expiresIn: number;
}

// Multipart Upload DTOs
export class InitiateMultipartUploadCommand {
  fileName: string;
  contentType: string;
}

export class InitiateMultipartUploadResult {
  uploadId: string;
  fileKey: string;
}

export class GetMultipartUploadUrlCommand {
  fileKey: string;
  uploadId: string;
  partNumber: number;
  expiresIn?: number;
}

export class GetMultipartUploadUrlResult {
  uploadUrl: string;
  partNumber: number;
  expiresIn: number;
}

export class CompletedPartDto {
  partNumber: number;
  etag: string;
}

export class CompleteMultipartUploadCommand {
  fileKey: string;
  uploadId: string;
  parts: CompletedPartDto[];
}

export class AbortMultipartUploadCommand {
  fileKey: string;
  uploadId: string;
}

// Stream Upload DTOs
export class UploadStreamCommand {
  fileName: string;
  contentType: string;
  stream: NodeJS.ReadableStream;
}

export class UploadStreamResult {
  fileKey: string;
  etag?: string;
  versionId?: string;
}
