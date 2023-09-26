import React from "react";
import { getHistory, IDelta } from "@ravenrebels/ravencoin-history-list";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { AssetLink } from "./AssetLink";
import { AssetName } from "./AssetName";
export interface IMempoolProps {
  mempool: IDelta[];
  wallet: Wallet;
}

export function Mempool({ mempool, wallet }: IMempoolProps) {
  const history = getHistory(mempool);

  //OK check the mempool objects and sort by tx id
  //If a transaction say that I send and at he sametime receive, that means that Im sending
  if (history.length > 0) {
    return (
      <article id="mempool" tabIndex={0} aria-busy="true">
        <ul>
          {history.map((item, index: number) => {
            const asset = item.assets[0];
            const name = asset.assetName;
            const amount = Math.abs(asset.satoshis) / 1e8;
            return (
              <li key={index}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {item.isSent === true ? "sending" : "receiving"}{" "}
                    {amount.toLocaleString()} <AssetName name={name}/>
                  </div>

                  <div>
                    <AssetLink wallet={wallet} assetName={name} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </article>
    );
  }
  return <span id="mempool" tabIndex={0} />;
}
