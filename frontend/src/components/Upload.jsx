import React, { useState } from "react";
import { uploadFile } from "../api/uploadFile";
import Button from "./UI/Button";
import Modal from "./UI/Modal";
import mammoth from "mammoth";



function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false)
  const [isUpload ,setIsUpload] = useState(false)
  const [voice , setVoice] = useState("Joanna")

 const handleUpload = async () => {
  if (!file) {
    setIsOpen(true);
    return;
  }

  try {
    let fileToUpload = file;

    //DOCX → TXT conversion
    if (file.name.endsWith(".docx")) {
      const arrayBuffer = await file.arrayBuffer();

      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      fileToUpload = new File(
        [text],
        file.name.replace(".docx", ".txt"),
        { type: "text/plain" }
      );
    }
    else if(file.name.endsWith(".html")) {
      const htmlString = await file.text()

      const parser = new DOMParser();
      const parsedDocument = parser.parseFromString(htmlString, "text/html")
      const text = parsedDocument.body.innerText

      fileToUpload = new File(
        [text],
        file.name.replace(".html", ".txt"),
        { type: "text/plain" }
      );

    }

    await uploadFile(fileToUpload ,voice);
    setIsUpload(true);

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
          Click here to upload your file (.txt, .html, .docx)
        </p>
        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#9ca3af" }}>
          
        </p>
      </div>

      <div style={{ marginBottom: "16px", textAlign: "left", maxWidth: "320px", marginInline: "auto" }}>
  
  <label
    htmlFor="voice-select"
    style={{
      display: "block",
      marginBottom: "6px",
      fontSize: "14px",
      fontWeight: 500,
      color: "#374151",
      textAlign: "center",
    }}
  >
    🎙️ Choose Voice
  </label>

  <select
    id="voice-select"
    value={voice}
    onChange={(e) => setVoice(e.target.value)}
    style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      backgroundColor: "#fff",
      fontSize: "14px",
      color: "#111827",
      cursor: "pointer",
      outline: "none",
    }}
  >
      <optgroup label="🇺🇸 US English">
    <option value="Joanna">Joanna (Female)</option>
    <option value="Matthew">Matthew (Male)</option>
  </optgroup>

  <optgroup label="🇬🇧 UK English">
    <option value="Amy">Amy (Female)</option>
    <option value="Emma">Emma (Female)</option>
  </optgroup>

  <optgroup label="🇦🇺 Australian">
    <option value="Olivia">Olivia (Female)</option>
  </optgroup>
</select>
  </div>

      {/* Hidden real input */}
      <input
        id="file-input"
        type="file"
        accept=".txt,.docx,.html"
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