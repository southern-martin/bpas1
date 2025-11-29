import CryptoJS from "crypto-js";

const SECRET = process.env.AUTH_SECRET || "bpas-secret";

export function generateToken(payload) {
  const EXPIRATION_MINUTES = 720; // 12 hours
  const data = {
    ...payload,
    exp: Date.now() + EXPIRATION_MINUTES * 60 * 1000
  };
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString();
}

export function verifyToken(token) {
  try {
    const bytes = CryptoJS.AES.decrypt(token, SECRET);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    if (Date.now() > data.exp) return null;
    return data;
  } catch (err) {
    return null;
  }
}
