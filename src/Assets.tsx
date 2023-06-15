import React from "react";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";

const imageStyle = {
  maxWidth: "80px",
  maxHeight: "80px",
  borderRadius: "10px",
  marginRight: "10px",

  background: "white",
};
export function Assets({ wallet, assets }) {
  return (
    <article>
      <h5>Assets / Tokens</h5>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset: any) => {
            if (asset.balance === 0) {
              return null;
            }
            const amount = asset.balance / 1e8;
            return (
              <tr key={asset.assetName}>
                <td>
                  <LinkToIPFS wallet={wallet} assetName={asset.assetName} />
                </td>
                <td>{amount.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </article>
  );
}

interface LinkToIPFSProps {
  wallet: Wallet;
  assetName: string;
}
interface IAsset {
  ipfs_hash: string;
  assetName: string;
}
function LinkToIPFS({ wallet, assetName }: LinkToIPFSProps) {
  const [assetData, setAssetData] = React.useState<IAsset | null>(null);

  React.useEffect(() => {
    const promise = wallet.rpc("getassetdata", [assetName]);
    promise.then(setAssetData);
  }, []);

  if (assetData && assetData.ipfs_hash) {
    const url = "https://cloudflare-ipfs.com/ipfs/" + assetData.ipfs_hash;
    const imageURL =
      "https://rvn-explorer-mainnet.ting.finance/thumbnail?assetName=" +
      encodeURIComponent(assetName);
    return (
      <div>
        <a href={url} target="asset">
          <img
            src={imageURL}
            style={imageStyle}
            onError={(event) => {
              const target = event.target as HTMLImageElement;
              target.style.display = "none";
            }}
          ></img>
          {assetName}
        </a>
      </div>
    );
  }
  return (
    <span>
      <img
        style={imageStyle}
        src="https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png"
      ></img>
      {assetName}
    </span>
  );
}
