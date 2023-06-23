import RavencoinWallet, { Wallet } from "@ravenrebels/ravencoin-jswallet";
import React from "react";
import { createRoot } from "react-dom/client";

import { History } from "./History";
import { Assets } from "./Assets";
import { Mempool } from "./Mempool";
import { ReceiveAddress } from "./ReceiveAddress";
import { Balance } from "./Balance";
import { Loader } from "./Loader";
import { Send } from "./Send";
import { Asset } from "./Types";
import { Login } from "./Login";
import { Sweep } from "./Sweep";
import { Navigator } from "./Navigator";
import { Routes } from "./Routes";

let _mnemonic =
  "sight rate burger maid melody slogan attitude gas account sick awful hammer";

type ChainType = "rvn" | "rvn-test";
function App() {
  const [currentRoute, setCurrentRoute] = React.useState(Routes.HOME);
  const [mempool, setMempool] = React.useState<any>([]);
  const [receiveAddress, setReceiveAddress] = React.useState("");
  const [mnemonic, setMnemonic] = React.useState(
    localStorage.getItem("mnemonic")
  );

  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [balance, setBalance] = React.useState(0);
  const [blockCount, setBlockCount] = React.useState(0);
  const [wallet, setWallet] = React.useState<null | Wallet>(null);

  //At startup init wallet
  React.useEffect(() => {
    //Override network to rvn-test if present in query string (search)
    const searchParams = new URLSearchParams(window.location.search);
    let network: ChainType = "rvn";
    if (searchParams.get("network") === "rvn-test") {
      network = "rvn-test";
    }
    if (!mnemonic) {
      return;
    }
    RavencoinWallet.createInstance({
      mnemonic,
      network,
    }).then(setWallet);
  }, [mnemonic]);

  //When wallet changes (like has been created) setup interval for fetching block count
  React.useEffect(() => {
    async function fetchBlockCount() {
      if (!wallet) {
        return;
      }

      const b = await wallet.rpc("getblockcount", []);
      setBlockCount(b);
    }
    fetchBlockCount();
    //Fetch updates every 5 seconds
    setInterval(fetchBlockCount, 5 * 1000);

    //Fetch mempool every 10 seconds
    setInterval(() => {
      wallet?.getMempool().then(setMempool);
    }, 10 * 1000);
  }, [wallet]);

  //Fetch data on each block update
  React.useEffect(() => {
    if (wallet) {
      wallet.getMempool().then(setMempool);
      wallet.getReceiveAddress().then(setReceiveAddress);
      wallet.getAssets().then(setAssets);
      wallet.getBalance().then(setBalance);
    }
  }, [blockCount]);

  if (!mnemonic) {
    return <Login />;
  }
  if (!wallet || blockCount === 0) {
    return <Loader />;
  }

  const signOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("mnemonic");
      window.location.reload();
    }
  };
  return (
    <>
      <Navigator
        currentRoute={currentRoute}
        setRoute={setCurrentRoute}
        wallet={wallet}
      />
      {currentRoute === Routes.HOME && (
        <Balance balance={balance} wallet={wallet} />
      )}
      <Mempool mempool={mempool} />

      {currentRoute === Routes.HOME && (
        <Assets wallet={wallet} assets={assets} />
      )}
      {currentRoute === Routes.RECEIVE && (
        <ReceiveAddress receiveAddress={receiveAddress} />
      )}

      {currentRoute === Routes.SEND && (
        <Send wallet={wallet} balance={balance} assets={assets} />
      )}

      {currentRoute === Routes.SWEEP && <Sweep wallet={wallet} />}

      {currentRoute === Routes.HISTORY && <History wallet={wallet} />}

      <div className="grid">
        <button onClick={signOut}>Sign out</button>
        <button
          className="secondary"
          onClick={(event) => {
            const value = localStorage.getItem("mnemonic");
            if (value) {
              const target = event.target as HTMLButtonElement;
              navigator.clipboard.writeText(value);
              target.disabled = true;
              setInterval(() => (target.disabled = false), 2000);
            }
          }}
        >
          Copy your secret 12 words to memory
        </button>
      </div>
      <p>
        <a href="https://github.com/ravenrebels/ravencoin-webwallet">
          Open source on GitHub
        </a>
        <br />
        Icons from{" "}
        <a href="https://feathericons.com/">https://feathericons.com/</a>
      </p>
    </>
  );
}

//Add app to the DOM
const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<App />);
