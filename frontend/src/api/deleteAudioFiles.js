import { remove } from "aws-amplify/storage";
import { fetchAuthSession } from "aws-amplify/auth";
import { setAmplifyBucket } from "../aws-configure-bucket"; // ← Make sure this import exists

const OUTPUT_BUCKET = "text-to-speech-output-dylan-v2";

export async function deleteAudioFile(fileKey) {
  console.log("🗑️ Attempting to delete file:", fileKey);

 
  setAmplifyBucket(OUTPUT_BUCKET);

  try {
    const session = await fetchAuthSession();
    const identityId = session.identityId;

    if (!identityId) {
      throw new Error("User not authenticated");
    }

    // SECURITY: Verify the file belongs to the current user
    if (!fileKey.includes(identityId)) {
      throw new Error("Cannot delete other users' files");
    }

    console.log("✅ User authorized to delete this file");

    // Delete from output bucket (MP3 file)
    console.log("🗑️ Deleting MP3 file:", fileKey);

    // ✅ Use the same approach as listAudioFiles - don't specify bucket in options
    await remove({
      path: fileKey,
      options: {
        accessLevel: "private",
        
      },
    });

    console.log("✅ MP3 file deleted successfully");
    return { success: true };
  } catch (err) {
    console.error("❌ Delete error:", err);
    throw new Error(`Failed to delete file: ${err.message}`);
  }
}
