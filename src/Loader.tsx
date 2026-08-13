import React from "react";
import { NetworkStatus } from "./NetworkStatus";

export function Loader({ error }: { error?: string }) {
  return (
    <main className="container">
      <article style={{ textAlign: "center", padding: "3rem" }}>
        <h3 className="rebel-headline" style={{ marginBottom: "2rem" }}>Rebel wallet</h3>
        {error ? (
          <div style={{ color: "var(--pico-del-color)", marginTop: "1rem" }}>
            <h4>Connection Error</h4>
            <p>{error}</p>
            <p style={{ color: "var(--pico-color)", fontSize: "0.9rem", marginTop: "1rem", marginBottom: "2rem" }}>
              The node for the current network seems to be down or unreachable. 
              Please check your internet connection, try again later, or select an alternative network below.
            </p>
            <div style={{ color: "var(--pico-color)" }}>
              <NetworkStatus />
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            <span aria-busy="true" style={{ display: "inline-block", transform: "scale(1.5)" }}></span>
            <p style={{ marginTop: "1.5rem", color: "var(--pico-muted-color)" }}>Loading wallet...</p>
          </div>
        )}
      </article>
    </main>
  );
}
