import { api } from "../../api/client.js";

export function loginOwner({ email, password }) {
  return api.post("/auth/login", { email, password });
}

export function loginStaff({ staff_id }) {
  return api.post("/auth/login", { staff_id });
}
