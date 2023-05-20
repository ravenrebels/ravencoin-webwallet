const RavencoinWallet = require("@ravenrebels/ravencoin-jswallet");

async function main() {
  const wallet = await RavencoinWallet.createInstance({
    mnemonic: "12 secret words",
    network: "rvn",
  });
  const result = await wallet.send({
    toAddress: "RSgXwzw8ssHbp39ocozoDqBRRSoKTizD2g",
    assetName: "BITCOIN_3.0",
    amount: 1,
  });
  console.log(result.transactionId);
}
main();
