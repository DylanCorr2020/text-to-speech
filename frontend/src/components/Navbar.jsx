import React from "react";

export default function Navbar({ user, onSignOut }) {
  return (
    <nav
      style={{
        width: "100%",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* App Name */}
      <h2 style={{ margin: 0, fontWeight: "600", fontSize: "20px"}}>
        🎤 Study Notes → Podcast
      </h2>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <span style={{ fontSize: "14px", color: "#555" }}>
          {user?.username}
        </span>

        <button
          onClick={onSignOut}
          style={{
            padding: "8px 16px",
            background: "#6366f1",
            border: "none",
            color: "white",
            fontWeight: "500",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}