
import React, { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";

export default function Navbar({ user, onSignOut }) {
  const [firstName, setFirstName] = useState("User");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUserInfo() {
      if (!user) return;
      
      try {
        // Try to get attributes from the user object first
        if (user.attributes && user.attributes["custom:firstName"]) {
          setFirstName(user.attributes["custom:firstName"]);
          setIsLoading(false);
          return;
        }
        
        // Fetch attributes explicitly if not found in user object
        const attributes = await fetchUserAttributes();
        
        // Check for custom:firstName
        if (attributes["custom:firstName"]) {
          setFirstName(attributes["custom:firstName"]);
        } 
        // Fallback to email if first name is not set
        else if (attributes.email) {
          setFirstName(attributes.email.split("@")[0]);
        } 
        // Fallback to username
        else if (user.username) {
          setFirstName(user.username);
        }
      } catch (error) {
        console.error("Error fetching user attributes:", error);
        // Fallback to username
        if (user.username) {
          setFirstName(user.username.split("@")[0]);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    getUserInfo();
  }, [user]);

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
        {isLoading ? (
          <span style={{ fontSize: "14px", color: "#555" }}>Loading...</span>
        ) : (
          <span style={{ margin: 0, fontWeight: "600", fontSize: "20px"}}>
            Welcome back, {firstName}!
          </span>
        )}

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
          onMouseEnter={(e) => e.target.style.background = "#4f46e5"}
          onMouseLeave={(e) => e.target.style.background = "#6366f1"}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}