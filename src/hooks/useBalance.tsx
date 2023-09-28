import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import React from "react";
import { Events, addEventListener } from "../Events";

export function useBalance(wallet: Wallet | null, blockCount: number) {
  const [balance, setBalance] = React.useState(0);

  const work = () => {
    if (wallet) {
      wallet.getBalance().then(setBalance);
    }
  };

  React.useEffect(() => {
    work();
  }, [wallet, blockCount]);

  React.useEffect(() => {
    addEventListener(Events.SUSPICION__NEW_BLOCK, work);
    return function () {
      removeEventListener(Events.SUSPICION__NEW_BLOCK, work);
    };
  }, []);
  return balance;
}
