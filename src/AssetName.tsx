import React from "react";

export function AssetName({ name }) {
  if (name.indexOf("/") === -1) {
    return <span>{name}</span>;
  }

  if (name.indexOf("/") > -1) {
    const splitty = name.split("/");
    const result: React.JSX.Element[] = [];
    for (let s of splitty) {
      const index = splitty.indexOf(s);
      const isLast = index === splitty.length - 1;

      if (isLast === false) {
        result.push(<span>{s}/</span>);
        result.push(<wbr></wbr>);
      } else {
        result.push(<span>{s}</span>);
      }
    }

    return <span>{result}</span>;
  }
}
