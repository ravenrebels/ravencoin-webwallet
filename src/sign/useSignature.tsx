import React from "react";
import * as RavencoinMessage from "@ravenrebels/ravencoin-message";
import { IAddressObject } from "./IAddressObject";

function toMessageNetwork(network: string): "rvn" | "evr" {
  return network === "evr" ? "evr" : "rvn";
}

export function useSignature(
  addressObject: IAddressObject | null,
  text: string,
  network: string
) {
  const [signature, setSignature] = React.useState("");

  React.useEffect(() => {
    if (addressObject) {
      if (!addressObject.privateKey || !text) {
        setSignature("");
      } else {
        const s = RavencoinMessage.sign({
          message: text,
          privateKey: addressObject.privateKey,
          network: toMessageNetwork(network),
        });
        setSignature(s);
      }
    }
  }, [addressObject, text, network]);

  if (!addressObject) {
    return "";
  }
  return signature;
}
