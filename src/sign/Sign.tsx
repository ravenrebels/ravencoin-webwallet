import React from "react";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { Asset } from "../Types";
import { CopyButton } from "./CopyButton";
import { useUniqueAssets } from "./useUniqueAssets";
import { useSignature } from "./useSignature";
import { useAddressObject } from "./useAddressObject";
export function Sign({ assets, wallet }: { assets: Asset[]; wallet: Wallet }) {
  const [text, setText] = React.useState("");
  const [selectedAsset, setSelectedAsset] = React.useState<string>("");

  const uniqueAssets = useUniqueAssets(wallet, assets);

  const addressObject = useAddressObject(wallet, selectedAsset);
  const signature = useSignature(addressObject, text);

  if (uniqueAssets) {
    uniqueAssets.sort(function (a, b) {
      return a.assetName.localeCompare(b.assetName);
    });
  }

  if (!uniqueAssets || uniqueAssets.length === 0) {
    return (
      <article>
        <h5>Sign</h5>
        <p>
          You do not have any unique assets.<br/> You need a unique asset to sign
          messages
        </p>
      </article>
    );
  }
  return (
    <article>
      <h5>Sign</h5>
      <label>
        Select asset
        <select
          onChange={(event) => {
            const name = event.target.value;
            setSelectedAsset(name);
          }}
        >
          <option>-</option>
          {uniqueAssets &&
            uniqueAssets.map((asset) => {
              return <option key={asset.assetName}>{asset.assetName}</option>;
            })}
        </select>
      </label>
      <CopyButton value={selectedAsset} />
      <hr />

      <label>
        Message to sign{" "}
        <textarea
          onChange={(event) => {
            const value = event.target.value;
            setText(value);
          }}
        >
          {text}
        </textarea>
      </label>
      <CopyButton value={text} />
      <hr />
      <label>
        Signature
        <textarea value={signature}></textarea>
      </label>
      <CopyButton value={signature} />
    </article>
  );
}

