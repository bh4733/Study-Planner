import express from "express";
import {
  createTask,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask,
} from "../models/taskModel.js";
import {
  validateTask,
  validateFilters,
  VALID_STATUS,
} from "../utils/validatetask.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asynchandler.js";

const router = express.Router();

// Every task route requires login, so no individual route can forget it
router.use(authenticate);

const hasErrors = (errors) => Object.keys(errors).length > 0;
const validationFailed = (res, details) =>
  res.status(400).json({ error: "Validation failed", details });
const notFound = (res) => res.status(404).json({ error: "Task not found" });

// GET /api/tasks?q=&module=&status=&priority=&deadlineFrom=&deadlineTo=
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { filters, errors } = validateFilters(req.query);
    if (hasErrors(errors)) return validationFailed(res, errors);
    res.json(await getTasksByUser(req.user.userId, filters));
  })
);

// GET /api/tasks/:id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const task = await getTaskById(req.params.id, req.user.userId);
    if (!task) return notFound(res);
    res.json(task);
  })
);

// POST /api/tasks
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { data, errors } = validateTask(req.body);
    if (hasErrors(errors)) return validationFailed(res, errors);
    const task = await createTask(req.user.userId, data);
    res.status(201).json(task);
  })
);

// PUT /api/tasks/:id
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const existing = await getTaskById(req.params.id, req.user.userId);
    if (!existing) return notFound(res);

    const { data, errors } = validateTask(req.body, existing);
    if (hasErrors(errors)) return validationFailed(res, errors);

    res.json(await updateTask(req.params.id, req.user.userId, data));
  })
);

// PATCH /api/tasks/:id/status
router.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!VALID_STATUS.includes(status)) {
      return validationFailed(res, {
        status: `Status must be one of: ${VALID_STATUS.join(", ")}`,
      });
    }
    const updated = await updateTask(req.params.id, req.user.userId, { status });
    if (!updated) return notFound(res);
    res.json(updated);
  })
);

// DELETE /api/tasks/:id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await deleteTask(req.params.id, req.user.userId);
    if (!deleted) return notFound(res);
    res.json({ message: "Task deleted", id: req.params.id });
  })
);

export default router;
