import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

export function setAmplifyBucket(bucketName) {
  Amplify.configure({
    ...awsconfig,
    Storage: {
      S3: {
        bucket: bucketName,
        region: awsconfig.region,
      },
    },
  });
}
