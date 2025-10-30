import React from "react";
import Upload from "../components/Upload";
import AudioList from "../components/AudioList";

function HomePage({ user, onSignOut }) {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h2>🎤 Welcome, {user.username}</h2>
        <button
          onClick={onSignOut}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </header>

      <section>
        <Upload />
      </section>

      <hr style={{ margin: "40px 0" }} />

      <section>
        <AudioList />
      </section>
    </div>
  );
}

export default HomePage;