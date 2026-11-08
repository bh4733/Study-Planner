import express from "express";
import cors from "cors";

import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// ROOT
app.get("/", (req, res) => {
  res.send("Study Planner API running");
});

const PORT = 3000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
