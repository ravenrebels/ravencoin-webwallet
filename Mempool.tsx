import React from "react";
import { getHistory, IDelta } from "@ravenrebels/ravencoin-history-list";
export interface IMempoolProps {
  mempool: IDelta[];
}

export function Mempool({ mempool }: IMempoolProps) {
  const history = getHistory(mempool);

  //OK check the mempool objects and sort by tx id
  //If a transaction say that I send and at he sametime receive, that means that Im sending
  if (history.length > 0) {
    console.log(mempool);
    return (
      <article>
        <ul>
          {history.map((item, index: number) => {
            const asset = item.assets[0];
            const name = asset.assetName;
            const amount = Math.abs(asset.satoshis) / 1e8;
            return (
              <li aria-busy="true" key={index}>
                {item.isSent === true ? "sending" : "receiving"}{" "}
                {amount.toLocaleString()} {name}
              </li>
            );
          })}
        </ul>
      </article>
    );
  }
  return null;
}
