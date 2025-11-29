import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { api } from "../api/client.js";

export default function FieldCard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [card, setCard] = useState(null);
  const [status, setStatus] = useState("To Do");

  const [rawNotes, setRawNotes] = useState("");
  const [clarifiedNotes, setClarifiedNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/cards/${id}`);
      const c = res.data;

      setCard(c);
      setStatus(c.status);
      setClarifiedNotes(c.notes_clarified || "");
    }
    load();
  }, [id]);

  async function handleClarify() {
    const res = await api.post("/clarify", { raw_text: rawNotes });
    setClarifiedNotes(res.data.clarified_text);
  }

  async function handleSave() {
    setSaving(true);

    await api.post(`/cards/${id}/updates`, {
      status,
      notes_clarified: clarifiedNotes,
      user_id: "staff-1"
    });

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

      // Auto-stop after 5 seconds for MVP
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

      const res = await api.post("/audio/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const newText = res.data.raw_text || "";
      setRawNotes(prev => (prev ? `${prev}\n${newText}` : newText));
    } catch (err) {
      console.error("Transcription upload error:", err);
      alert("Failed to transcribe audio.");
    }
  }

  if (localStorage.getItem("role") !== "Staff") {
    return <Navigate to="/login" replace />;
  }

  if (!card) return <p>Loading…</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{card.title}</h1>

      <p>Client: {card.linked_client_id || "—"}</p>
      <p>Project: {card.linked_project_id || "—"}</p>

      <div style={{ marginTop: 20 }}>
        <strong>Status:</strong>
        <select
          style={{ marginLeft: 10 }}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option>To Do</option>
          <option>Doing</option>
          <option>Done</option>
          <option>Blocked</option>
        </select>
      </div>

      <div className="card clarify-panel" style={{ marginTop: 20, padding: 20 }}>
        <h2>Notes</h2>

        <textarea
          value={rawNotes}
          onChange={e => setRawNotes(e.target.value)}
          placeholder="Speak or type your notes here..."
          style={{ width: "100%", height: 100 }}
        />

        <div style={{ marginTop: 10 }}>
          {!recording ? (
            <button onClick={handleStartRecording}>🎤 Start Recording</button>
          ) : (
            <button onClick={handleStopRecording}>⏹ Stop Recording</button>
          )}

          <button onClick={handleClarify} style={{ marginLeft: 10 }}>
            ✨ Clarify
          </button>

          <button
            onClick={() => {
              setRawNotes("");
              setClarifiedNotes("");
            }}
            style={{ marginLeft: 10 }}
          >
            🗑 Clear
          </button>
        </div>

        <h3 style={{ marginTop: 20 }}>Clarified Version</h3>

        <textarea
          value={clarifiedNotes}
          onChange={e => setClarifiedNotes(e.target.value)}
          style={{ width: "100%", height: 100 }}
          placeholder="Clarified notes will appear here..."
        />

        <button onClick={handleSave} disabled={saving} style={{ marginTop: 20 }}>
          {saving ? "Saving…" : "💾 Save to System"}
        </button>
      </div>
    </div>
  );
}
