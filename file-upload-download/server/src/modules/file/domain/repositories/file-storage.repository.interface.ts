export interface CompletedPart {
  partNumber: number;
  etag: string;
}

export interface IFileStorageRepository {
  getUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string>;
  getDownloadUrl(key: string, expiresIn?: number): Promise<string>;

  // Multipart Upload
  initiateMultipartUpload(key: string, contentType: string): Promise<string>;
  getMultipartUploadUrl(key: string, uploadId: string, partNumber: number, expiresIn?: number): Promise<string>;
  completeMultipartUpload(key: string, uploadId: string, parts: CompletedPart[]): Promise<void>;
  abortMultipartUpload(key: string, uploadId: string): Promise<void>;
}
