
// React, useState: lets you track user interactions and store data (like which file is selected or what message to show).
// uploadFile: this is a helper function I created that abstracts the actual AWS Amplify call to upload a file to S3.

import React, { useState } from "react";
import { uploadFile } from "../api/uploadFile";


function Upload() {
  //file holds the file user chooses
  const [file, setFile] = useState(null);
  //message holds feedback to show on the screen
  const [message, setMessage] = useState("");
  
  //Prevents running the upload if the user hasn’t picked a file yet.
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }
    
    //call API helper passes the file to your upload helper which 
    // then does internally 
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