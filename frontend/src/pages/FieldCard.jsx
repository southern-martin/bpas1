import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { api } from "../api/client.js";
import {
  enqueue,
  getCardFromCache,
  upsertCards,
  upsertClients,
  upsertProjects,
  getClientsFromCache,
  getProjectsFromCache
} from "../offline/db.js";

export default function FieldCard() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    loadCard();
  }, [id]);

  useEffect(() => {
    const handler = () => setOffline(!navigator.onLine);
    window.addEventListener("online", handler);
    window.addEventListener("offline", handler);
    return () => {
      window.removeEventListener("online", handler);
      window.removeEventListener("offline", handler);
    };
  }, []);

  async function loadCard() {
    try {
      const [clientsRes, projectsRes] = await Promise.all([
        api.get("/clients"),
        api.get("/projects")
      ]);
      await upsertClients(clientsRes.data);
      await upsertProjects(projectsRes.data);
      setClients(clientsRes.data);
      setProjects(projectsRes.data);

      const res = await api.get(`/cards/${id}`);
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

      const cached = await getCardFromCache(id);
      if (cached) {
        setCard(cached);
        setStatus(cached.status);
        setClarifiedNotes(cached.notes_clarified || "");
      }
    }
  }

  async function handleClarify() {
    const res = await api.post("/clarify", { raw_text: rawNotes });
    setClarifiedNotes(res.data.clarified_text);
  }

  async function handleSave() {
    setSaving(true);

    const payload = {
      status,
      notes_clarified: clarifiedNotes,
      user_id: localStorage.getItem("userId") || "staff-1"
    };

    if (navigator.onLine) {
      await api.post(`/cards/${id}/updates`, payload);
    } else {
      await enqueue({
        id: crypto.randomUUID(),
        type: "activity",
        payload: { cardId: id, body: payload }
      });
    }

    setSaving(false);
    navigate("/field/today");
  }

  async function handleStartRecording() {
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
  }

  async function handleStopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }

  async function sendAudioToBackend(blob) {
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
        // offline: queue transcription later (store blob reference)
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result;
          await enqueue({
            id: crypto.randomUUID(),
            type: "audio-upload",
            payload: { cardId: id, dataUrl: base64 }
          });
        };
        reader.readAsDataURL(blob);
      }
    } catch (err) {
      console.error("Transcription upload error:", err);
      alert("Failed to transcribe audio.");
    }
  }

  if (localStorage.getItem("role") !== "Staff") {
    return <Navigate to="/login" replace />;
  }

  if (!card) return <p>Loading…</p>;

  const clientName =
    clients.find(c => c.id === card.linked_client_id)?.name || "—";
  const projectName =
    projects.find(p => p.id === card.linked_project_id)?.name || "—";

  return (
    <div className="field-container">
      <div className="page-header">
        <h1>{card.title}</h1>
        {offline && <div className="offline-banner">Offline — changes will sync when online</div>}
      </div>

      <p>Client: {clientName}</p>
      <p>Project: {projectName}</p>

      <div className="status-row">
        <label>Status</label>
        <select
          className="status-select"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option>To Do</option>
          <option>Doing</option>
          <option>Blocked</option>
          <option>Done</option>
        </select>
      </div>

      <div className="button-row">
        {!recording ? (
          <button className="record-btn" onClick={handleStartRecording}>
            🎤 Record
          </button>
        ) : (
          <button className="stop-btn" onClick={handleStopRecording}>
            ⏹ Stop
          </button>
        )}

        <button className="clarify-btn" onClick={handleClarify}>
          ✨ Clarify
        </button>
        <button
          className="clear-btn"
          onClick={() => {
            setRawNotes("");
            setClarifiedNotes("");
          }}
        >
          🗑 Clear
        </button>
      </div>

      <textarea
        className="notes-input"
        value={rawNotes}
        onChange={e => setRawNotes(e.target.value)}
        placeholder="Speak or type your notes..."
      />

      <textarea
        className="notes-clarified"
        value={clarifiedNotes}
        onChange={e => setClarifiedNotes(e.target.value)}
        placeholder="Clarified notes appear here..."
      />

      <button className="save-btn" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "💾 Save"}
      </button>
    </div>
  );
}
