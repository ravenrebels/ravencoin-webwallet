import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { WalletState } from "./store";

export async function walletSync(store: WalletState, wallet: Wallet) {
  //Call mega udpate immediately
  store.setWallet(wallet);
  megaUpdate(store, wallet);

  //Call mega update every x seconds
  setInterval(() => megaUpdate(store, wallet), 5000);
}
function fetchMempool(store: WalletState, wallet: Wallet) {
  const includeAssets = true;
  const params = [{ addresses: wallet.getAddresses() }, includeAssets];
  const promise = wallet.rpc("getaddressmempool", params);
  promise.then(store.setMempool);
}
async function megaUpdate(store: WalletState, wallet: Wallet) {
  //If block count has changed, grab new balance
  fetchMempool(store, wallet);
  const blockCount = await wallet.rpc("getblockcount", []);

  const timeToUpdate = blockCount !== store.getBlockCount();
  if (timeToUpdate === false) {
    return;
  }

  console.log(
    "New block found, time to update",
    blockCount,
    store.getBlockCount()
  );
  store.setBlockCount(blockCount);
  wallet.getAssets().then(store.setAssets);
  wallet.getBalance().then(store.setBalance);
  wallet.getReceiveAddress().then(store.setReceiveAddress);

  wallet.getHistory().then(store.setHistory);
}
