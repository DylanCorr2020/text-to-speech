import React from "react";
import ReactDom from "react-dom";

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.35)",
  backdropFilter: "blur(2px)",
  zIndex: 10000,
};

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#ffffff",
  padding: "32px",
  borderRadius: "16px",
  width: "360px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  textAlign: "center",
  zIndex: 11000,
  animation: "fadeIn 0.2s ease-out",
};

const CLOSE_BUTTON = {
  marginTop: "20px",
  background: "#6366f1",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
  transition: "0.2s",
};

export default function Modal({ open, children, onClose }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={onClose} />

      <div style={MODAL_STYLES}>
        <div style={{ marginBottom: "12px", fontSize: "16px" }}>{children}</div>

        <button style={CLOSE_BUTTON} onClick={onClose}>
          Ok
        </button>
      </div>
    </>,
    document.getElementById("portal")
  );
}