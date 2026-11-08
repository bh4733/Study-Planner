import express from "express";

import {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
  updateStatus,
} from "../models/taskModel.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// ✅ CREATE TASK
router.post("/", authenticate, async (req, res) => {
  try {
    const task = await createTask({
      ...req.body,
      userId: req.userId,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET USER TASKS
router.get("/", authenticate, async (req, res) => {
  try {
    const tasks = await getTasksByUser(req.user.userId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE TASK
router.put("/:id", authenticate, async (req, res) => {
  await updateTask(req.params.id, req.body);
  res.json({ message: "Updated" });
});

// ✅ DELETE TASK
router.delete("/:id", authenticate, async (req, res) => {
  await deleteTask(req.params.id);
  res.json({ message: "Deleted" });
});

// ✅ CHANGE STATUS

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;

  await updateStatus(req.params.id, status);

  res.json({ message: "Status updated" });
});

export default router;
