import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { IAsset } from "./Types";

const CryptoJS = require("crypto-js");

const S = "U2FsdGVkX1/UYDOP/PD64YU3tbCAeJBR";

export function getMnemonic(): string {
  const raw = localStorage.getItem("mnemonic");
  if (!raw) {
    return "";
  }

  const isEncrypted = raw?.indexOf(" ") === -1;
  //Handle existing plain text mnemonics, by re-saving as encrypted
  if (isEncrypted === false) {
    setMnemonic(raw);
    return raw;
  }

  const decryptedBytes = CryptoJS.AES.decrypt(raw, S);
  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
}

export function setMnemonic(_value: string) {
  const value = _value.trim();

  if (!value) {
    localStorage.setItem("mnemonic", "");
    return;
  }
  const isEncrypted = value.indexOf(" ") === -1;

  //Not encryptred
  if (isEncrypted === true) {
    localStorage.setItem("mnemonic", value);
  } else if (isEncrypted === false) {
    // Encrypting the text

    const cipherText = CryptoJS.AES.encrypt(value, S);

    localStorage.setItem("mnemonic", cipherText);
  }
}
export function getAssetBalanceIncludingMempool(
  wallet: Wallet,
  assets: IAsset[],
  mempool: any
) {
  const allAssets: { [key: string]: number } = {}; //Object with assets from blockchain and from mempool
  //Add assets from blockchain
  assets.map(
    (asset: IAsset) => (allAssets[asset.assetName] = asset.balance / 1e8)
  );

  //Add assets from mempool
  if (mempool && mempool.length > 0) {
    mempool.map((m: IAsset) => {
      //Ignore base currency such as RVN or EVR
      if (m.assetName === wallet.baseCurrency) {
        return;
      }
      const hasAsset = allAssets.hasOwnProperty(m.assetName);

      if (hasAsset === false) {
        allAssets[m.assetName] = 0;
      }
      const pending = getAssetBalanceFromMempool(m.assetName, mempool);
      allAssets[m.assetName] += pending;
    });
  }

  return allAssets;
}
export function getAssetBalanceFromMempool(assetName: string, mempool: any) {
  if (!mempool) {
    return 0;
  }
  if (mempool.length === 0) {
    return 0;
  }

  let pending = 0;
  mempool.map((item: any) => {
    if (item.assetName === assetName) {
      pending = pending + item.satoshis / 1e8;
    }
  });
  return pending;
}

export const WALLET_ADDRESS = "- Wallet address (first address in wallet)";
