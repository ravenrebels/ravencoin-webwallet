import React from "react";
import { getHistory } from "@ravenrebels/ravencoin-history-list";

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
export function History({ wallet }) {
  const [history, setHistory] = React.useState<any>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    wallet.getHistory().then(setHistory);
  }, []);
  const items = getHistory(history);
  const listItems = items.map((item: any, index: number) => {
    if (index > 40) {
      return null;
    }
    return (
      <tr key={item.transactionId}>
        <td>
          <BlockTime blockHeight={item.blockHeight} wallet={wallet}></BlockTime>
        </td>
        <td>{item.assets[0].assetName}</td>
        <td>{item.assets[0].value}</td>
      </tr>
    );
  });
  return (
    <article>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Asset</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>{listItems}</tbody>
      </table>
    </article>
  );
}
