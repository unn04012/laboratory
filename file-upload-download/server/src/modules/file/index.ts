import { getS3Config } from '../../config/config.module';
import { FileStorageRepositoryS3 } from './infrastructure/repositories/file-storage.repository.s3';
import { FileService } from './application/services/file.service';
import { FileMapper } from './presentation/http/mappers/file.mapper';
import { FileControllerHttp } from './presentation/http/controllers/file.controller.http';

const instances: {
  fileController: FileControllerHttp | null;
} = {
  fileController: null,
};

export function initFileModule(): void {
  if (instances.fileController) return;

  const s3Config = getS3Config();
  const fileStorageRepository = new FileStorageRepositoryS3(s3Config);
  const fileService = new FileService(fileStorageRepository);
  const fileMapper = new FileMapper();

  instances.fileController = new FileControllerHttp(fileService, fileMapper);
}

export function getFileController(): FileControllerHttp {
  if (!instances.fileController) {
    throw new Error('FileModule is not initialized. Call initFileModule() first.');
  }
  return instances.fileController;
}
