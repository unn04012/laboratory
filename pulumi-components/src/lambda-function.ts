import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface LambdaFunctionArgs {
  /**
   * Path to the Lambda function code (zip file or directory)
   */
  codePath: pulumi.Input<string>;

  /**
   * Handler function (e.g., "index.handler")
   */
  handler: pulumi.Input<string>;

  /**
   * Runtime environment (e.g., "nodejs18.x", "python3.11")
   */
  runtime: pulumi.Input<aws.lambda.Runtime>;

  /**
   * Environment variables for the Lambda function
   */
  environment?: pulumi.Input<{
    variables?: pulumi.Input<{ [key: string]: pulumi.Input<string> }>;
  }>;

  /**
   * Memory size in MB (default: 128)
   */
  memorySize?: pulumi.Input<number>;

  /**
   * Timeout in seconds (default: 30)
   */
  timeout?: pulumi.Input<number>;

  /**
   * IAM policy statements to attach to the Lambda execution role
   */
  policyStatements?: pulumi.Input<aws.iam.PolicyStatement>[];
}

/**
 * Reusable Lambda Function component for laboratory projects
 * Provides common Lambda configuration with IAM role and basic permissions
 */
export class LambdaFunction extends pulumi.ComponentResource {
  public readonly function: aws.lambda.Function;
  public readonly role: aws.iam.Role;
  public readonly functionArn: pulumi.Output<string>;
  public readonly functionName: pulumi.Output<string>;

  constructor(
    name: string,
    args: LambdaFunctionArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("lab:lambda:Function", name, {}, opts);

    // Create IAM role for Lambda
    this.role = new aws.iam.Role(
      `${name}-role`,
      {
        assumeRolePolicy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Action: "sts:AssumeRole",
              Principal: {
                Service: "lambda.amazonaws.com",
              },
              Effect: "Allow",
            },
          ],
        }),
        tags: {
          Name: `${name}-role`,
          ManagedBy: "Pulumi",
        },
      },
      { parent: this }
    );

    // Attach basic Lambda execution policy
    new aws.iam.RolePolicyAttachment(
      `${name}-basic-execution`,
      {
        role: this.role.name,
        policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
      },
      { parent: this }
    );

    // Attach custom policy if provided
    if (args.policyStatements && args.policyStatements.length > 0) {
      new aws.iam.RolePolicy(
        `${name}-custom-policy`,
        {
          role: this.role.id,
          policy: pulumi.output(args.policyStatements).apply((statements) =>
            JSON.stringify({
              Version: "2012-10-17",
              Statement: statements,
            })
          ),
        },
        { parent: this }
      );
    }

    // Create Lambda function
    this.function = new aws.lambda.Function(
      `${name}-function`,
      {
        code: new pulumi.asset.FileArchive(args.codePath),
        handler: args.handler,
        runtime: args.runtime,
        role: this.role.arn,
        environment: args.environment,
        memorySize: args.memorySize || 128,
        timeout: args.timeout || 30,
        tags: {
          Name: name,
          ManagedBy: "Pulumi",
        },
      },
      { parent: this }
    );

    this.functionArn = this.function.arn;
    this.functionName = this.function.name;

    this.registerOutputs({
      functionArn: this.functionArn,
      functionName: this.functionName,
      roleArn: this.role.arn,
    });
  }
}
