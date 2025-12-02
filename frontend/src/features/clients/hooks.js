import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, deleteClient, fetchClient, fetchClients, updateClient } from "./api.js";

const emptyClient = { name: "", phone: "", email: "", address: "", notes: "" };

export function useClients() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState(emptyClient);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClients();
      setClients(data || []);
    } catch (err) {
      setError(err);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(clients.length / pageSize)), [clients.length]);
  const pageData = useMemo(() => clients.slice((page - 1) * pageSize, page * pageSize), [clients, page]);

  const saveNewClient = async () => {
    if (!newClient.name.trim()) return;
    await createClient(newClient);
    setNewClient(emptyClient);
    await load();
  };

  const inlineUpdate = (id, field, value) => {
    setClients(prev => prev.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const saveInlineClient = async id => {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    await updateClient(id, {
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
      notes: client.notes
    });
    await load();
  };

  const removeClient = async id => {
    await deleteClient(id);
    await load();
  };

  return {
    clients,
    newClient,
    setNewClient,
    loading,
    error,
    page,
    totalPages,
    pageData,
    setPage,
    saveNewClient,
    inlineUpdate,
    saveInlineClient,
    removeClient
  };
}

export function useClientDetails(id) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClient(id);
      setClient(data);
    } catch (err) {
      setError(err);
      setClient(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async () => {
    if (!id) return;
    await deleteClient(id);
  };

  return { client, loading, error, reload: load, deleteClient: remove };
}

export function useClientEdit(id) {
  const [form, setForm] = useState(emptyClient);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClient(id);
      setForm({
        name: data?.name || "",
        phone: data?.phone || "",
        email: data?.email || "",
        address: data?.address || "",
        notes: data?.notes || ""
      });
    } catch (err) {
      setError(err);
      setForm(emptyClient);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

  const submit = async () => {
    if (!id) return false;
    setSaving(true);
    try {
      await updateClient(id, form);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { form, loading, saving, error, updateField, submit };
}
