import React from "react";
import { QrReader } from "react-qr-reader";
export function useQRReader(
    showQRCode: boolean,
    onResult: (value: string | null) => void
  ) {
    const [qr, setQR] = React.useState(<></>);
    const [mode, setMode] = React.useState("environment");
    React.useEffect(() => {
      if (showQRCode === false) {
        setQR(<></>);
      } else {
        const q = (
          <div>
            <QrReader
              key={"qr" + new Date().toISOString()}
              constraints={{
                facingMode: mode,
              }}
              scanDelay={100}
              onResult={(result, error) => {
                if (!!result) {
                    //@ts-ignore
                  onResult(result?.text);
                }
  
                if (!!error) {
                }
              }}
            />
            <div className="grid">
              <button
                className="secondary"
                onClick={() => {
                  const newMode = mode === "environment" ? "user" : "environment";
  
                  setMode(newMode);
                }}
              >
                Toggle mode
              </button>
              <button onClick={() => onResult("")} className="secondary">
                Close camera
              </button>
            </div>
          </div>
        );
        setQR(q);
      }
    }, [showQRCode, mode]);
  
    return qr;
  }
  