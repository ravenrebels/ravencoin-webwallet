import React from "react";

import { CopyIcon } from "../icons";
export function CopyButton({ value, title }: {value: string, title:string }) {
  return (
    <button
      className="outline"
      title={title}
      style={{ zoom: 0.7 }}
      onClick={(event) => {
        navigator.clipboard.writeText(value);
      }}
    >
      <CopyIcon />
    </button>
  );
}
