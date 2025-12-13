import React from "react";
import Upload from "../components/Upload";
import AudioList from "../components/AudioList";
import Navbar from "../components/Navbar";

function HomePage({ user, onSignOut }) {

 

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar user={user} onSignOut={onSignOut} />

      <main
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        {/* Upload Card */}
        <div
          style={{
            background: "white",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <Upload />
        </div>

        {/* Audio List Card */}
        <div
          style={{
            background: "white",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <AudioList />
        </div>
      </main>
    </div>
  );
}

export default HomePage;