import React from "react";

export function LabeledContent({ label, children }) {
  const style = {
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
