// Auth tells Amplify how to talk to Cognito
// Storage tells which Amplify S3 bucket to use for Storage.put/list/get
// This file tells us where Cognito pool is and which S3 bucket to read to write to

const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_6zb6KArIF", // ID of your Cognito User Pool (for sign up/sign in)
      userPoolClientId: "n1scgsv8vd8usjpu059lor0s2", // the App Client that connects the frontend to Cognito
      identityPoolId: "eu-west-1:1f72dc96-cd5f-4f94-80f3-81aeedcbc65d", // lets Amplify exchange Cognito tokens for temporary AWS credentials
    },
  },
  Storage: {
    S3: {
      bucket: "text-to-speech-input-dylan-v2",
      region: "eu-west-1",
    },
  },
  region: "eu-west-1",
};

export default awsconfig;
