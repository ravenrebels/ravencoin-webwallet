import React from "react";

export function Loader({ error }: { error?: string }) {
  return (
    <main className="container">
      <article style={{ textAlign: "center", padding: "3rem" }}>
        <h3 className="rebel-headline" style={{ marginBottom: "2rem" }}>Rebel wallet</h3>
        {error ? (
          <div style={{ color: "var(--pico-del-color)", marginTop: "1rem" }}>
            <h4>Could not load the page</h4>
            <p>{error}</p>
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
