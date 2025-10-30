const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_6zb6KArIF", // from CDK output
      userPoolClientId: "n1scgsv8vd8usjpu059lor0s2", // from CDK output
      identityPoolId: "eu-west-1:1f72dc96-cd5f-4f94-80f3-81aeedcbc65d", // from CDK output
    },
  },
  Storage: {
    S3: {
      bucket: "input-text-bucket-dylan", // name from your CDK bucket
      region: "eu-west-1",
    },
  },
  region: "eu-west-1",
};

export default awsconfig;
