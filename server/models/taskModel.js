import { taskDB } from "../db/database.js";
import { v4 as uuidv4 } from "uuid";

// ✅ Allowed values (important for validation)
const VALID_STATUS = ["not-started", "underway", "completed"];
const VALID_PRIORITY = ["low", "medium", "high"];

// ✅ CREATE TASK
export const createTask = async (task) => {
  const newTask = {
    _id: uuidv4(),

    userId: task.userId,

    title: task.title || "Untitled Task",
    description: task.description || "",

    module: task.module || "General",

    deadline: task.deadline || null,

    priority: VALID_PRIORITY.includes(task.priority) ? task.priority : "medium",

    status: "not-started",

    createdAt: new Date(),
    updatedAt: new Date(),

    tags: Array.isArray(task.tags) ? task.tags : [],
    estimatedHours: task.estimatedHours || 0,
    actualHours: 0,
    notes: task.notes || "",
  };

  return taskDB.insert(newTask);
};

// ✅ GET TASKS
export const getTasksByUser = (userId, filters = {}) => {
  const query = { userId };

  // ✅ filtering
  if (filters.module) query.module = filters.module;
  if (filters.priority) query.priority = filters.priority;
  if (filters.status) query.status = filters.status;

  return taskDB.find(query);
};

// ✅ UPDATE TASK
export const updateTask = async (id, update) => {
  // ✅ prevent overwriting critical fields
  delete update._id;
  delete update.userId;
  delete update.createdAt;

  // ✅ validate priority
  if (update.priority && !VALID_PRIORITY.includes(update.priority)) {
    throw new Error("Invalid priority value");
  }

  // ✅ validate status
  if (update.status && !VALID_STATUS.includes(update.status)) {
    throw new Error("Invalid status value");
  }

  return taskDB.update(
    { _id: id },
    {
      $set: {
        ...update,
        updatedAt: new Date(),
      },
    }
  );
};

// ✅ DELETE TASK
export const deleteTask = (id) => taskDB.remove({ _id: id });

// ✅ UPDATE STATUS (more robust)
export const updateStatus = async (id, status) => {
  if (!VALID_STATUS.includes(status)) {
    throw new Error("Invalid status value");
  }

  return taskDB.update(
    { _id: id },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  );
};
