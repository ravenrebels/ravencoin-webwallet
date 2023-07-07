import React from "react";

import { Wallet } from "@ravenrebels/ravencoin-jswallet";

export function Balance({
  balance,
  mempool,
  wallet,
}: {
  wallet: Wallet;
  balance: number;
  mempool: any;
}) {
  let hasPending = false;
  let pending = 0;
  mempool.map((item:any) => {
    hasPending = true;
    if (item.assetName === wallet.baseCurrency) {
      pending = pending + item.satoshis / 1e8;
    }
  });

  const _balance = balance + pending;
  return (
    <article>
      <strong>{wallet.baseCurrency} balance</strong>
      {hasPending === true ? <div><small>* includes pending transactions</small></div> : ""}
      <h1 style={{ paddingBottom: 0, marginBottom: 0 }}>
        {_balance.toLocaleString()}
      </h1>
    </article>
  );
}
