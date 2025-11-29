import { verifyToken } from "../utils/token.js";

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  const data = verifyToken(token);
  if (!data) return res.status(401).json({ error: "Not authenticated" });
  req.user = data;
  next();
}

export function requireOwner(req, res, next) {
  if (!req.user || req.user.role !== "Owner") {
    return res.status(403).json({ error: "Owner only" });
  }
  next();
}

export function requireStaff(req, res, next) {
  if (!req.user || req.user.role !== "Staff") {
    return res.status(403).json({ error: "Staff only" });
  }
  next();
}
