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

  // Function to refresh files
  const refreshFiles = async () => {
    try {
      console.log("🔄 Refreshing file list...");
      const urls = await listAudioFiles();
      setAudioFiles(urls); 
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  // Function to handle file deletion
  const handleDelete = async (fileKey, fileName) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      // Set deleting state for this file
      setDeletingFiles((prev) => ({ ...prev, [fileKey]: true }));

      console.log("🗑️ Deleting file:", fileKey);
      await deleteAudioFile(fileKey);

      // Remove from local state immediately
      setAudioFiles((prev) => prev.filter((file) => file.key !== fileKey));

      console.log("✅ File deleted from state");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert(`Failed to delete file: ${err.message}`);
    } finally {
      // Clear deleting state
      setDeletingFiles((prev) => ({ ...prev, [fileKey]: false }));
    }
  };

  useEffect(() => {
    // Initial load
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        await refreshFiles();
      } catch (err) {
        console.error("Error loading files:", err);
      } finally {
        setLoading(false);
      }
    })();

    // Set up auto-refresh every 10 seconds
    refreshIntervalRef.current = setInterval(refreshFiles, 10000);

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Manual refresh function
  const handleManualRefresh = async () => {
    setLoading(true);
    await refreshFiles();
    setLoading(false);
  };

  if (loading) return <p>Loading your audio files...</p>;
  if (!user) return <p>Please sign in to view your audio files.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3>🎧 Your Audio Files</h3>
      
          <Button 
            onClick={handleManualRefresh}>
            Refresh
          </Button>
          <div>
          <small style={{ color: "#666" }}>
            Last refreshed: {new Date(lastRefresh).toLocaleTimeString()}
          </small>
        </div>
      </div>

      {audioFiles.length === 0 ? (
        <p>
          No audio files found. Upload a text file and it will appear here
          automatically!
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {audioFiles.map((file) => {
            const fileName = file.key.split("/").pop();
            const isDeleting = deletingFiles[file.key];

            return (
              <li
                key={file.key}
                style={{
                  marginBottom: "15px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: isDeleting ? "#f8f9fa" : "white",
                  opacity: isDeleting ? 0.6 : 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "15px",
                  }}
                >
                  {/* Audio Player */}
                  <div style={{ flex: 1 }}>
                    <audio
                      controls
                      src={file.url}
                      style={{ width: "100%", maxWidth: "400px" }}
                    />
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {fileName}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(file.key, fileName)}
                    disabled={isDeleting}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: isDeleting ? "#6c757d" : "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isDeleting ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isDeleting ? "⏳ Deleting..." : "🗑️ Delete"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AudioList;