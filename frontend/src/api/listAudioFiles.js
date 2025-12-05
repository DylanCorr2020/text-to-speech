import { list, getUrl } from "aws-amplify/storage";
import { fetchAuthSession } from "aws-amplify/auth";
import { setAmplifyBucket } from "../aws-configure-bucket";

const OUTPUT_BUCKET = "text-to-speech-output-dylan-v2";

export async function listAudioFiles() {
  console.log("🎧 Listing files from OUTPUT bucket...");

  setAmplifyBucket(OUTPUT_BUCKET);

  try {
    const session = await fetchAuthSession({ forceRefresh: false });
    const identityId = session.identityId;
    console.log("🆔 Current User Identity ID:", identityId);

    if (!identityId) {
      throw new Error("Identity ID is undefined.");
    }

    const listed = await list({
      path: "",
      options: { accessLevel: "private" },
    });

    console.log("📦 Raw list result:", listed);

    if (!listed.items || listed.items.length === 0) {
      console.log("No files found for this user.");
      return [];
    }

    // ✅ CRITICAL: Filter to ONLY current user's files before getting URLs
    const currentUserFiles = listed.items.filter(
      (item) =>
        item.path &&
        item.path.includes(identityId) &&
        item.path.toLowerCase().endsWith(".mp3")
    );

    console.log("👤 Current user's MP3 files:", currentUserFiles);

    const urls = await Promise.all(
      currentUserFiles.map(async (item) => {
        try {
          const { url } = await getUrl({
            path: item.path,
            options: { accessLevel: "private" },
          });
          console.log("Accessible URL:", item.path);
          return {
            key: item.path,
            url,
            fileName: item.path.split("/").pop(),
          };
        } catch (error) {
          console.log(
            "Inaccessible file (will be filtered out):",
            item.path
          );
          return null; // This will be filtered out
        }
      })
    );

    // Remove any null results (files we couldn't access)
    const accessibleUrls = urls.filter((url) => url !== null);

    console.log("🎵 Accessible audio files:", accessibleUrls);
    return accessibleUrls;
  } catch (err) {
    console.error("❌ listAudioFiles error:", err);
    return [];
  }
}
