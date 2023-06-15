import React from "react";
import { Routes } from "./Routes";
import { LightModeToggle } from "./LightModeToggle";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
export function Navigator({
  wallet,
  currentRoute,
  setRoute,
}: {
  currentRoute: Routes;
  wallet: Wallet;
  setRoute: any;
}) {
  const mappy = {
    rvn: "Ravencoin mainnet",
    "rvn-test": "Ravencoin testnet",
  };
  const networkDisplayName = mappy[wallet.network];

  return (
    <article>
      <LightModeToggle />
      <a
        href="#"
        className="primary"
        onClick={(event) => {
          setRoute(Routes.HOME);
          event.preventDefault();
          return false;
        }}
      >
        <h1 className="rebel-headline">Rebel wallet</h1>
      </a>
      <small>{networkDisplayName}</small>

      <nav className="rebel-navigator">
        <ul>
          <Link
            currentRoute={currentRoute}
            setRoute={setRoute}
            newRoute={Routes.HOME}
            title="Home"
          />
          <Link
            currentRoute={currentRoute}
            setRoute={setRoute}
            newRoute={Routes.SEND}
            title="Send"
          />
          <Link
            currentRoute={currentRoute}
            setRoute={setRoute}
            newRoute={Routes.RECEIVE}
            title="Receive"
          />
          <Link
            currentRoute={currentRoute}
            setRoute={setRoute}
            newRoute={Routes.SWEEP}
            title="Sweep"
          />

          <Link
            currentRoute={currentRoute}
            setRoute={setRoute}
            newRoute={Routes.HISTORY}
            title="History"
          />
        </ul>
      </nav>
    </article>
  );
}

interface ILinkProps {
  currentRoute: Routes;
  newRoute: Routes;
  setRoute: any;
  title: string;
}
function Link({ currentRoute, newRoute, setRoute, title }: ILinkProps) {
  const isCurrent = currentRoute === newRoute;
  const classes =
    "rebel-navigator-list__item" +
    (isCurrent ? " rebel-navigator-list__item--active" : "");
  return (
    <li className={classes}>
      <a
        href="#"
        className="secondary"
        onClick={(event) => {
          setRoute(newRoute);
          event.preventDefault();
          return false;
        }}
        style={{ display: "block" }}
      >
        {title}
      </a>
    </li>
  );
}
