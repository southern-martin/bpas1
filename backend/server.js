import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clarifyRoutes from "./src/infrastructure/http/routes/clarify.routes.js";
import cardsRoutes from "./src/infrastructure/http/routes/cards.routes.js";
import pipelineRoutes from "./src/infrastructure/http/routes/pipeline.routes.js";
import planningRoutes from "./src/infrastructure/http/routes/planning.routes.js";
import audioRoutes from "./src/infrastructure/http/routes/audio.routes.js";
import clientsRoutes from "./src/infrastructure/http/routes/clients.routes.js";
import projectsRoutes from "./src/infrastructure/http/routes/projects.routes.js";
import usersRoutes from "./src/infrastructure/http/routes/users.routes.js";
import authRoutes from "./src/infrastructure/http/routes/auth.routes.js";
import activitiesRoutes from "./src/infrastructure/http/routes/activities.routes.js";
import aiCardRoutes from "./src/infrastructure/http/routes/aiCard.routes.js";
import syncRoutes from "./src/infrastructure/http/routes/sync.routes.js";
import { requireAuth, requireOwner } from "./src/middleware/auth.js";
import { logError, logInfo } from "./src/utils/logger.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/clarify", clarifyRoutes);
app.use("/cards", cardsRoutes);
app.use("/pipeline", pipelineRoutes);
app.use("/planning", planningRoutes);
app.use("/audio", audioRoutes);
app.use("/clients", clientsRoutes);
app.use("/projects", projectsRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/activities", requireAuth, requireOwner, activitiesRoutes);
app.use("/ai", aiCardRoutes);
app.use("/sync", syncRoutes);

app.get("/", (req, res) => {
  res.send("BPAS 1 Backend + OpenAI connection is working");
});

// 404 handler
app.use((req, res) => {
  logError(`Not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Not found" });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logError(`${req.method} ${req.url} - ${err.stack || err}`);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = 4000;
app.listen(PORT, () => logInfo(`Server running on ${PORT}`));

process.on("unhandledRejection", err => {
  logError(`Unhandled Rejection: ${err?.stack || err}`);
});

process.on("uncaughtException", err => {
  logError(`Uncaught Exception: ${err?.stack || err}`);
});
