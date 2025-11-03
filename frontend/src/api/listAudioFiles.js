import { list, getUrl } from "aws-amplify/storage";
import { setAmplifyBucket } from "../aws-configure-bucket";

const OUTPUT_BUCKET = "text-to-speech-output-dylan-v2";

export async function listAudioFiles() {
  console.log("🎧 Listing files from OUTPUT bucket...");

  // Switch Amplify to the output bucket
  setAmplifyBucket(OUTPUT_BUCKET);

  // Let Amplify handle the "private/<identityId>" folder automatically
  const listed = await list({
    path: "", // empty path — Amplify figures out user's private folder
    options: { accessLevel: "private" },
  });

  console.log("📦 Raw list result:", listed);

  if (!listed.items || listed.items.length === 0) {
    console.log("No files found in output bucket.");
    console.log(
      "🔑 Paths returned:",
      listed.items.map((i) => i.path)
    );
    return [];
  }

  // Filter only MP3 files and get signed URLs
  const urls = await Promise.all(
    listed.items
      .filter(
        (item) => item?.eTag && item?.path?.toLowerCase().endsWith(".mp3")
      )
      .map(async (item) => {
        const { url } = await getUrl({
          path: item.path, // use path, not key
          options: { accessLevel: "private" },
        });
        return { key: item.path, url }; // key can still be path for display
      })
  );

  console.log("🎵 Found audio files:", urls);
  return urls;
}
