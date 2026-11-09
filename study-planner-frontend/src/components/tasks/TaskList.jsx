import TaskCard from "./taskcard";

const TaskList = ({ tasks }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id}>
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
