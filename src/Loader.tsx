import React from "react";
import { walletBrand } from "./brandConfig";
const imageUrl = new URL("../ravencoin-rvn-logo.png", import.meta.url);

export function Loader() {
  return (
    <main className="container">
      <article id="loading">
        <h3 className="rebel-headline">{walletBrand.name}</h3>
        <img src={imageUrl.href}></img>
      </article>
    </main>
  );
}
