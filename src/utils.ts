const CryptoJS = require("crypto-js");

const S = "U2FsdGVkX1/UYDOP/PD64YU3tbCAeJBR";

export function getMnemonic(): string {
  const raw = localStorage.getItem("mnemonic");
  if (!raw) {
    return "";
  }

  const isEncrypted = raw?.indexOf(" ") === -1;
  //Handle existing plain text mnemonics, by re-saving as encrypted
  if (isEncrypted === false) {
    setMnemonic(raw);
    return raw;
  }

  const decryptedBytes = CryptoJS.AES.decrypt(raw, S);
  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8); 
  return decryptedText;
}

export function setMnemonic(_value: string) {
  const value = _value.trim();

  if (!value) {
    localStorage.setItem("mnemonic", "");
    return;
  }
  const isEncrypted = value.indexOf(" ") === -1;

  //Not encryptred
  if (isEncrypted === true) {
    localStorage.setItem("mnemonic", value);
  } else if (isEncrypted === false) {
    // Encrypting the text

    const cipherText = CryptoJS.AES.encrypt(value, S);

    localStorage.setItem("mnemonic", cipherText);
  }
}
