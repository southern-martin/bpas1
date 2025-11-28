import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clarifyRoutes from "./src/routes/clarify.routes.js";
import cardsRoutes from "./src/routes/cards.routes.js";
import pipelineRoutes from "./src/routes/pipeline.routes.js";
import planningRoutes from "./src/routes/planning.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/clarify", clarifyRoutes);
app.use("/cards", cardsRoutes);
app.use("/pipeline", pipelineRoutes);
app.use("/planning", planningRoutes);

app.get("/", (req, res) => {
  res.send("BPAS 1 Backend + OpenAI connection is working");
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
