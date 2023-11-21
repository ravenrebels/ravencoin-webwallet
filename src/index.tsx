import RavencoinWallet, { Wallet } from "@ravenrebels/ravencoin-jswallet";
console.log("RavencoinWallet", !!RavencoinWallet);
import React from "react";
import { getMnemonic } from "./utils";
import { createRoot } from "react-dom/client";

import { History } from "./history/History";
import { Assets } from "./Assets";
import { Mempool } from "./Mempool";
import { ReceiveAddress } from "./ReceiveAddress";
import { Balance } from "./Balance";
import { Loader } from "./Loader";
import { Send } from "./Send";
import { Login } from "./Login";
import { Sweep } from "./Sweep";
import { Navigator } from "./Navigator";
import { Routes } from "./Routes";
import { Footer } from "./Footer";
import { Sign } from "./sign/Sign";
import { useMempool } from "./hooks/useMempool";
import { useBlockCount } from "./hooks/useBlockCount";
import { useBalance } from "./hooks/useBalance";
import { useAssets } from "./hooks/useAssets";
import { useReceiveAddress } from "./hooks/useReceiveAddress";

let _mnemonic =
  "sight rate burger maid melody slogan attitude gas account sick awful hammer";

type ChainType = "rvn" | "rvn-test" | "evr";

const initMnemonic = getMnemonic();
function App() {
  const [currentRoute, setCurrentRoute] = React.useState(Routes.HOME);

  const [mnemonic] = React.useState(initMnemonic);

  const [wallet, setWallet] = React.useState<null | Wallet>(null);

  const blockCount = useBlockCount(wallet);
  const receiveAddress = useReceiveAddress(wallet, blockCount);
  const balance = useBalance(wallet, blockCount);

  const mempool = useMempool(wallet, blockCount);
  const assets = useAssets(wallet, blockCount);

  //At startup init wallet
  React.useEffect(() => {
    if (!mnemonic) {
      return;
    }
    let minAmountOfAddresses = 50;
    //Override network to rvn-test if present in query string (search)
    const searchParams = new URLSearchParams(window.location.search);
    let network: ChainType = "rvn";
    if (searchParams.get("network") === "rvn-test") {
      network = "rvn-test";
    }

    if (searchParams.get("network") === "evr") {
      network = "evr";
    }

    if (searchParams.get("min")) {
      const v = searchParams.get("min");
      if (v && isFinite(parseInt(v)) === true) {
        minAmountOfAddresses = parseInt(v);
      }
    }

    RavencoinWallet.createInstance({
      minAmountOfAddresses,
      mnemonic,
      network,
    }).then(setWallet);
  }, [mnemonic]);

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

  const hasMempool = mempool.length > 0;
  return (
    <>
      <Navigator
        balance={
          <Balance balance={balance} mempool={mempool} wallet={wallet} />
        }
        currentRoute={currentRoute}
        setRoute={setCurrentRoute}
        wallet={wallet}
      />

      <div className="rebel-content-container">
        {hasMempool && (
          <div className="rebel-content-container__mempool">
            <Mempool mempool={mempool} wallet={wallet} />
          </div>
        )}

        <div className="rebel-content-container__content">
          {currentRoute === Routes.HOME && (
            <Assets wallet={wallet} assets={assets} mempool={mempool} />
          )}
          {currentRoute === Routes.RECEIVE && (
            <ReceiveAddress receiveAddress={receiveAddress} />
          )}

          {currentRoute === Routes.SEND && (
            <Send
              assets={assets}
              balance={balance}
              mempool={mempool}
              wallet={wallet}
            />
          )}

          {currentRoute === Routes.SWEEP && <Sweep wallet={wallet} />}

          {currentRoute === Routes.HISTORY && (
            <History wallet={wallet} blockCount={blockCount} />
          )}

          {currentRoute === Routes.SIGN && (
            <Sign assets={assets} wallet={wallet} />
          )}
        </div>
      </div>

      <Footer signOut={signOut} mnemonic={mnemonic} />
    </>
  );
}

//Add app to the DOM
const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<App />);
