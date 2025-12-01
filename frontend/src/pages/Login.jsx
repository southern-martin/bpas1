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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        padding: 20
      }}
    >
      <div
        style={{
          background: "white",
          padding: "28px 24px",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          display: "grid",
          gap: 18
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>BPAS Login</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
            Sign in as Owner or Staff to continue.
          </p>
        </div>

        {/* Owner */}
        <div style={{ display: "grid", gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 16, color: "#111827" }}>Owner Login</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button style={primaryBtn} onClick={handleOwnerLogin}>
            Login as Owner
          </button>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

        {/* Staff */}
        <div style={{ display: "grid", gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 16, color: "#111827" }}>Staff Login</h2>
          <input
            placeholder="Staff ID"
            value={staffId}
            onChange={e => setStaffId(e.target.value)}
            style={inputStyle}
          />
          <button style={secondaryBtn} onClick={handleStaffLogin}>
            Login as Staff
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14
};

const primaryBtn = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "white",
  fontSize: 14,
  cursor: "pointer"
};

const secondaryBtn = {
  ...primaryBtn,
  background: "#f3f4f6",
  color: "#111827",
  border: "1px solid #d1d5db"
};
