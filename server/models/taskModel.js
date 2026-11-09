import { taskDB } from "../db/database.js";
import { v4 as uuidv4 } from "uuid";

// Escape special regex characters so a search like "C++" doesn't break the query
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createTask = (userId, data) => {
  const now = new Date();
  return taskDB.insert({
    _id: uuidv4(),
    title: "",
    description: "",
    module: "General",
    deadline: null,
    startDate: null,
    priority: "medium",
    status: "not-started",
    tags: [],
    estimatedHours: 0,
    actualHours: 0,
    notes: "",
    ...data,
    userId, // set last so nothing in data can overwrite it
    createdAt: now,
    updatedAt: now,
  });
};

export const getTasksByUser = (userId, filters = {}) => {
  const query = { userId };

  if (filters.module) query.module = filters.module;
  if (filters.priority) query.priority = filters.priority;
  if (filters.status) query.status = filters.status;

  if (filters.deadlineFrom || filters.deadlineTo) {
    query.deadline = {};
    if (filters.deadlineFrom) query.deadline.$gte = filters.deadlineFrom;
    if (filters.deadlineTo) query.deadline.$lte = filters.deadlineTo;
  }

  if (filters.q) {
    const pattern = new RegExp(escapeRegex(filters.q), "i"); // case-insensitive
    query.$or = [
      { title: { $regex: pattern } },
      { description: { $regex: pattern } },
      { module: { $regex: pattern } },
    ];
  }

  return taskDB.find(query).sort({ deadline: 1 });
};

// The userId condition is what stops one user from reading another user's task
export const getTaskById = (id, userId) => taskDB.findOne({ _id: id, userId });

export const updateTask = async (id, userId, changes) => {
  const count = await taskDB.update(
    { _id: id, userId },
    { $set: { ...changes, updatedAt: new Date() } }
  );
  return count ? getTaskById(id, userId) : null;
};

export const deleteTask = async (id, userId) => {
  const count = await taskDB.remove({ _id: id, userId });
  return count > 0;
};
