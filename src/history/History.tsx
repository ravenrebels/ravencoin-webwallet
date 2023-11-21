import React from "react";
import { getHistory } from "@ravenrebels/ravencoin-history-list";
import { AssetName } from "../AssetName";
import { LabeledContent } from "./LabeledContent";
import { ToAddress } from "./ToAddress";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { CopyButton } from "../components/CopyButton";

interface IProps {
  blockCount: number | null;
  wallet: Wallet;
}
export function History({ blockCount, wallet }: IProps) {
  const [history, setHistory] = React.useState<any>([]);

  React.useEffect(() => {
    wallet.getHistory().then(setHistory);
  }, [blockCount]);

  history.map(
    (h: { value: number; satoshis: number }) => (h.value = h.satoshis / 1e8)
  );

  const items = getHistory(history);
  items.sort((item1, item2) => item2.blockHeight - item1.blockHeight);

  const listItems = items.map((item: any, index: number) => {
    if (index > 20) {
      return null;
    }

    const URL = "https://rvn.cryptoscope.io/tx/?txid=" + item.transactionId;

    const style2 = {
      background: "var(--pico-background-color)",
    };

    return (
      <article key={item.transactionId} style={style2}>
        <h3>
          <BlockTime blockHeight={item.blockHeight} wallet={wallet}></BlockTime>
        </h3>

        <LabeledContent label="Amount">
          {item.assets[0].value.toLocaleString()}{" "}
          <AssetName name={item.assets[0].assetName} />
        </LabeledContent>

        <details style={{ marginTop: "calc(2 * var(--pico-spacing))" }}>
          <summary>More info</summary>

          <div>
            <ToAddress wallet={wallet} transactionId={item.transactionId} />

            <fieldset>
              <h3>Transaction id</h3>

              <input type="text" disabled={true} value={item.transactionId} />

              <CopyButton value={item.transactionId} title="Copy" />
            </fieldset>
            <p>
              <a href={URL} target="_blank">
                View in block explorer
              </a>
            </p>
          </div>
        </details>
      </article>
    );
  });
  return <article>{listItems}</article>;
}

export interface ITransaction {
  vin: any;
  vout: any;
}
//Keep a map/list of block by block height
const heightToBlock = new Map();

function BlockTime({ blockHeight, wallet }) {
  const [time, setTime] = React.useState<any>();

  React.useEffect(() => {
    const block = heightToBlock.get(blockHeight);
    //If we have already cached this block, just set the time
    if (block) {
      const date = new Date(block.time * 1000);
      setTime(date);
    }
    //If we have NOT fetched this block, fetch it, cache it and set time
    else {
      wallet.rpc("getblockhash", [blockHeight]).then((hash: string) => {
        wallet.rpc("getblock", [hash, 1]).then((block: any) => {
          heightToBlock.set(blockHeight, block);
          setTime(new Date(block.time * 1000));
        });
      });
    }
  }, [blockHeight]);

  if (time) {
    return time.toLocaleString();
  }
  return null;
}
