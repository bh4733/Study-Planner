import { useAuth } from "../hooks/useAuth";
import useTasks from "../hooks/useTasks";
import TaskList from "../components/tasks/TaskList";
import Alert from "../components/ui/alert";

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, error, isInitialLoading, reload } = useTasks();

  return (
    <section>
      <div className="page-header">
        <h1>Hi {user?.username}</h1>
        <p className="muted">
          Here's everything on your plate, soonest deadline first.
        </p>
      </div>

      {isInitialLoading && <p role="status">Loading your tasks…</p>}

      {error && (
        <Alert>
          {error}{" "}
          <button type="button" className="button-link" onClick={reload}>
            Try again
          </button>
        </Alert>
      )}

      {!isInitialLoading && !error && tasks.length === 0 && (
        <div className="empty-state">
          <h2>No tasks yet</h2>
          <p>Add your first study task to start planning.</p>
        </div>
      )}

      {tasks.length > 0 && <TaskList tasks={tasks} />}
    </section>
  );
}
