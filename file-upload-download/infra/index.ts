import * as pulumi from "@pulumi/pulumi";
import { S3Bucket, LambdaFunction } from "@lab/pulumi-components";

// Get configuration
const config = new pulumi.Config();
const environment = config.get("environment") || "dev";

// Create S3 bucket for file uploads
const uploadBucket = new S3Bucket("file-upload-bucket", {
  bucketName: `file-upload-${environment}-${pulumi.getStack()}`,
  corsEnabled: true,
  corsAllowedOrigins: ["http://localhost:3000", "http://localhost:5173"], // Client dev servers
  versioning: true,
  lifecycleRules: {
    rules: [
      {
        id: "delete-incomplete-multipart-uploads",
        status: "Enabled",
        abortIncompleteMultipartUpload: {
          daysAfterInitiation: 7,
        },
      },
      {
        id: "transition-to-glacier",
        status: "Enabled",
        transitions: [
          {
            days: 90,
            storageClass: "GLACIER",
          },
        ],
      },
    ],
  },
});

// Lambda function for generating presigned URLs (upload)
const uploadUrlGenerator = new LambdaFunction("upload-url-generator", {
  codePath: "../server/src", // 실제로는 빌드된 람다 코드 경로로 수정 필요
  handler: "lambda/upload-url.handler",
  runtime: "nodejs18.x",
  memorySize: 256,
  timeout: 30,
  environment: {
    variables: {
      UPLOAD_BUCKET: uploadBucket.bucketName,
      ENVIRONMENT: environment,
    },
  },
  policyStatements: [
    {
      Effect: "Allow",
      Action: [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:AbortMultipartUpload",
        "s3:ListMultipartUploadParts",
      ],
      Resource: pulumi.interpolate`${uploadBucket.bucket.arn}/*`,
    },
    {
      Effect: "Allow",
      Action: ["s3:ListBucket"],
      Resource: uploadBucket.bucket.arn,
    },
  ],
});

// Lambda function for generating presigned URLs (download)
const downloadUrlGenerator = new LambdaFunction("download-url-generator", {
  codePath: "../server/src",
  handler: "lambda/download-url.handler",
  runtime: "nodejs18.x",
  memorySize: 256,
  timeout: 30,
  environment: {
    variables: {
      UPLOAD_BUCKET: uploadBucket.bucketName,
      ENVIRONMENT: environment,
    },
  },
  policyStatements: [
    {
      Effect: "Allow",
      Action: ["s3:GetObject", "s3:ListBucket"],
      Resource: [
        uploadBucket.bucket.arn,
        pulumi.interpolate`${uploadBucket.bucket.arn}/*`,
      ],
    },
  ],
});

// Export important values
export const bucketName = uploadBucket.bucketName;
export const uploadLambdaArn = uploadUrlGenerator.functionArn;
export const downloadLambdaArn = downloadUrlGenerator.functionArn;
export const uploadLambdaName = uploadUrlGenerator.functionName;
export const downloadLambdaName = downloadUrlGenerator.functionName;
