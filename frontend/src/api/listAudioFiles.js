import { list, getUrl } from "aws-amplify/storage";

export async function listAudioFiles() {
  const listed = await list({ path: "", options: { accessLevel: "private" } });

  if (!listed.items || listed.items.length === 0) return [];

  const urls = await Promise.all(
    listed.items
      .filter((item) => item?.key?.endsWith(".mp3"))
      .map(async (item) => {
        const urlData = await getUrl({
          path: item.key,
          options: { accessLevel: "private" },
        });
        return { key: item.key, url: urlData.url };
      })
  );

  return urls;
}
