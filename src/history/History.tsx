import React from "react";
import { getHistory } from "@ravenrebels/ravencoin-history-list";
import { AssetName } from "../AssetName";
import { LabeledContent } from "./LabeledContent";
import { ToAddress } from "./ToAddress";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { CopyButton } from "../components/CopyButton";
import { useTransaction } from "../useTransaction";

import networkInfo from "../networkInfo";
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

    const URL = networkInfo[wallet.network].getTransactionURL(
      item.transactionId
    );

    const style2 = {
      background: "var(--pico-background-color)",
    };

    return (
      <article key={item.transactionId} style={style2}>
        <h3>
          <BlockTime
            transactionId={item.transactionId}
            wallet={wallet}
          ></BlockTime>
        </h3>

        <LabeledContent label="Amount">
          {item.assets[0].value.toLocaleString()}{" "}
          <AssetName name={item.assets[0].assetName} />
        </LabeledContent>
        <Spacer y={0.5} />
        <LabeledContent label="Fee">
          <Fee wallet={wallet} transactionId={item.transactionId} />
        </LabeledContent>

        <details style={{ marginTop: "calc(2 * var(--pico-spacing))" }}>
          <summary>More info</summary>

          <div style={{ marginTop: "calc(2 * var(--pico-spacing))" }}>
            <Spacer y={2} />
            <ToAddress wallet={wallet} transactionId={item.transactionId} />
            <Spacer y={2} />
            <fieldset>
              <label>
                Transaction id
                <input type="text" disabled={true} value={item.transactionId} />
              </label>

              <CopyButton value={item.transactionId} title="Copy" />
            </fieldset>
            <Spacer y={2} />
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
  time: number;
}

function BlockTime({ transactionId, wallet }) {
  const transaction = useTransaction(wallet, transactionId);

  if (!transaction) {
    return null;
  }
  const time = new Date(transaction.time * 1000);
  if (time) {
    return time.toLocaleString();
  }
  return null;
}

function Fee({ wallet, transactionId }) {
  const transaction = useTransaction(wallet, transactionId);

  if (!transaction) {
    return null;
  }

  const myAddresses = wallet.getAddresses();

  //We send if any of the outputs are from our wallet
  const sent = transaction.vin.some((input) => {
    if (input.address) {
      return myAddresses.includes(input.address);
    }
    return false;
  });

  if (!sent) {
    return null;
  }
  let totalInput = 0;
  let totalOutput = 0;

  transaction.vin.map((o) => (totalInput += o.value));

  transaction.vout.map((o) => (totalOutput += o.value));

  const fee = totalInput - totalOutput;

  return truncateToFourDecimals(fee);
}

function truncateToFourDecimals(num) {
  return Math.floor(num * 10000) / 10000;
}

function Spacer({ y }: { y: 0.5 | 1 | 2 }) {
  return (
    <div style={{ marginTop: "calc(" + y + "*var(--pico-spacing))" }}></div>
  );
}
