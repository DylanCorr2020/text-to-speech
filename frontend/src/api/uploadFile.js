import { uploadData } from "aws-amplify/storage";

export async function uploadFile(file) {
  if (!file) throw new Error("No file selected");

  // Amplify storage v5+ exposes uploadData etc; this mirrors your existing code
  const result = await uploadData({
    key: file.name,
    data: file,
    options: {
      contentType: file.type,
      accessLevel: "private", // per-user private path
    },
  });

  // some versions return .result, so return whichever exists
  return result.result ?? result;
}
