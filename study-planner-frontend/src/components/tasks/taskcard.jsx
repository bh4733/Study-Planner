import { formatDate, daysUntil } from "../../utils/dates";

const STATUS_LABELS = {
  "not-started": "Not started",
  underway: "Underway",
  completed: "Completed",
};

export default function TaskCard({ task }) {
  const days = daysUntil(task.deadline);
  const overdue = days !== null && days < 0 && task.status !== "completed";

  return (
    <article className={`task-card${overdue ? " is-overdue" : ""}`}>
      <div className="task-card-top">
        <h2 className="task-title">{task.title}</h2>
        <span className={`badge priority-${task.priority}`}>
          {task.priority} priority
        </span>
      </div>
      <p className="task-module">{task.module}</p>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <dl className="task-meta">
        <div>
          <dt>Due</dt>
          <dd>
            <time dateTime={task.deadline}>{formatDate(task.deadline)}</time>
            {overdue && <strong className="overdue-label"> · Overdue</strong>}
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{STATUS_LABELS[task.status] ?? task.status}</dd>
        </div>
      </dl>
    </article>
  );
}
