import React from "react";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { Asset } from "./Types";
import { QrReader } from "react-qr-reader";
export function Send({
  wallet,
  balance,
  assets,
}: {
  wallet: Wallet;
  balance: number;
  assets: Asset[];
}) {
  const [to, setTo] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [asset, setAsset] = React.useState("-");
  const [showQRCode, setShowQRCode] = React.useState(false);
  function onResult(to) {
    setTo(to);
    setShowQRCode(false);
  }
  const qr = useQRReader(showQRCode, onResult);
  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    //Validate amount
    if (isNaN(parseFloat(amount)) === true) {
      alert(amount + " does not seem like a valid number");
      return;
    }
    //Validate that to address is a valid address
    wallet.rpc("validateaddress", [to]).then((result) => {
      if (result.isvalid === true) {
        //OK we are ready to send
        const c = confirm(
          "Do you want to send " + amount + " " + asset + " to " + to
        );
        if (c === true) {
          const promise = wallet.send({
            toAddress: to,
            assetName: asset,
            amount: parseFloat(amount),
          });

          promise.then((result) => {
            alert("Success");
            setTo("");
            setAmount("");
            setAsset("");
          });
          promise.catch((e) => {
            alert("" + e);
          });
        }
      } else {
        alert(to + " does not seem to be a valid address to send to");
      }
    });
    return false;
  }

  const options = assets.map((asset) => {
    if (asset.balance > 0) {
      const balance = (asset.balance / 1e8).toLocaleString();
      return (
        <option key={asset.assetName} value={asset.assetName}>
          {asset.assetName} - ({balance})
        </option>
      );
    }
    return null;
  });
  return (
    <article>
      <h5>Send / transfer / pay</h5>
      {qr}
      {showQRCode === false && (
        <button style={{ maxWidth: 200 }} onClick={() => setShowQRCode(true)}>
          Scan QR code
        </button>
      )}
      <form onSubmit={onSubmit}>
        <label>
          Asset
          <select
            onChange={(event) => setAsset(event.target.value)}
            value={asset}
          >
            <option>-</option>
            <option value="RVN">RVN ({balance})</option>
            {options}
          </select>
        </label>
        <label>
          Amount
          <input
            onChange={(event) => setAmount(event.target.value)}
            type="text"
            value={amount}
          ></input>
        </label>
        <label>
          To
          <input
            name="to"
            onChange={(event) => setTo(event.target.value)}
            value={to}
            type="text"
          />
        </label>
        <button>Send</button>
      </form>
    </article>
  );
}

function useQRReader(
  showQRCode: boolean,
  onResult: (value: string | null) => void
) {
  const [qr, setQR] = React.useState(<></>);
  const [mode, setMode] = React.useState("environment");
  React.useEffect(() => {
    if (showQRCode === false) {
      setQR(<></>);
    } else {
      const q = (
        <div>
          <QrReader
            key={"qr" + new Date().toISOString()}
            constraints={{
              facingMode: mode,
            }}
            scanDelay={100}
            onResult={(result, error) => {
              if (!!result) {
                onResult(result?.text);
              }

              if (!!error) {
              }
            }}
          />
          <div className="grid">
            <button
              className="secondary"
              onClick={() => {
                const newMode = mode === "environment" ? "user" : "environment";

                setMode(newMode);
              }}
            >
              Toggle mode
            </button>
            <button onClick={() => onResult("")} className="secondary">
              Close camera
            </button>
          </div>
        </div>
      );
      setQR(q);
    }
  }, [showQRCode, mode]);

  return qr;
}
