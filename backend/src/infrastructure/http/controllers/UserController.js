export class UserController {
  constructor({ getUsers, createUser }) {
    this.getUsersUseCase = getUsers;
    this.createUserUseCase = createUser;
  }

  getUsers = async (_req, res) => {
    try {
      const users = await this.getUsersUseCase.execute();
      res.json(users);
    } catch (err) {
      console.error("Get Users Error:", err);
      res.status(500).json({ error: "Failed to load users" });
    }
  };

  createUser = async (req, res) => {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error("Create User Error:", err);
      res.status(500).json({ error: "Failed to create user" });
    }
  };
}
