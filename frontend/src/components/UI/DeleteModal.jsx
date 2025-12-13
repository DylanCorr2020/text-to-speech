import React from 'react'
import ReactDom from "react-dom";

const OVERLAY = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(2px)",
  zIndex: 10000,
};

const MODAL = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "380px",
  background: "white",
  padding: "28px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  textAlign: "center",
  zIndex: 11000,
};

const BUTTON = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "14px",
};

const CANCEL_BUTTON = {
  ...BUTTON,
  background: "#e5e7eb",
  color: "#374151",
  marginRight: "12px",
};

const DELETE_BUTTON = {
  ...BUTTON,
  background: "#ef4444",
  color: "white",
};

function DeleteModal({open , onCancel, onConfirm , children}) {
   
  if(!open) return null;

  return ReactDom.createPortal(
    <div style={OVERLAY}>
    
    <div style={MODAL}>
        
     {children}

     <button style={CANCEL_BUTTON} onClick={onCancel}>Cancel</button>

     <button style={DELETE_BUTTON} onClick={onConfirm}>Delete</button>
        
       </div>
    </div>,
     document.getElementById("portal")
  )
}

export default DeleteModal