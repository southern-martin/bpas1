import * as usersService from "../services/users.service.js";

export async function getUsers(req, res) {
  try {
    const users = await usersService.getUsers();
    res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
}

export async function createUser(req, res) {
  try {
    const user = await usersService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
}
