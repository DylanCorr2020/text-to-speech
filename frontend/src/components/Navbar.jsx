import React, { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";

// Simple mobile CSS
const mobileStyles = `
  @media (max-width: 768px) {
    .mobile-navbar {
      padding: 12px 16px !important;
    }
    .mobile-navbar h2 {
      font-size: 16px !important;
    }
    .welcome-text-mobile {
      display: none !important; /* Hides on mobile */
    }
    .mobile-navbar button {
      padding: 6px 12px !important;
      font-size: 13px !important;
    }
  }
`;

export default function Navbar({ user, onSignOut }) {
  const [firstName, setFirstName] = useState("User");
  const [isLoading, setIsLoading] = useState(true);

  // Add mobile styles
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = mobileStyles;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    async function getUserInfo() {
      if (!user) return;
      
      try {
        if (user.attributes && user.attributes["custom:firstName"]) {
          setFirstName(user.attributes["custom:firstName"]);
          setIsLoading(false);
          return;
        }
        
        const attributes = await fetchUserAttributes();
        
        if (attributes["custom:firstName"]) {
          setFirstName(attributes["custom:firstName"]);
        } 
        else if (attributes.email) {
          setFirstName(attributes.email.split("@")[0]);
        } 
        else if (user.username) {
          setFirstName(user.username);
        }
      } catch (error) {
        console.error("Error fetching user attributes:", error);
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
      className="mobile-navbar" // Add this class
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
      {/* App Name - shrinks on mobile */}
      <h2 style={{ margin: 0, fontWeight: "600", fontSize: "20px" }}>
        🎤 Study Notes → Podcast
      </h2>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Welcome text - hidden on mobile */}
        {isLoading ? (
          <span className="welcome-text-mobile" style={{ fontSize: "14px", color: "#555" }}>
            Loading...
          </span>
        ) : (
          <span 
            className="welcome-text-mobile" // This gets hidden on mobile
            style={{ margin: 0, fontWeight: "600", fontSize: "20px" }}
          >
            Welcome back, {firstName}!
          </span>
        )}

        {/* Sign Out button - shrinks on mobile */}
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