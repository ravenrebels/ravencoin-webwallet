import React from "react";

import RavencoinKey from "@ravenrebels/ravencoin-key";
console.log("RavencoinKey", RavencoinKey);
import { LightModeToggle } from "./LightModeToggle";
import { getMnemonic, setMnemonic } from "./utils";
export function Login() {
  const [showWords, setShowWords] = React.useState(false);
  const [dialog, setDialog] = React.useState(<></>);

  function showDialog(title: string, text: string) {
    const onClose = () => setDialog(<></>);
    const d = <Dialog title={title} text={text} onClose={onClose}></Dialog>;
    setDialog(d);
  }
  function newWallet(event) {
    event.preventDefault();
    const element = document.getElementById("mnemonic") as HTMLInputElement;
    if (element?.value) {
      alert("Please clear the input field before creating a new wallet");
      return false;
    }
    if (element) {
      element.value = RavencoinKey.generateMnemonic();
    }
    showDialog(
      "WARNING",
      "Make sure you save these 12 words somewhere safe. Next, click Sign in"
    );

    return false;
  }
  function onSubmit(event) {
    event.preventDefault();

    const field = document.getElementById("mnemonic") as HTMLFormElement;
    if (!field) {
      return null;
    }
    const value = field.value;

    const isValid = RavencoinKey.isMnemonicValid(value);

    if (isValid === false) {
      alert("The does not seem to be 12 valid words for a Ravencoin wallet");
      setMnemonic(value);
      window.location.reload();
    } else {
      setMnemonic(value);
      window.location.reload();
    }

    return false;
  }

  return (
    <article>
      <LightModeToggle />
      {dialog}
      <h1 className="rebel-headline">Sign in</h1>
      <p>
        This web app only stores your 12 words temporarily in memory, and the
        information is lost when you sign out or clear the web browser's cache.
        Truly, ensure that you save or back up your 12 words in a secure
        location..
      </p>
      <h5>Enter your 12 words</h5>
      <form onSubmit={onSubmit}>
        <label htmlFor="switch">
          <input
            type="checkbox"
            id="switch"
            name="switch"
            role="switch"
            checked={showWords}
            onChange={(event) => setShowWords(!showWords)}
          />
          Show words in plain text
        </label>
        <input
          type={showWords === true ? "text" : "password"}
          id="mnemonic"
          autoComplete="off"
        />

        <div className="grid" style={{ marginTop: 40 }}>
          <input type="submit" value="Sign in" />{" "}
          <button
            id="newWalletButton"
            onClick={newWallet}
            className="secondary"
          >
            Create a new wallet
          </button>
        </div>
      </form>
    </article>
  );
}

function Dialog({
  onClose,
  text,
  title,
}: {
  onClose: () => void;

  text: string;
  title: string;
}) {
  return (
    <dialog open>
      <article>
        <header>
          <a aria-label="Close" className="close" onClick={onClose}></a>
          {title}
        </header>
        <p>{text}</p>
        <footer>
          <button onClick={onClose}>Close</button>
        </footer>
      </article>
    </dialog>
  );
}
