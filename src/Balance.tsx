import React from "react";

import { Wallet } from "@ravenrebels/ravencoin-jswallet";

export function Balance({
  balance,
  mempool,
  wallet,
}: {
  wallet: Wallet;
  balance: number;
  mempool: any;
}) {
  let hasPending = mempool.length > 0;
  let pending = 0;
  mempool.map((item: any) => {
    if (item.assetName === wallet.baseCurrency) {
      pending = pending + item.satoshis / 1e8;
    }
  });

  const price = useUSDPrice();
  const _balance = balance + pending;

  const dollarValue = (price * _balance).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const balanceText = _balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <div>
      {hasPending === true ? (
        <div>
          <small>* includes pending transactions</small>
        </div>
      ) : (
        ""
      )}
      <h1 className="rebel-balance">
        {balanceText} {wallet.baseCurrency}
        <div className="rebel-balance__dollar-value">{dollarValue}</div>
      </h1>
    </div>
  );
}

function useUSDPrice() {
  const [price, setPrice] = React.useState(0);

  React.useEffect(() => {
    const work = () => {
      const URL = "https://api1.binance.com/api/v3/ticker/price?symbol=RVNUSDT";
      fetch(URL)
        .then((response) => response.json())
        .then((obj) => {
          setPrice(parseFloat(obj.price));
        });
    };
    const interval = setInterval(work, 60 * 1000);
    work();

    return function cleanUp() {
      clearInterval(interval);
    };
  }, []);

  return price;
}
