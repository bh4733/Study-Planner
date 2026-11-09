import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { loginUser, setUnauthorizedHandler } from "../services/api";
import {
  loadAuth,
  saveAuth,
  clearAuth,
  decodeToken,
  isTokenUsable,
} from "../utils/authStorage";

const EXPIRED_MESSAGE = "Your session has expired. Please log in again.";

export default function AuthProvider({ children }) {
  // Passing the function (not loadAuth()) means storage is only read on the first render
  const [auth, setAuth] = useState(loadAuth);
  const [sessionMessage, setSessionMessage] = useState("");

  const login = useCallback(async (username, password) => {
    const { token, user } = await loginUser({ username, password }); // throws on failure
    if (!isTokenUsable(token))
      throw new Error("Login failed. Please try again.");
    const next = { token, user };
    saveAuth(next);
    setAuth(next);
    setSessionMessage("");
  }, []);

  const logout = useCallback((message = "") => {
    clearAuth();
    setAuth(null);
    setSessionMessage(message);
  }, []);

  // Any API call that gets a 401 logs the user out
  useEffect(() => {
    setUnauthorizedHandler(() => logout(EXPIRED_MESSAGE));
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Also log out automatically at the moment the token expires
  useEffect(() => {
    if (!auth) return undefined;
    const msLeft = decodeToken(auth.token).exp * 1000 - Date.now();
    const timer = setTimeout(
      () => logout(EXPIRED_MESSAGE),
      Math.max(msLeft, 0),
    );
    return () => clearTimeout(timer);
  }, [auth, logout]);

  const value = useMemo(
    () => ({
      token: auth?.token ?? null,
      user: auth?.user ?? null,
      isLoggedIn: Boolean(auth),
      login,
      logout,
      sessionMessage,
    }),
    [auth, login, logout, sessionMessage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
