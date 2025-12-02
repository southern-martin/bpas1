import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../api/client.js";
import {
  enqueue,
  getCardFromCache,
  getCardsFromCache,
  getClientsFromCache,
  getProjectsFromCache,
  getQueueCount,
  upsertCards,
  upsertClients,
  upsertProjects
} from "../../offline/db.js";
import { initSyncLoop, runSync } from "../../offline/sync.js";
import { useSyncStatus } from "../../offline/syncStatus.js";

export function useFieldCard(cardId, toast, navigate) {
  const [card, setCard] = useState(null);
  const [status, setStatus] = useState("To Do");
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [rawNotes, setRawNotes] = useState("");
  const [clarifiedNotes, setClarifiedNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  const loadCard = useCallback(async () => {
    try {
      const [clientsRes, projectsRes] = await Promise.all([api.get("/clients"), api.get("/projects")]);
      await upsertClients(clientsRes.data);
      await upsertProjects(projectsRes.data);
      setClients(clientsRes.data);
      setProjects(projectsRes.data);

      const res = await api.get(`/cards/${cardId}`);
      const c = res.data;
      setCard(c);
      setStatus(c.status);
      setClarifiedNotes(c.notes_clarified || "");
      await upsertCards([c]);
    } catch (err) {
      const cachedClients = await getClientsFromCache();
      const cachedProjects = await getProjectsFromCache();
      if (cachedClients.length) setClients(cachedClients);
      if (cachedProjects.length) setProjects(cachedProjects);

      const cached = await getCardFromCache(cardId);
      if (cached) {
        setCard(cached);
        setStatus(cached.status);
        setClarifiedNotes(cached.notes_clarified || "");
      }
    }
  }, [cardId]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  useEffect(() => {
    const handler = () => setOffline(!navigator.onLine);
    window.addEventListener("online", handler);
    window.addEventListener("offline", handler);
    initSyncLoop();
    const queueInterval = setInterval(updateQueueCount, 4000);
    updateQueueCount();
    return () => {
      window.removeEventListener("online", handler);
      window.removeEventListener("offline", handler);
      clearInterval(queueInterval);
    };
  }, []);

  const updateQueueCount = useCallback(async () => {
    const count = await getQueueCount();
    setPendingCount(count);
  }, []);

  const handleClarify = useCallback(async () => {
    const res = await api.post("/clarify", { raw_text: rawNotes });
    setClarifiedNotes(res.data.clarified_text);
  }, [rawNotes]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const payload = {
      status,
      notes_clarified: clarifiedNotes,
      user_id: localStorage.getItem("userId") || "staff-1"
    };
    try {
      if (navigator.onLine) {
        await api.post(`/cards/${cardId}/updates`, payload);
        toast?.success?.("Saved");
      } else {
        await enqueue({
          id: crypto.randomUUID(),
          type: "activity",
          payload: { cardId, body: payload }
        });
        toast?.info?.("Saved offline; will sync");
      }
      navigate("/field/today");
    } finally {
      setSaving(false);
    }
  }, [cardId, clarifiedNotes, navigate, status, toast]);

  const sendAudioToBackend = useCallback(
    async blob => {
      try {
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        if (navigator.onLine) {
          const res = await api.post("/audio/transcribe", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          const newText = res.data.raw_text || "";
          setRawNotes(prev => (prev ? `${prev}\n${newText}` : newText));
        } else {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = reader.result;
            await enqueue({
              id: crypto.randomUUID(),
              type: "audio-upload",
              payload: { cardId, dataUrl: base64 }
            });
          };
          reader.readAsDataURL(blob);
        }
      } catch (err) {
        console.error("Transcription upload error:", err);
        toast?.error?.("Failed to transcribe audio.");
      }
    },
    [cardId, toast]
  );

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendAudioToBackend(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);

      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
          setRecording(false);
        }
      }, 5000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  }, [sendAudioToBackend]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }, [recording]);

  return {
    state: {
      card,
      status,
      clients,
      projects,
      rawNotes,
      clarifiedNotes,
      saving,
      recording,
      offline,
      pendingCount
    },
    actions: {
      setStatus,
      setRawNotes,
      setClarifiedNotes,
      handleClarify,
      handleSave,
      handleStartRecording,
      handleStopRecording
    }
  };
}

export function useFieldToday() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const { status, lastSync } = useSyncStatus();
  const staffId = useMemo(() => localStorage.getItem("userId") || "staff-1", []);

  const load = useCallback(async () => {
    try {
      const [cardsRes, clientsRes, projectsRes] = await Promise.all([
        api.get("/cards", { params: { assigned_to: staffId } }),
        api.get("/clients"),
        api.get("/projects")
      ]);
      const list = cardsRes.data || [];
      await upsertClients(clientsRes.data || []);
      await upsertProjects(projectsRes.data || []);
      await upsertCards(list);
      updateLists(list);
    } catch (err) {
      const cached = await getCardsFromCache();
      updateLists(cached.filter(c => c.assigned_to_user_id === staffId));
    }
  }, [staffId]);

  const updateLists = useCallback(list => {
    setEvents(list.filter(c => c.type === "Event"));
    setTasks(list.filter(c => c.type === "Task" && c.status !== "Done"));
  }, []);

  useEffect(() => {
    load();

    const handler = e => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const onlineHandler = () => setOffline(!navigator.onLine);
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", onlineHandler);
    initSyncLoop();
    const queueInterval = setInterval(updateQueueCount, 4000);
    updateQueueCount();
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", onlineHandler);
      clearInterval(queueInterval);
    };
  }, [load]);

  const updateQueueCount = useCallback(async () => {
    const count = await getQueueCount();
    setPendingCount(count);
  }, []);

  const handleSyncNow = useCallback(async () => {
    await runSync();
    updateQueueCount();
  }, [updateQueueCount]);

  return {
    state: {
      events,
      tasks,
      deferredPrompt,
      showInstall,
      offline,
      pendingCount,
      status,
      lastSync
    },
    actions: {
      setDeferredPrompt,
      setShowInstall,
      handleSyncNow
    }
  };
}
