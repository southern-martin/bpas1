export class AuthController {
  constructor({ loginUser, getCurrentUser }) {
    this.loginUserUseCase = loginUser;
    this.getCurrentUserUseCase = getCurrentUser;
  }

  login = async (req, res) => {
    try {
      const result = await this.loginUserUseCase.execute(req.body);
      res.json(result);
    } catch (err) {
      const status = err.status || 500;
      const message = err.status ? err.message : "Failed to login";
      if (!err.status) console.error("Login Error:", err);
      res.status(status).json({ error: message });
    }
  };

  me = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const data = await this.getCurrentUserUseCase.execute(token);
      if (!data) return res.status(401).json({ error: "Invalid token" });
      res.json({ user: data });
    } catch (err) {
      console.error("Me Error:", err);
      res.status(500).json({ error: "Failed to load user" });
    }
  };
}
