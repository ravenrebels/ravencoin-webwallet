import React from "react";

import { Wallet } from "@ravenrebels/ravencoin-jswallet";

export function Balance({
  wallet,
  balance,
}: {
  wallet: Wallet;
  balance: number;
}) {
 
  return (
    <article> 
      <strong>{wallet.baseCurrency} balance</strong>
      <h1 style={{paddingBottom: 0, marginBottom: 0}}>{balance.toLocaleString()}</h1>
    </article>
  );
}
