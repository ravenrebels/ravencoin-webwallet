import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import React from "react";
import { Events, addEventListener, triggerEvent } from "../Events";

export function useMempool(wallet: Wallet | null, blockCount: number) {
  const [mempool, setMempool] = React.useState<any>([]);
  const fetchMempool = async () => {
    if (wallet) {
      const promise = wallet.getMempool();
      const m = await promise;
      //Compare with prev state.
      //If less items in mempool, we suspect a new block is out
      setMempool((prevState: any) => {
        if (prevState.length > m.length) {
          triggerEvent(Events.SUSPICION__NEW_BLOCK);
        }
        return m;
      });
    }
  };

  //Add event listeners ONCE
  React.useEffect(() => {
    const listener = () => {
      console.log("Mempool acting on INFO__TRANSFER_IN_PROCESS event");
      setTimeout(fetchMempool, 1000); //Wait a sec before fetching
    };
    addEventListener(Events.INFO__TRANSFER_IN_PROCESS, listener);
    return () => {
      removeEventListener(Events.INFO__TRANSFER_IN_PROCESS, listener);
    };
  }, []);

  React.useEffect(() => {
    const interval = setInterval(fetchMempool, 10000);
    fetchMempool();

    return () => {
      clearInterval(interval);
    };
  }, [wallet, blockCount]);

  return mempool;
}
