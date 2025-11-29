import { useState } from "react";
import { api } from "../api/client.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffId, setStaffId] = useState("");

  async function handleOwnerLogin() {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    localStorage.setItem("userId", res.data.user.id);
    window.location.href = "/office/dashboard";
  }

  async function handleStaffLogin() {
    const res = await api.post("/auth/login", { staff_id: staffId });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    localStorage.setItem("userId", res.data.user.id);
    window.location.href = "/field/today";
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>BPAS Login</h1>

      <h2>Owner Login</h2>
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleOwnerLogin}>Login as Owner</button>

      <h2 style={{ marginTop: 20 }}>Staff Login</h2>
      <input placeholder="Staff ID" value={staffId} onChange={e => setStaffId(e.target.value)} />
      <button onClick={handleStaffLogin}>Login as Staff</button>
    </div>
  );
}
