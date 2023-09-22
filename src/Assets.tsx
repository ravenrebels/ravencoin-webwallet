import React from "react";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { getAssetBalanceFromMempool } from "./utils";

const imageStyle = {
  maxWidth: "80px",
  maxHeight: "80px",
  borderRadius: "10px",
  marginRight: "10px",

  background: "white",
};
export function Assets({ wallet, assets, mempool }) {
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
            const pending = getAssetBalanceFromMempool(
              asset.assetName,
              mempool
            );
            if (asset.balance === 0 && pending === 0) {
              return null;
            }
            const amount = asset.balance / 1e8 + pending;
            return (
              <tr key={asset.assetName}>
                <td style={{ paddingBottom: 20, paddingTop: 20 }}>
                  <LinkToIPFS wallet={wallet} assetName={asset.assetName} />
                </td>
                <td aria-busy={pending !== 0}>{amount.toLocaleString()}</td>
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
          <AssetName name={assetName} />
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
      <AssetName name={assetName} />
    </span>
  );
}

function AssetName({ name }) {
  if (name.indexOf("/") === -1 ) {
    return <div>{name}</div>;
  }

  if (name.indexOf("/") > -1) {
    const splitty = name.split("/");
    const result: React.JSX.Element[] = [];
    for (let s of splitty) {
      const index = splitty.indexOf(s);
      console.log(index, s, name);
      const isLast = splitty.indexOf(s) === splitty.length - 1;
      console.log("is last", isLast, s);
      if (isLast === false) {
        result.push(<span>{s}/</span>);
        result.push(<wbr></wbr>);
      } else {
        result.push(<span>{s}</span>);
      }
    }
    console.log("Return", result);
    return <div>{result}</div>;
  }
}
