import { Router } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { getFileController } from '../../../index';
import {
  GetUploadUrlRequest,
  GetDownloadUrlRequest,
  InitiateMultipartUploadRequest,
  GetMultipartUploadUrlRequest,
  CompleteMultipartUploadRequest,
  AbortMultipartUploadRequest,
} from '../dto/request.dto';
import { wrapAsync } from '../../../../../shared/utils/wrap-async';
import { ValidationFailedError } from '../../../../../shared/errors/validation.error';

export const fileRouter = Router();

// Simple Upload
fileRouter.get(
  '/upload-url',
  wrapAsync(async (req, res) => {
    const param = plainToClass(GetUploadUrlRequest, req.query);
    const errors = await validate(param);
    if (errors.length > 0) {
      throw new ValidationFailedError(errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('; '));
    }

    const result = await getFileController().getUploadUrl(param);
    res.json(result);
  }),
);

// Download
fileRouter.get(
  '/download-url/:fileKey(*)',
  wrapAsync(async (req, res) => {
    const param = plainToClass(GetDownloadUrlRequest, {
      fileKey: req.params.fileKey,
      expiresIn: req.query.expiresIn ? Number(req.query.expiresIn) : undefined,
    });
    const errors = await validate(param);
    if (errors.length > 0) {
      throw new ValidationFailedError(errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('; '));
    }

    const result = await getFileController().getDownloadUrl(param);
    res.json(result);
  }),
);

// Multipart Upload - Initiate
fileRouter.post(
  '/multipart/initiate',
  wrapAsync(async (req, res) => {
    const body = plainToClass(InitiateMultipartUploadRequest, req.body);
    const errors = await validate(body);
    if (errors.length > 0) {
      throw new ValidationFailedError(errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('; '));
    }

    const result = await getFileController().initiateMultipartUpload(body);
    res.json(result);
  }),
);

// Multipart Upload - Get Part URL
fileRouter.get(
  '/multipart/upload-url',
  wrapAsync(async (req, res) => {
    const param = plainToClass(GetMultipartUploadUrlRequest, {
      fileKey: req.query.fileKey,
      uploadId: req.query.uploadId,
      partNumber: req.query.partNumber ? Number(req.query.partNumber) : undefined,
      expiresIn: req.query.expiresIn ? Number(req.query.expiresIn) : undefined,
    });
    const errors = await validate(param);
    if (errors.length > 0) {
      throw new ValidationFailedError(errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('; '));
    }

    const result = await getFileController().getMultipartUploadUrl(param);
    res.json(result);
  }),
);

// Multipart Upload - Complete
fileRouter.post(
  '/multipart/complete',
  wrapAsync(async (req, res) => {
    const body = plainToClass(CompleteMultipartUploadRequest, req.body);
    const errors = await validate(body);
    if (errors.length > 0) {
      throw new ValidationFailedError(errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('; '));
    }

    await getFileController().completeMultipartUpload(body);
    res.json({ success: true });
  }),
);

// Multipart Upload - Abort
fileRouter.post(
  '/multipart/abort',
  wrapAsync(async (req, res) => {
    const body = plainToClass(AbortMultipartUploadRequest, req.body);
    const errors = await validate(body);
    if (errors.length > 0) {
      throw new ValidationFailedError(errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('; '));
    }

    await getFileController().abortMultipartUpload(body);
    res.json({ success: true });
  }),
);

// Stream Upload - Binary (Postman Binary Upload)
fileRouter.post(
  '/uploads/binary',
  wrapAsync(async (req, res) => {
    const fileName = req.query.fileName as string;
    const contentType = req.headers['content-type'] || 'application/octet-stream';
    console.log(fileName);
    if (!fileName) {
      throw new ValidationFailedError('fileName query parameter is required');
    }

    const result = await getFileController().uploadStreamBinary(req, fileName, contentType);
    res.json(result);
  }),
);

// Stream Upload - Busboy (Multipart Form-Data)
fileRouter.post(
  '/uploads/form-data',
  wrapAsync(async (req, res) => {
    // Content-Type이 multipart/form-data인지 확인
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      throw new ValidationFailedError('Content-Type must be multipart/form-data');
    }

    const result = await getFileController().uploadStreamBusboy(req);
    res.json(result);
  }),
);
