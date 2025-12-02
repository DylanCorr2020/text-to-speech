import React from "react";

export default function Button({
  children,
  variant = "primary",
  style = {},
  ...props
}) {
  const baseStyle = {
    padding: "8px 16px",
    border: "none",
    fontWeight: 500,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
  };

  const variants = {
    primary: {
      background: "#6366f1",
      color: "white",
    },
    secondary: {
      background: "#e5e7eb",
      color: "#111827",
    },
    danger: {
      background: "#ef4444",
      color: "white",
    },
    subtle: {
      background: "#f3f4f6",
      color: "#374151",
    },
  };

  return (
    <button
      {...props}
      style={{
        ...baseStyle,
        ...(variants[variant] || variants.primary),
        ...style, 
      }}
    >
      {children}
    </button>
  );
}