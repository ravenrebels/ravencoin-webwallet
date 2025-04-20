import React from "react";
const imageUrl = new URL("../ravencoin-rvn-logo.png", import.meta.url);

export function Loader() {
  return (
    <main className="container">
      <article id="loading">
        <h3 className="rebel-headline">Rebel wallet</h3>
        <img src={imageUrl.href}></img>
      </article>
    </main>
  );
}
