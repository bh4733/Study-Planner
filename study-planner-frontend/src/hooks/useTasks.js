import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import * as api from "../services/api";

export default function useTasks(filters = {}) {
  const { token } = useAuth();
  const filterKey = JSON.stringify(filters); // a stable value for useEffect to compare
  const [reloadCount, setReloadCount] = useState(0);
  const requestKey = `${filterKey}#${reloadCount}`;

  const [result, setResult] = useState({ key: null, tasks: [], error: "" });

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;

    api
      .getTasks(token, JSON.parse(filterKey))
      .then((tasks) => {
        if (!cancelled) setResult({ key: requestKey, tasks, error: "" });
      })
      .catch((err) => {
        if (!cancelled)
          setResult((prev) => ({
            ...prev,
            key: requestKey,
            error: err.message,
          }));
      });

    return () => {
      cancelled = true;
    };
  }, [token, filterKey, requestKey]);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);

  const create = useCallback(
    async (task) => {
      const created = await api.createTask(token, task);
      setResult((prev) => ({ ...prev, tasks: [...prev.tasks, created] }));
      reload();
      return created;
    },
    [token, reload],
  );

  const update = useCallback(
    async (id, changes) => {
      const updated = await api.updateTask(token, id, changes);
      setResult((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t._id === id ? updated : t)),
      }));
      reload();
      return updated;
    },
    [token, reload],
  );

  const changeStatus = useCallback(
    async (id, status) => {
      const updated = await api.updateTaskStatus(token, id, status);
      setResult((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t._id === id ? updated : t)),
      }));
      reload();
      return updated;
    },
    [token, reload],
  );

  const remove = useCallback(
    async (id) => {
      await api.deleteTask(token, id);
      setResult((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t._id !== id),
      }));
      reload();
    },
    [token, reload],
  );

  const isLoading = result.key !== requestKey;

  return {
    tasks: result.tasks,
    error: result.error,
    isLoading,
    isInitialLoading: isLoading && result.key === null,
    reload,
    create,
    update,
    changeStatus,
    remove,
  };
}
