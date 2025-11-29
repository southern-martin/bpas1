import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clarifyRoutes from "./src/routes/clarify.routes.js";
import cardsRoutes from "./src/routes/cards.routes.js";
import pipelineRoutes from "./src/routes/pipeline.routes.js";
import planningRoutes from "./src/routes/planning.routes.js";
import audioRoutes from "./src/routes/audio.routes.js";
import clientsRoutes from "./src/routes/clients.routes.js";
import projectsRoutes from "./src/routes/projects.routes.js";
import usersRoutes from "./src/routes/users.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import activitiesRoutes from "./src/routes/activities.routes.js";
import aiCardRoutes from "./src/routes/aiCard.routes.js";
import syncRoutes from "./src/routes/sync.routes.js";
import { requireAuth, requireOwner } from "./src/middleware/auth.js";

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

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
