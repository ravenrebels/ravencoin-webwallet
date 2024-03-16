import React from "react";

export function AssetName({ name }) {
  if (name.indexOf("/") === -1) {
    return <span key={"assetName_" + name}>{name}</span>;
  }

  if (name.indexOf("/") > -1) {
    const splitty = name.split("/");
    const result: React.JSX.Element[] = [];
    for (let s of splitty) {
      const index = splitty.indexOf(s);
      const isLast = index === splitty.length - 1;

      if (isLast === false) {
        result.push(
          <span key={"part1_" + name + s}>
            {s}/<wbr></wbr>
          </span>
        );
      } else {
        result.push(<span key={"part2_" + name + s}>{s}</span>);
      }
    }

    return <span key={Math.random()}>{result}</span>;
  }
}
