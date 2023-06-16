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
      <hr></hr>
      <nav className="rebel-navigator">
        <ul className="rebel-navigator__list">
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
    "rebel-navigator__list-item" +
    (isCurrent ? " rebel-navigator__list-item--active" : "");
  return (
    <li className={classes}>
      <a
        href="#"
        className="primary"
        onClick={(event) => {
          setRoute(newRoute);
          event.preventDefault();
          return false;
        }}
        style={{ display: "block" }}
      >
        <Icon route={newRoute} />
        {title}
      </a>
    </li>
  );
}
//Icons from https://feathericons.com/
const iconMapper = {
  [Routes.HOME]: <IconHome />,
  [Routes.HISTORY]: <IconHistory />,
  [Routes.RECEIVE]: <IconReceive />,
  [Routes.SEND]: <IconSend />,
  [Routes.SWEEP]: <IconSweep />,
};
function Icon({ route }) {
  return <div> {iconMapper[route]}</div>;
}
const iconSize = 24;
function IconHome() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-home"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

function IconSend() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-send"
    >
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}

function IconReceive() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-download"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );
}

function IconSweep() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-key"
    >
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </svg>
  );
}

function IconHistory() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-clock"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}
