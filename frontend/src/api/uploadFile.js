import { uploadData } from "aws-amplify/storage";
import { setAmplifyBucket } from "../aws-configure-bucket";

const INPUT_BUCKET = "text-to-speech-input-dylan-v2";

export async function uploadFile(file , voice) {
  if (!file) throw new Error("No file selected");

  // Switch Amplify to the input bucket before upload
  setAmplifyBucket(INPUT_BUCKET);

  const result = await uploadData({
    key: file.name,
    data: file,
    options: {
      contentType: file.type,
      accessLevel: "private", // user private folder

      metadata: {
        voice: voice, 
      },
    },
  });

  return result.result ?? result;
}
