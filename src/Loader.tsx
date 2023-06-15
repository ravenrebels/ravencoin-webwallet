import React from "react";
//@ts-ignore
import logo from "../ravencoin-rvn-logo.png";
export function Loader() {
  return (
    <main className="container">
      <article id="loading">
        <h1 className="rebel-headline">Ravencoin wallet</h1>
        <img src={logo}></img>
      </article>
    </main>
  );
}
