import React from "react";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { ITransaction } from "./history/History";

const _cache = {};
export function useTransaction(wallet: Wallet, transactionId: string) {
  const [transaction, setTransaction] = React.useState<null | ITransaction>(
    null
  );

  React.useEffect(() => {
    let key = transactionId;

    if (!_cache[key]) {
      const promise = wallet.rpc("getrawtransaction", [transactionId, true]);
      _cache[key] = promise;
    }

    let promise = _cache[key];
    promise.then((t) => setTransaction(t));
  }, [wallet, transactionId]);

  return transaction;
}
