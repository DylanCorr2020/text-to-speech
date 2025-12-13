import React, { useState } from "react";
import { uploadFile } from "../api/uploadFile";
import Button from "./UI/Button";
import Modal from "./UI/Modal";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false)
  const [isUpload ,setIsUpload] = useState(false)

  const handleUpload = async () => {
    if (!file) {
      /* setMessage("Please select a file first!"); */
      setIsOpen(true)
        return;
    }

    try {
      await uploadFile(file);
      //setMessage(`✅ Uploaded: ${file.name}`);
      setIsUpload(true)
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed — check console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ marginBottom: "20px", fontSize: "20px", fontWeight: 600 }}>
        📄 Upload Your Study Notes
      </h3>

      {/* Upload Box */}
      <div
        style={{
          border: "2px dashed #c7c9d1",
          borderRadius: "12px",
          padding: "20px",
          background: "#fafbff",
          cursor: "pointer",
          transition: "0.2s",
          marginBottom: "10px",
        }}
        onClick={() => document.getElementById("file-input").click()}
      >
        <p style={{ margin: 0, color: "#6b7280" }}>
          Click here to upload your .txt file
        </p>
        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#9ca3af" }}>
          
        </p>
      </div>

      {/* Hidden real input */}
      <input
        id="file-input"
        type="file"
        accept=".txt"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* File name */}
      {file && (
        <p style={{ margin: "8px 0", color: "#4b5563" }}>
          Selected: <strong>{file.name}</strong>
        </p>
      )}

      <Button onClick={handleUpload}>Upload</Button>

      <Modal open = {isOpen} onClose ={() => setIsOpen(false)}>
         Please select a file first!
      </Modal>

       <Modal open = {isUpload} onClose ={() => setIsUpload(false)}>
        ✅ Uploaded Audio file
      </Modal>

      <p style={{ marginTop: "10px", color: "#555", minHeight: "20px" }}>
        {message}
      </p>
    </div>
  );
}

export default Upload;