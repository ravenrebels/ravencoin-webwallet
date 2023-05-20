import React from "react";

export function Balance({ balance }: { balance: number }) {
  return (
    <article> 
      <h1 className="headline">Ravencoin wallet</h1>
      <h5>Balance</h5>
      <p>{balance.toLocaleString()} RVN</p>
    </article>
  );
}
