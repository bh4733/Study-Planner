import TaskCard from "./taskcard";

export default function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id}>
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  );
}
