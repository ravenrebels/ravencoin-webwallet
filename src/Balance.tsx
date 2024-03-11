import React from "react";

import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { getAssetBalanceFromMempool } from "./utils";

export function Balance({
  balance,
  mempool,
  wallet,
}: {
  wallet: Wallet;
  balance: number;
  mempool: any;
}) {
  let pending = getAssetBalanceFromMempool(wallet.baseCurrency, mempool);
  const hasPending = pending !== 0;
  const price = useUSDPrice(wallet);
  const _balance = balance + pending;

  const dollarValue = (price * _balance).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const balanceText = _balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const unitPriceText = price?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 3, // Adjust the number of decimal places
    maximumFractionDigits: 6, // You can adjust this as needed
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
      </h1>
      {dollarValue && (
        <div className="rebel-balance__value-container">         
          <div className="rebel-balance__dollar-value">{dollarValue} total</div>
          <div className="rebel-balance__base-currency-value">
            {unitPriceText} {wallet.baseCurrency}
          </div>
        </div>
      )}
    </div>
  );
}

function useUSDPrice(wallet: Wallet) {
  const [price, setPrice] = React.useState(0);

  React.useEffect(() => {
    const isRavencoin = wallet && wallet.baseCurrency === "RVN";
    const isEvrmorecoin = wallet && wallet.baseCurrency === "EVR";
    const work = () => {
      if (isRavencoin === true) {
        const URL =
          "https://api1.binance.com/api/v3/ticker/price?symbol=RVNUSDT";
        fetch(URL)
          .then((response) => response.json())
          .then((obj) => {
            setPrice(parseFloat(obj.price));
          });
      }

      if (isEvrmorecoin === true) {
        const URL = "https://api.xeggex.com/api/v2/asset/getbyticker/EVR";
        fetch(URL)
          .then((response) => response.json())
          .then((obj) => {
            const value = parseFloat(obj.usdValue);
            setPrice(value);
          })
          .catch(console.log);
      }
    };
    const interval = setInterval(work, 60 * 1000);
    work();

    return function cleanUp() {
      clearInterval(interval);
    };
  }, []);

  return price;
}
