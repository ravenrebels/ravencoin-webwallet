import React from "react";
import RavencoinWallet from "@ravenrebels/ravencoin-jswallet";

type ChainType = "rvn" | "rvn-test" | "evr";

interface NetworkInfo {
  id: ChainType;
  name: string;
}

const NETWORKS: NetworkInfo[] = [
  { id: "rvn", name: "Ravencoin" },
  { id: "evr", name: "Evrmore" },
  { id: "rvn-test", name: "Ravencoin Testnet" },
];

export function NetworkStatus() {
  const [statuses, setStatuses] = React.useState<
    Record<ChainType, "checking" | "online" | "offline">
  >({
    rvn: "checking",
    evr: "checking",
    "rvn-test": "checking",
  });

  React.useEffect(() => {
    let isMounted = true;

    async function checkNetwork(network: ChainType) {
      try {
        const wallet = await RavencoinWallet.createInstance({
          mnemonic:
            "sight rate burger maid melody slogan attitude gas account sick awful hammer",
          network,
          minAmountOfAddresses: 1,
        });
        const blockCount = await wallet.rpc("getblockcount", []);
        if (isMounted) {
          setStatuses((prev) => ({
            ...prev,
            [network]: blockCount > 0 ? "online" : "offline",
          }));
        }
      } catch (e) {
        if (isMounted) {
          setStatuses((prev) => ({ ...prev, [network]: "offline" }));
        }
      }
    }

    NETWORKS.forEach((net) => {
      checkNetwork(net.id);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      style={{
        marginTop: "2rem",
        textAlign: "left",
        display: "inline-block",
        minWidth: "300px",
      }}
    >
      <h5 style={{ marginBottom: "1rem", textAlign: "center" }}>
        Network Status
      </h5>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {NETWORKS.map((net) => {
          const status = statuses[net.id];
          return (
            <li
              key={net.id}
              style={{
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "2rem",
              }}
            >
              <span>{net.name}</span>
              <span>
                {status === "checking" && (
                  <span
                    aria-busy="true"
                    style={{ color: "var(--pico-muted-color)" }}
                  >
                    Checking...
                  </span>
                )}
                {status === "offline" && (
                  <span style={{ color: "var(--pico-del-color)" }}>Offline</span>
                )}
                {status === "online" && (
                  <a
                    href={`?network=${net.id}`}
                    role="button"
                    className="outline"
                    style={{
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.8rem",
                      lineHeight: "1",
                    }}
                  >
                    Connect
                  </a>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
