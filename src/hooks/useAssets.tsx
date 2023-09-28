import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import React from "react";
import { IAsset } from "../Types";

export function useAssets(wallet: Wallet | null, blockCount: number) {
  const [assets, setAssets] = React.useState<IAsset[]>([]);

  React.useEffect(() => {
    if (wallet) {
      wallet.getAssets().then(setAssets);
    }
  }, [wallet, blockCount]);
  return assets;
}
