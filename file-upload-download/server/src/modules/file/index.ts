import { s3Client, s3Config } from '../../config/aws.config';
import { FileStorageRepositoryS3 } from './infrastructure/repositories/file-storage.repository.s3';
import { FileService } from './application/services/file.service';
import { FileMapper } from './presentation/http/mappers/file.mapper';
import { FileControllerHttp } from './presentation/http/controllers/file.controller.http';

const fileStorageRepository = new FileStorageRepositoryS3(
  s3Client,
  s3Config.bucket,
  s3Config.defaultExpiresIn,
);
const fileService = new FileService(fileStorageRepository);
const fileMapper = new FileMapper();
const fileController = new FileControllerHttp(fileService, fileMapper);

export { fileController };
