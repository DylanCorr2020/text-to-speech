import React, { useState, useEffect, useRef } from "react";
import { listAudioFiles } from "../api/listAudioFiles";
import { deleteAudioFile } from "../api/deleteAudioFiles";
import { getCurrentUser } from "aws-amplify/auth";
import Button from "./UI/Button";

function AudioList() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [deletingFiles, setDeletingFiles] = useState({});
  const refreshIntervalRef = useRef(null);

  // Refresh files
  const refreshFiles = async () => {
    try {
      const urls = await listAudioFiles();
      setAudioFiles(urls);
      setLastRefresh(Date.now());
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  // Delete
  const handleDelete = async (fileKey, fileName) => {
    if (!window.confirm(`Delete "${fileName}"?`)) return;

    try {
      setDeletingFiles((prev) => ({ ...prev, [fileKey]: true }));
      await deleteAudioFile(fileKey);
      setAudioFiles((prev) => prev.filter((file) => file.key !== fileKey));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingFiles((prev) => ({ ...prev, [fileKey]: false }));
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        await refreshFiles();
      } finally {
        setLoading(false);
      }
    })();

    refreshIntervalRef.current = setInterval(refreshFiles, 10000);

    return () => clearInterval(refreshIntervalRef.current);
  }, []);

  const handleManualRefresh = async () => {
    setLoading(true);
    await refreshFiles();
    setLoading(false);
  };

  if (loading) return <p>Loading your audio files...</p>;
  if (!user) return <p>Please sign in to view your audio files.</p>;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 600 }}>
          🎧 Your Audio Files
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Button onClick={handleManualRefresh}>Refresh</Button>

          <small
            style={{
              background: "#f3f4f6",
              padding: "6px 10px",
              borderRadius: "8px",
              color: "#555",
            }}
          >
            Updated {new Date(lastRefresh).toLocaleTimeString()}
          </small>
        </div>
      </div>

      {/* List */}
      {audioFiles.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          No audio files yet — upload a text file to generate one!
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {audioFiles.map((file) => {
            const fileName = file.key.split("/").pop();
            const isDeleting = deletingFiles[file.key];

            return (
              <div
                key={file.key}
                style={{
                  padding: "20px",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  opacity: isDeleting ? 0.5 : 1,
                  transition: "0.2s",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  🎵
                </div>

                {/* Main column */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 500,
                      fontSize: "16px",
                    }}
                  >
                    {fileName}
                  </p>

                  <audio
                    controls
                    src={file.url}
                    style={{
                      marginTop: "8px",
                      width: "100%",
                      maxWidth: "500px",
                    }}
                  />
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(file.key, fileName)}
                  disabled={isDeleting}
                  style={{
                    padding: "10px 14px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isDeleting ? "Deleting..." : "🗑 Delete"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AudioList;