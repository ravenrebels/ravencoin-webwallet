import React from "react";
import { useQRReader } from "./QRCamera";

interface IQRCameraCointainerProps {
  onChange: (value: string) => void;
}
export function QRCameraContainer({ onChange }: IQRCameraCointainerProps) {
  const [showQRCode, setShowQRCode] = React.useState(false);
  function onResult(value: string | null) {
    onChange(value ? value : "");
    setShowQRCode(false);
  }
  const qr = useQRReader(showQRCode, onResult);

  return (
    <div>
      {qr}
      {showQRCode === false && (
        <button style={{ maxWidth: 200 }} onClick={() => setShowQRCode(true)}>
          Scan QR code
        </button>
      )}
    </div>
  );
}
