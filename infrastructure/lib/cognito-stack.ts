import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";

//User Pool	Stores and manages users (sign-up / sign-in)
//User Pool Client	Connects your frontend to the user pool
//Identity Pool	Converts authenticated users into AWS credentials
//Authenticated Role	Defines what AWS resources logged-in users can access
//Outputs	Provide config for your frontend and other stacks

export class CognitoStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly identityPool: cognito.CfnIdentityPool;
  public readonly authenticatedRole: iam.Role;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create User Pool (email sign-in)
    this.userPool = new cognito.UserPool(this, "UserPool-V2", {
      userPoolName: "TextToSpeechUserPool-V2",
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
    });

    //Create App Client (for frontend)
    this.userPoolClient = new cognito.UserPoolClient(
      this,
      "UserPoolClient-V2",
      {
        userPool: this.userPool,
        generateSecret: false,
      }
    );

    // Identity Pool (to give users AWS credentials)
    this.identityPool = new cognito.CfnIdentityPool(this, "IdentityPool-V2", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    //Authenticated role (assumed by signed-in users)
    this.authenticatedRole = new iam.Role(this, "AuthenticatedRole-V2", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    //Attach role to identity pool
    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      "IdentityPoolRoleAttachment",
      {
        identityPoolId: this.identityPool.ref,
        roles: {
          authenticated: this.authenticatedRole.roleArn,
        },
      }
    );

    //Allow authenticated users to access their own private files
    this.authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "s3:ListBucket",
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
        ],
        resources: [
          // Allow listing the bucket
          "arn:aws:s3:::text-to-speech-input-dylan-v2",
          // Allow read/write in private folder
          "arn:aws:s3:::text-to-speech-input-dylan-v2/private/${cognito-identity.amazonaws.com:sub}/*",
          // Same for output bucket
          "arn:aws:s3:::text-to-speech-output-dylan-v2",
          "arn:aws:s3:::text-to-speech-output-dylan-v2/private/${cognito-identity.amazonaws.com:sub}/*",
        ],
      })
    );

    //Outputs
    new cdk.CfnOutput(this, "UserPoolId", { value: this.userPool.userPoolId });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "IdentityPoolId", { value: this.identityPool.ref });
  }
}
