import React from "react";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";

export function useAddressObject(wallet: Wallet, assetName: string) {
  const [addressObject, setAddressObject] = React.useState<any>(null);

  React.useEffect(() => {
    if (!assetName) {
      setAddressObject(null);
      return;
    }
    //Find the address for the asset, listaddressesbyasset "asset_name"
    const promise = wallet.rpc("listaddressesbyasset", [assetName]);
    promise.then((data) => {
      const addy = Object.keys(data)[0];
      const addressObject = wallet
        .getAddressObjects()
        .find((obj) => obj.address === addy);
      setAddressObject(addressObject);
    });
  }, [assetName]);

  if (assetName === "-") {
    return null;
  }
  return addressObject;
}
