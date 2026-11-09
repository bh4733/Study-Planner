const BASE_URL = "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

const request = async (path, { method = "GET", body, token } = {}) => {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the server. Check that it's running.", 0);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Only treat 401 as "session ended" when a token was sent,
    // so a wrong password on the login page doesn't trigger it
    if (res.status === 401 && token && onUnauthorized) onUnauthorized();
    throw new ApiError(
      data?.error || `Request failed (${res.status})`,
      res.status,
      data?.details,
    );
  }

  return data;
};

// Users
export const loginUser = (credentials) =>
  request("/users/login", { method: "POST", body: credentials });

export const registerUser = (details) =>
  request("/users/register", { method: "POST", body: details });

// Tasks
export const getTasks = (token, filters = {}) => {
  const params = new URLSearchParams(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
  const query = params.toString();
  return request(`/tasks${query ? `?${query}` : ""}`, { token });
};

export const getTask = (token, id) =>
  request(`/tasks/${encodeURIComponent(id)}`, { token });

export const createTask = (token, task) =>
  request("/tasks", { method: "POST", token, body: task });

export const updateTask = (token, id, task) =>
  request(`/tasks/${encodeURIComponent(id)}`, {
    method: "PUT",
    token,
    body: task,
  });

export const updateTaskStatus = (token, id, status) =>
  request(`/tasks/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    token,
    body: { status },
  });

export const deleteTask = (token, id) =>
  request(`/tasks/${encodeURIComponent(id)}`, { method: "DELETE", token });
