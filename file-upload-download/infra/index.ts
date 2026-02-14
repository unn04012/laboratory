import * as pulumi from '@pulumi/pulumi';
import { S3Bucket } from '@lab/pulumi-components';

// Get configuration
const config = new pulumi.Config();
const environment = config.get('environment') || 'dev';

// Create S3 bucket for file uploads
const uploadBucket = new S3Bucket('file-upload-bucket', {
  bucketName: `file-upload-${environment}-${pulumi.getStack()}`,
  corsEnabled: true,
  corsAllowedOrigins: ['http://localhost:3000', 'http://localhost:5173'],
  versioning: true,
});

// Export S3 bucket info (Lambda에서 환경변수로 사용)
export const bucketName = uploadBucket.bucketName;
export const bucketArn = uploadBucket.bucket.arn;
