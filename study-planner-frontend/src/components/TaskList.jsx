const TaskList = ({ tasks }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id}>
          {task.title} - {task.priority}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
