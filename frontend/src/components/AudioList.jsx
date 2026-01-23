import React, { useState, useEffect, useRef } from "react";
import { listAudioFiles } from "../api/listAudioFiles";
import { deleteAudioFile } from "../api/deleteAudioFiles";
import { getCurrentUser } from "aws-amplify/auth";
import Button from "./UI/Button";
import DeleteModal from "./UI/DeleteModal";
import styles from "../styles/AudioList.module.css";

function AudioList() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [deletingFiles, setDeletingFiles] = useState({});
 // const refreshIntervalRef = useRef(null);

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Refresh list of files
  const refreshFiles = async () => {
    try {
      const urls = await listAudioFiles();
      setAudioFiles(urls);
      setLastRefresh(Date.now());
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  // Open delete modal
  const handleDelete = (fileKey, fileName) => {
    setSelectedFile({ fileKey, fileName });
    setDeleteModalOpen(true);
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

    //return () => clearInterval(refreshIntervalRef.current);
  }, []);

  const handleManualRefresh = async () => {
    setLoading(true);
    await refreshFiles();
    setLoading(false);
  };

  if (loading) return <p>Loading your audio files...</p>;
  if (!user) return <p>Please sign in to view your audio files.</p>;

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>🎧 Your Audio Files</h3>

        <div className={styles.headerButton}>
          <Button onClick={handleManualRefresh}>Refresh</Button>
        </div>

      </div>

      
        <small 
        style={{
           display: "flex",
           justifyContent: "flex-end",
           marginTop: "12px",
           fontSize: "13px",
           color: "#6b7280",

        }} className={styles.lastUpdated}>
            Updated {new Date(lastRefresh).toLocaleTimeString()}
        </small>

      {/* List */}
      {audioFiles.length === 0 ? (
        <p className={styles.emptyMessage}>
          No audio files yet — upload a text file to generate one!
        </p>
      ) : (
        <div>
          {audioFiles.map((file) => {
            const fileName = file.key.split("/").pop();
            const isDeleting = deletingFiles[file.key];

            return (
              <div
                key={file.key}
                className={`${styles.audioItem} ${isDeleting ? styles.deleting : ''}`}
              >
                {/* Icon and file info */}
                <div className={styles.audioContent}>
                 

                  {/* Main content */}
                  <div className={styles.fileInfo}>
                    <p className={styles.fileName}>
                      {fileName}
                    </p>

                    <audio
                      controls
                      src={file.url}
                      className={styles.audioPlayer}
                    />
                  </div>
                </div>

                {/* Delete button */}
                <div className={styles.deleteButtonContainer}>
                  <button
                    onClick={() => handleDelete(file.key, fileName)}
                    disabled={isDeleting}
                    className={styles.deleteButton}
                  >
                    {isDeleting ? "Deleting..." : "🗑 Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          setDeleteModalOpen(false);

          try {
            setDeletingFiles((prev) => ({
              ...prev,
              [selectedFile.fileKey]: true,
            }));

            await deleteAudioFile(selectedFile.fileKey);

            setAudioFiles((prev) =>
              prev.filter((file) => file.key !== selectedFile.fileKey)
            );
          } catch (err) {
            console.error("Delete error:", err);
          } finally {
            setDeletingFiles((prev) => ({
              ...prev,
              [selectedFile.fileKey]: false,
            }));
          }
        }}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedFile?.fileName}</strong>?
        </p>
      </DeleteModal>
    </div>
  );
}

export default AudioList;