import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma.js";
import { generateToken, verifyToken } from "../utils/token.js";

export async function login(req, res) {
  const { email, password, staff_id } = req.body;
  let user;

  if (staff_id) {
    user = await prisma.user.findUnique({ where: { id: staff_id } });
    if (!user || user.role !== "Staff") {
      return res.status(401).json({ error: "Invalid staff ID" });
    }
    const token = generateToken({
      id: user.id,
      role: user.role,
      name: user.name
    });
    return res.json({ token, user });
  }

  if (email && password) {
    user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== "Owner") {
      return res.status(401).json({ error: "Owner not found" });
    }
    if (!user.password) {
      return res.status(401).json({ error: "Owner password not set" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Wrong password" });
    }
    const token = generateToken({
      id: user.id,
      role: user.role,
      name: user.name
    });
    return res.json({ token, user });
  }

  res.status(400).json({ error: "Invalid login data" });
}

export async function me(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  const data = verifyToken(token);
  if (!data) return res.status(401).json({ error: "Invalid token" });
  res.json({ user: data });
}
