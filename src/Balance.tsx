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
  let hasPending = mempool.length > 0;
  let pending = 0;
  mempool.map((item: any) => {
    if (item.assetName === wallet.baseCurrency) {
      pending = pending + item.satoshis / 1e8;
    }
  });

  const _balance = balance + pending;

  const balanceText = _balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <div>
      {hasPending === true ? (
        <div>
          <small>* includes pending transactions</small>
        </div>
      ) : (
        ""
      )}
      <h1 style={{ textAlign: "center" }}>
        {balanceText} {wallet.baseCurrency}
      </h1>
    </div>
  );
}
