import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import React from "react";

export function useBlockCount(wallet: Wallet | null) {
  const [blockCount, setBlockCount] = React.useState(0);

  React.useEffect(() => {
    const blockInterval = setInterval(fetchBlockCount, 15 * 1000);
    fetchBlockCount();
    return () => {
      clearInterval(blockInterval);
    };
  }, [wallet]);
  async function fetchBlockCount() {
    const b = await wallet?.rpc("getblockcount", []);
    if (b !== blockCount) {
      setBlockCount(b);
    } else {
    }
  }
  fetchBlockCount();
  //Fetch updates every 15 seconds
  return blockCount;
}
