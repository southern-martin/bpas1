import { verifyToken } from "../../../utils/token.js";

export class GetCurrentUser {
  async execute(token) {
    if (!token) return null;
    const data = verifyToken(token);
    return data || null;
  }
}
