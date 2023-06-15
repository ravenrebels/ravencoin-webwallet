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
      <h5>{wallet.baseCurrency} balance</h5>
      <p>{balance.toLocaleString()} RVN</p>
    </article>
  );
}
