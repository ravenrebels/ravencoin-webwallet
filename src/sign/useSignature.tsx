import React from "react";
import * as RavencoinMessage from "@ravenrebels/ravencoin-message";
import { IAddressObject } from "./IAddressObject";

export function useSignature(addressObject: IAddressObject | null, text: string) {
  const [signature, setSignature] = React.useState("");

  React.useEffect(() => {
    if (addressObject) {
      const privateKey = Buffer.from(addressObject.privateKey, "hex");
      if (!privateKey || !text) {
        setSignature("");
      } else {
        const s = RavencoinMessage.sign(text, privateKey);
        setSignature(s);
      }
    }
  }, [addressObject, text]);

  if (!addressObject) {
    return "";
  }
  return signature;
}
