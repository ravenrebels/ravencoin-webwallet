import React from "react";

export function ReceiveAddress({ receiveAddress }: { receiveAddress: string }) {
  const [confirm, setConfirm] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(receiveAddress);
    setConfirm(true);
    setTimeout(() => setConfirm(false), 1500); //Reset confirm status after 2 seconds
  };
  return (
    <article>
      <h5>Receive address</h5>
      <label>
        <img
          style={{
            marginBottom: 20,
            padding: "10px",
            background: "white",
            borderRadius: "10px",
          }}
          src={
            receiveAddress
              ? "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=" +
                receiveAddress
              : ""
          }
        />
        <small> {receiveAddress}</small>

      </label>
      {confirm === true && (
          <button onClick={copy}>😀</button>
        )}
      {confirm === false && <button onClick={copy}>Copy</button>}
    </article>
  );
}
