import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import React from "react";

export function useReceiveAddress(wallet: Wallet | null, blockCount: number) {
  const [receiveAddress, setReceiveAddress] = React.useState("");

  React.useEffect(() => {
    if (wallet) {
      wallet.getReceiveAddress().then(setReceiveAddress);
    }
  }, [blockCount]);

  return receiveAddress;
}
