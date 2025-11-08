import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";

export class S3CloudFrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket to store React app
    const websiteBucket = new s3.Bucket(this, "MyStaticWebsiteBucket", {
      versioned: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    // Create CloudFront CDN
    const distribution = new cloudfront.Distribution(
      this,
      "MyWebsiteCloudFront",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(websiteBucket),
        },
        defaultRootObject: "index.html",
      }
    );

    // Deploy built React app to S3 + invalidate CloudFront
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("../frontend/build")],
      destinationBucket: websiteBucket,
      distribution: distribution,
      distributionPaths: ["/*"], // ensures cache invalidation
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, "WebsiteURL", {
      value: `https://${distribution.domainName}`,
    });
  }
}
