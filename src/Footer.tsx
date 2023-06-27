import React from "react";

export function Footer({signOut}) {
  return (
    <div> 
      <div className="grid">
        <button onClick={signOut}>Sign out</button>
        <button
          className="secondary"
          onClick={(event) => {
            const value = localStorage.getItem("mnemonic");
            if (value) {
              const target = event.target as HTMLButtonElement;
              navigator.clipboard.writeText(value);
              target.disabled = true;
              setInterval(() => (target.disabled = false), 2000);
            }
          }}
        >
          Copy your secret 12 words to memory
        </button>
      </div>
      <p>
        <a href="https://github.com/ravenrebels/ravencoin-webwallet">
          Open source on GitHub
        </a>
        <br />
        Icons from{" "}
        <a href="https://feathericons.com/">https://feathericons.com/</a>
      </p>
    </div>
  );
}
