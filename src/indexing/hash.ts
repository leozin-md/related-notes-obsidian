import CryptoJS from "crypto-js";

export function sha256(text: string): string {
  return CryptoJS.SHA256(text).toString();
}
