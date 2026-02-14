import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
});

export const s3Config = {
  bucket: process.env.AWS_S3_BUCKET || '',
  region: process.env.AWS_REGION || 'ap-northeast-2',
  defaultExpiresIn: 3600, // 1 hour
};
