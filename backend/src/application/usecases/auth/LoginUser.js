import bcrypt from "bcryptjs";
import { generateToken } from "../../../utils/token.js";

export class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password, staff_id }) {
    // Staff login by id
    if (staff_id) {
      const user = await this.userRepository.findById(staff_id);
      if (!user || user.role !== "Staff") {
        const err = new Error("Invalid staff ID");
        err.status = 401;
        throw err;
      }
      const token = generateToken({ id: user.id, role: user.role, name: user.name });
      return { token, user };
    }

    // Owner login by email/password
    if (email && password) {
      const user = await this.userRepository.findByEmail(email);
      if (!user || user.role !== "Owner") {
        const err = new Error("Owner not found");
        err.status = 401;
        throw err;
      }
      if (!user.password) {
        const err = new Error("Owner password not set");
        err.status = 401;
        throw err;
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        const err = new Error("Wrong password");
        err.status = 401;
        throw err;
      }
      const token = generateToken({ id: user.id, role: user.role, name: user.name });
      return { token, user };
    }

    const err = new Error("Invalid login data");
    err.status = 400;
    throw err;
  }
}
