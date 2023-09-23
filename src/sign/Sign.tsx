import React from "react";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { IAsset } from "../Types";
import { CopyButton } from "./CopyButton";
import { useUniqueAssets } from "./useUniqueAssets";
import { useSignature } from "./useSignature";
import { useAddressObject } from "./useAddressObject";
import { CopyIcon } from "../icons";
export function Sign({ assets, wallet }: { assets: IAsset[]; wallet: Wallet }) {
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
          You do not have any unique assets.
          <br /> You need a unique asset to sign messages
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
              return (
                <option
                  key={asset.assetName}
                  selected={asset.assetName === selectedAsset}
                >
                  {asset.assetName}
                </option>
              );
            })}
        </select>
      </label>
      <CopyButton value={selectedAsset}  title="Copy asset name"/>
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
      <CopyButton value={text} title="Copy message"/>
      <hr />
      <label>
        Signature
        <textarea value={signature}></textarea>
      </label>

      <button
        style={{ zoom: 0.7 }}
        onClick={(event) => navigator.clipboard.writeText(signature)}
      >
        <CopyIcon />&nbsp;&nbsp;Copy signature
      </button>
    </article>
  );
}
