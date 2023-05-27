import React from "react";

export function Balance({ balance }: { balance: number }) {
  return (
    <article> 
      <h1 className="headline">Rebel wallet</h1>
      <h5>Ravencoin balance</h5>
      <p>{balance.toLocaleString()} RVN</p>
    </article>
  );
}
