const STORAGE_KEY = "studyPlanner.auth";

export const decodeToken = (token) => {
  if (typeof token !== "string") return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

export const isTokenUsable = (token) => {
  const payload = decodeToken(token);
  return Boolean(payload?.exp) && payload.exp * 1000 > Date.now();
};

export const clearAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
};

export const saveAuth = (auth) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  } catch {
    /* storage unavailable */
  }
};

export const loadAuth = () => {
  try {
    localStorage.removeItem("token");
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && isTokenUsable(saved.token)) return saved;
  } catch {
    /* corrupt or unavailable storage */
  }
  clearAuth();
  return null;
};
