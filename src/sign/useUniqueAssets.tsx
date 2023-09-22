import React from "react";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { Asset } from "../Types";

export function useUniqueAssets(wallet: Wallet, assets: Asset[]) {
  const [uniqueAssets, setUniqueAssets] = React.useState<Asset[] | null>(null);

  const work = () => {
    const tempAssets: Asset[] = [];
    for (let asset of assets) {
      //If asset balance is not exactly one it is obviously not an unique asset
      //Note asset.balance is in satoshis so 100 million is one, so multiply by 1e8
      if (asset.balance !== 1 * 100000000) {
        continue;
      }
      const promise = wallet.rpc("getassetdata", [asset.assetName]);
      promise.then((data) => {
        if (data.amount == 1 && data.reissuable === 0) {
          tempAssets.push(asset);
          const arrayCopy = tempAssets.concat([]);
          setUniqueAssets(arrayCopy);
        }
      });
    }
  };

  React.useEffect(work, [wallet, assets]);
  return uniqueAssets;
}
