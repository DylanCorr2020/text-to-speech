import React, { useEffect, useState } from "react";
import { listAudioFiles } from "../api/listAudioFiles";

function AudioList() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const urls = await listAudioFiles();
        setAudioFiles(urls);
      } catch (err) {
        console.error("Error listing audio files:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading your audio files...</p>;
  if (audioFiles.length === 0) return <p>No audio files found. Try uploading one!</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h3>🎧 Your Audio Files</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {audioFiles.map((file) => (
          <li key={file.key} style={{ marginBottom: "15px" }}>
            <audio controls src={file.url} />
            <p>{file.key.split("/").pop()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AudioList;