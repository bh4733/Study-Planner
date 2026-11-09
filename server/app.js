import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/users.js";
import { PORT } from "./config.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Study Planner API running");
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Catches anything passed to next(err), including errors from asyncHandler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body is not valid JSON" });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
