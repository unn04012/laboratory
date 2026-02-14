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
} from '../../../application/dto/service.dto';
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

export class FileMapper {
  toUploadCommand(request: GetUploadUrlRequest): GetUploadUrlCommand {
    const command = new GetUploadUrlCommand();
    command.fileName = request.fileName;
    command.contentType = request.contentType;
    command.expiresIn = request.expiresIn;
    return command;
  }

  toDownloadCommand(request: GetDownloadUrlRequest): GetDownloadUrlCommand {
    const command = new GetDownloadUrlCommand();
    command.fileKey = request.fileKey;
    command.expiresIn = request.expiresIn;
    return command;
  }

  toUploadResponse(result: UploadUrlResult): GetUploadUrlResponse {
    return {
      uploadUrl: result.uploadUrl,
      fileKey: result.fileKey,
      expiresIn: result.expiresIn,
    };
  }

  toDownloadResponse(result: DownloadUrlResult): GetDownloadUrlResponse {
    return {
      downloadUrl: result.downloadUrl,
      expiresIn: result.expiresIn,
    };
  }

  // Multipart Upload Mappers
  toInitiateMultipartCommand(request: InitiateMultipartUploadRequest): InitiateMultipartUploadCommand {
    const command = new InitiateMultipartUploadCommand();
    command.fileName = request.fileName;
    command.contentType = request.contentType;
    return command;
  }

  toInitiateMultipartResponse(result: InitiateMultipartUploadResult): InitiateMultipartUploadResponse {
    return {
      uploadId: result.uploadId,
      fileKey: result.fileKey,
    };
  }

  toGetMultipartUrlCommand(request: GetMultipartUploadUrlRequest): GetMultipartUploadUrlCommand {
    const command = new GetMultipartUploadUrlCommand();
    command.fileKey = request.fileKey;
    command.uploadId = request.uploadId;
    command.partNumber = request.partNumber;
    command.expiresIn = request.expiresIn;
    return command;
  }

  toGetMultipartUrlResponse(result: GetMultipartUploadUrlResult): GetMultipartUploadUrlResponse {
    return {
      uploadUrl: result.uploadUrl,
      partNumber: result.partNumber,
      expiresIn: result.expiresIn,
    };
  }

  toCompleteMultipartCommand(request: CompleteMultipartUploadRequest): CompleteMultipartUploadCommand {
    const command = new CompleteMultipartUploadCommand();
    command.fileKey = request.fileKey;
    command.uploadId = request.uploadId;
    command.parts = request.parts.map((p) => ({ partNumber: p.partNumber, etag: p.etag }));
    return command;
  }

  toAbortMultipartCommand(request: AbortMultipartUploadRequest): AbortMultipartUploadCommand {
    const command = new AbortMultipartUploadCommand();
    command.fileKey = request.fileKey;
    command.uploadId = request.uploadId;
    return command;
  }
}
