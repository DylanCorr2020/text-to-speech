import React, { useState } from "react";
import { uploadFile } from "../api/uploadFile";


function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    try {
      await uploadFile(file);
      setMessage(`✅ Uploaded: ${file.name}`);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed — check console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h3>📄 Upload Text File</h3>
      <input type="file" accept=".txt" onChange={(e) => setFile(e.target.files[0])} />
      <br />
      <button onClick={handleUpload}>
        Upload
      </button>
      <p style={{ marginTop: "10px" }}>{message}</p>
    </div>
  );
}

export default Upload;