import React from "react";
 
import {CopyIcon} from  "../icons";
export function CopyButton({ value }: { value: string; }) {
  return (
    <button
      style={{ zoom: 0.7 }}
      onClick={(event) => {
        navigator.clipboard.writeText(value);
      }}
    >
      <CopyIcon />
    </button>
  );
}
