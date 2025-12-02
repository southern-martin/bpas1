import { useState, useCallback } from "react";
import { loginOwner, loginStaff } from "./api.js";

export function useLogin(toast) {
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [staffId, setStaffId] = useState("");
  const [error, setError] = useState("");

  const persistSession = useCallback((res, redirect) => {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    localStorage.setItem("userId", res.data.user.id);
    redirect();
  }, []);

  const handleOwnerLogin = useCallback(async () => {
    try {
      const res = await loginOwner({ email: ownerEmail, password: ownerPassword });
      persistSession(res, () => (window.location.href = "/office/dashboard"));
      toast?.success?.("Logged in as Owner");
    } catch (err) {
      setError("Owner login failed");
      toast?.error?.("Owner login failed");
    }
  }, [ownerEmail, ownerPassword, persistSession, toast]);

  const handleStaffLogin = useCallback(async () => {
    try {
      const res = await loginStaff({ staff_id: staffId });
      persistSession(res, () => (window.location.href = "/field/today"));
      toast?.success?.("Logged in as Staff");
    } catch (err) {
      setError("Staff login failed");
      toast?.error?.("Staff login failed");
    }
  }, [staffId, persistSession, toast]);

  return {
    state: { ownerEmail, ownerPassword, staffId, error },
    actions: { setOwnerEmail, setOwnerPassword, setStaffId, handleOwnerLogin, handleStaffLogin }
  };
}
