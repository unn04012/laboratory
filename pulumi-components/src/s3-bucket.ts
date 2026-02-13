import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface S3BucketArgs {
  bucketName?: pulumi.Input<string>;
  corsEnabled?: boolean;
  corsAllowedOrigins?: string[];
  versioning?: boolean;
  lifecycleRules?: aws.s3.BucketLifecycleConfigurationV2Args;
}

/**
 * Reusable S3 Bucket component for laboratory projects
 * Provides common S3 bucket configuration with sensible defaults
 */
export class S3Bucket extends pulumi.ComponentResource {
  public readonly bucket: aws.s3.BucketV2;
  public readonly bucketName: pulumi.Output<string>;

  constructor(
    name: string,
    args: S3BucketArgs = {},
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("lab:s3:Bucket", name, {}, opts);

    // Create S3 bucket
    this.bucket = new aws.s3.BucketV2(
      `${name}-bucket`,
      {
        bucket: args.bucketName,
        tags: {
          Name: name,
          ManagedBy: "Pulumi",
        },
      },
      { parent: this }
    );

    this.bucketName = this.bucket.bucket;

    // Configure versioning if enabled
    if (args.versioning) {
      new aws.s3.BucketVersioningV2(
        `${name}-versioning`,
        {
          bucket: this.bucket.id,
          versioningConfiguration: {
            status: "Enabled",
          },
        },
        { parent: this }
      );
    }

    // Configure CORS if enabled
    if (args.corsEnabled) {
      new aws.s3.BucketCorsConfigurationV2(
        `${name}-cors`,
        {
          bucket: this.bucket.id,
          corsRules: [
            {
              allowedHeaders: ["*"],
              allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
              allowedOrigins: args.corsAllowedOrigins || ["*"],
              exposeHeaders: ["ETag"],
              maxAgeSeconds: 3000,
            },
          ],
        },
        { parent: this }
      );
    }

    // Configure lifecycle rules if provided
    if (args.lifecycleRules) {
      new aws.s3.BucketLifecycleConfigurationV2(
        `${name}-lifecycle`,
        {
          bucket: this.bucket.id,
          ...args.lifecycleRules,
        },
        { parent: this }
      );
    }

    // Block public access by default
    new aws.s3.BucketPublicAccessBlock(
      `${name}-public-access-block`,
      {
        bucket: this.bucket.id,
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      { parent: this }
    );

    this.registerOutputs({
      bucketName: this.bucketName,
      bucketArn: this.bucket.arn,
    });
  }
}
