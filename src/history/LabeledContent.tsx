import React from "react";

export function LabeledContent({ label, children }) {
  const style = {
    paddingTop: "var(--pico-spacing)",
    maxWidth: "300px",
    display: "flex",
    justifyContent: "space-between",
  };
  return (
    <div style={style}>
      <div>{label}</div>
      <div>{children}</div>
    </div>
  );
}
