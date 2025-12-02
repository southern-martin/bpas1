import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ClientEditForm, useClientEdit } from "../features/clients/index.js";

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, loading, saving, error, updateField, submit } = useClientEdit(id);

  if (localStorage.getItem("role") !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Failed to load client.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Edit Client</h1>
      <ClientEditForm
        form={form}
        saving={saving}
        onChange={updateField}
        onSubmit={async e => {
          e.preventDefault();
          const ok = await submit();
          if (ok) navigate(`/office/client/${id}`);
          else alert("Failed to update client");
        }}
        onCancel={() => navigate(`/office/client/${id}`)}
      />
    </div>
  );
}
