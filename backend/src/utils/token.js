import CryptoJS from "crypto-js";

const SECRET = process.env.AUTH_SECRET || "bpas-secret";

export function generateToken(payload) {
  const data = JSON.stringify(payload);
  return CryptoJS.AES.encrypt(data, SECRET).toString();
}

export function verifyToken(token) {
  try {
    const bytes = CryptoJS.AES.decrypt(token, SECRET);
    const data = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}
