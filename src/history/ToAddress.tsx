import React from "react";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { useTransaction } from "../useTransaction";
import { CopyButton } from "../components/CopyButton";

export function ToAddress({
  wallet,
  transactionId,
}: {
  transactionId: string;
  wallet: Wallet;
}) {
  const transaction = useTransaction(wallet, transactionId);

  if (!transaction) {
    return null;
  }

  const myAddresses = wallet.getAddresses();

  const sent = transaction.vin.some((v) => {
    if (!v.address) {
      return false;
    }
    return myAddresses.includes(v.address);
  });

  if (sent) {
    //Get the first address in transaction.vout that is not ours
    const output = transaction.vout.find((out) => {
      if (out.scriptPubKey && out.scriptPubKey.addresses) {
        const addy = out.scriptPubKey.addresses[0];
        return myAddresses.includes(addy) === false;
      }
    });

    if (output) {
      const addy = output.scriptPubKey.addresses[0];

      return (
        <div>
          <label>
            To address
            <input type="text" disabled={true} value={addy} />
          </label>

          <p>
            <CopyButton value={addy} title="Copy" />
          </p>
        </div>
      );
    }
  }
  return <div></div>;
}
