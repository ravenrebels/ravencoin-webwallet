import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import React from "react";

export function useBlockCount(
  wallet: Wallet | null,
  onError?: (err: Error) => void
) {
  const [blockCount, setBlockCount] = React.useState(0);

  const onErrorRef = React.useRef(onError);
  React.useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  React.useEffect(() => {
    if (!wallet) return;

    let isMounted = true;
    async function fetchBlockCount() {
      try {
        const b = await wallet?.rpc("getblockcount", []);
        if (isMounted && typeof b === "number") {
          setBlockCount((prev) => (b !== prev ? b : prev));
        }
      } catch (e) {
        if (isMounted && onErrorRef.current) {
          onErrorRef.current(e as Error);
        }
      }
    }

    const blockInterval = setInterval(fetchBlockCount, 15 * 1000);
    fetchBlockCount();
    return () => {
      isMounted = false;
      clearInterval(blockInterval);
    };
  }, [wallet]);

  //Fetch updates every 15 seconds
  return blockCount;
}
