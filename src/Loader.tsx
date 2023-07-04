import React from "react";
//@ts-ignore
import logo from "../ravencoin-rvn-logo.png";
export function Loader() {
  return (
    <main className="container">
      <article id="loading">
        <h3 className="rebel-headline">Rebel wallet</h3>
        <img src={logo}></img>
      </article>
    </main>
  );
}
