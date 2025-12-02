import { useLogin, LoginForm } from "../features/auth/index.js";
import { useToast } from "../components/ToastProvider.jsx";

export default function Login() {
  const toast = useToast();
  const {
    state: { ownerEmail, ownerPassword, staffId, error },
    actions: { setOwnerEmail, setOwnerPassword, setStaffId, handleOwnerLogin, handleStaffLogin }
  } = useLogin(toast);

  return (
    <LoginForm
      ownerEmail={ownerEmail}
      ownerPassword={ownerPassword}
      staffId={staffId}
      error={error}
      onOwnerEmail={setOwnerEmail}
      onOwnerPassword={setOwnerPassword}
      onStaffId={setStaffId}
      onOwnerLogin={handleOwnerLogin}
      onStaffLogin={handleStaffLogin}
    />
  );
}
