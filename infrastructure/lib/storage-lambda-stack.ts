import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import { Duration } from "aws-cdk-lib";

export class StorageAndLambdaStack extends cdk.Stack {
  public readonly inputBucket: s3.Bucket;
  public readonly outputBucket: s3.Bucket;
  public readonly ttsLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🪣 Create S3 Buckets
    this.inputBucket = new s3.Bucket(this, "InputBucketV2", {
      bucketName: "text-to-speech-input-dylan-v2",
      cors: [
        {
          allowedHeaders: ["*"],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD,
          ],
          allowedOrigins: [
            "http://localhost:3000",
            "https://d1cau4pyc1cz7k.cloudfront.net",
          ],
          exposedHeaders: [],
        },
      ],

      //clean up text files
      lifecycleRules: [
        {
          id: "DeleteInputTextFiles",
          prefix: "private/",
          enabled: true,
          expiration: Duration.days(7),
        },
      ],
    });

    this.outputBucket = new s3.Bucket(this, "OutputBucketV2", {
      bucketName: "text-to-speech-output-dylan-v2",
      cors: [
        {
          allowedHeaders: ["*"],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD,
          ],
          allowedOrigins: [
            "http://localhost:3000",
            "https://d1cau4pyc1cz7k.cloudfront.net",
          ],
          exposedHeaders: [],
        },
      ],
    });

    // Lambda Function
    this.ttsLambda = new lambda.Function(this, "TextToSpeechLambdaV2", {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: "textToSpeechHandler.lambda_handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        OUTPUT_BUCKET: this.outputBucket.bucketName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
    });

    // 🪣 Grant Permissions
    this.inputBucket.grantRead(this.ttsLambda);
    this.outputBucket.grantReadWrite(this.ttsLambda);

    // 🎤 Allow access to Polly
    this.ttsLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["polly:SynthesizeSpeech"],
        resources: ["*"],
      })
    );

    //Add Event Notification
    this.inputBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3n.LambdaDestination(this.ttsLambda),
      { prefix: "private/", suffix: ".txt" }
    );

    //Outputs
    new cdk.CfnOutput(this, "InputBucketName", {
      value: this.inputBucket.bucketName,
    });
    new cdk.CfnOutput(this, "OutputBucketName", {
      value: this.outputBucket.bucketName,
    });
    new cdk.CfnOutput(this, "LambdaName", {
      value: this.ttsLambda.functionName,
    });
  }
}
