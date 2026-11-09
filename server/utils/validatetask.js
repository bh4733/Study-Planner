export const VALID_STATUS = ["not-started", "underway", "completed"];
export const VALID_PRIORITY = ["low", "medium", "high"];

const ALLOWED_FIELDS = [
  "title",
  "description",
  "module",
  "deadline",
  "startDate",
  "priority",
  "status",
  "tags",
  "estimatedHours",
  "actualHours",
  "notes",
];
const MAX_YEARS_AHEAD = 5;

const toDateString = (date) => date.toISOString().slice(0, 10);
const today = () => toDateString(new Date());
const latestAllowed = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + MAX_YEARS_AHEAD);
  return toDateString(d);
};

export const isValidDateString = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && toDateString(date) === value;
};

const checkText = (value, field, max, errors) => {
  if (typeof value !== "string") {
    errors[field] = `${field} must be text`;
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length > max)
    errors[field] = `${field} must be ${max} characters or fewer`;
  return trimmed;
};

const checkHours = (value, field, errors) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 1000) {
    errors[field] = `${field} must be a number between 0 and 1000`;
    return undefined;
  }
  return n;
};

export const validateTask = (input = {}, existing = null) => {
  const isCreate = existing === null;
  const errors = {};
  const data = {};

  for (const field of ALLOWED_FIELDS) {
    if (input[field] !== undefined) data[field] = input[field];
  }

  // Title: required when creating, and can't be blanked when editing
  if (isCreate || data.title !== undefined) {
    data.title = checkText(data.title ?? "", "title", 100, errors);
    if (!errors.title && !data.title) errors.title = "Title is required";
  }

  for (const [field, max] of [
    ["description", 1000],
    ["module", 50],
    ["notes", 2000],
  ]) {
    if (data[field] !== undefined)
      data[field] = checkText(data[field], field, max, errors);
  }
  if (data.module === "") data.module = "General";

  if (isCreate || data.deadline !== undefined) {
    if (!isValidDateString(data.deadline)) {
      errors.deadline = "Deadline must be a real date in YYYY-MM-DD format";
    } else if (data.deadline !== existing?.deadline) {
      if (data.deadline < today())
        errors.deadline = "Deadline cannot be in the past";
      else if (data.deadline > latestAllowed())
        errors.deadline = `Deadline must be within ${MAX_YEARS_AHEAD} years`;
    }
  }

  if (data.startDate === "") data.startDate = null;
  if (data.startDate != null && !isValidDateString(data.startDate)) {
    errors.startDate = "Start date must be a real date in YYYY-MM-DD format";
  }
  const start =
    data.startDate !== undefined ? data.startDate : existing?.startDate;
  const end = data.deadline ?? existing?.deadline;
  if (start && end && !errors.startDate && !errors.deadline && start > end) {
    errors.startDate = "Start date must be on or before the deadline";
  }

  if (data.priority !== undefined && !VALID_PRIORITY.includes(data.priority)) {
    errors.priority = `Priority must be one of: ${VALID_PRIORITY.join(", ")}`;
  }
  if (data.status !== undefined && !VALID_STATUS.includes(data.status)) {
    errors.status = `Status must be one of: ${VALID_STATUS.join(", ")}`;
  }

  for (const field of ["estimatedHours", "actualHours"]) {
    if (data[field] !== undefined)
      data[field] = checkHours(data[field], field, errors);
  }

  if (data.tags !== undefined) {
    if (
      !Array.isArray(data.tags) ||
      data.tags.length > 10 ||
      data.tags.some((t) => typeof t !== "string")
    ) {
      errors.tags = "Tags must be a list of up to 10 words";
    } else {
      data.tags = data.tags.map((t) => t.trim()).filter(Boolean);
    }
  }

  return { data, errors };
};

// Validates the ?q=&module=&status=&priority=&deadlineFrom=&deadlineTo= query string
export const validateFilters = (query = {}) => {
  const errors = {};
  const pick = (key) =>
    typeof query[key] === "string" && query[key].trim()
      ? query[key].trim()
      : undefined;

  const filters = {
    q: pick("q"),
    module: pick("module"),
    status: pick("status"),
    priority: pick("priority"),
    deadlineFrom: pick("deadlineFrom"),
    deadlineTo: pick("deadlineTo"),
  };

  if (filters.q && filters.q.length > 100) errors.q = "Search is too long";
  if (filters.status && !VALID_STATUS.includes(filters.status))
    errors.status = "Unknown status";
  if (filters.priority && !VALID_PRIORITY.includes(filters.priority))
    errors.priority = "Unknown priority";
  for (const key of ["deadlineFrom", "deadlineTo"]) {
    if (filters[key] && !isValidDateString(filters[key]))
      errors[key] = "Must be a date in YYYY-MM-DD format";
  }
  if (
    filters.deadlineFrom &&
    filters.deadlineTo &&
    !errors.deadlineFrom &&
    !errors.deadlineTo &&
    filters.deadlineFrom > filters.deadlineTo
  ) {
    errors.deadlineTo = "End of range must be on or after the start";
  }

  return { filters, errors };
};
