// import { useState, useEffect, useContext } from "react";
// import { getTasks } from "../services/api";
// import TaskList from "../components/TaskList";
// import { AuthContext } from "../context/AuthContext";

// const Dashboard = () => {
//   const { token } = useContext(AuthContext);
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     const loadTasks = async () => {
//       const data = await getTasks(token);
//       setTasks(data);
//     };

//     loadTasks();
//   }, [token]);

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <TaskList tasks={tasks} />
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getTasks } from "../services/api";
import TaskList from "../components/TaskList";

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        console.log("✅ token in Dashboard:", token);

        const data = await getTasks(token);

        console.log("✅ tasks received from API:", data);

        setTasks(data);
      } catch (err) {
        console.error("❌ error loading tasks:", err);
      }
    };

    if (token) {
      loadTasks();
    }
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* ✅ Debug output */}
      <p>Number of tasks: {tasks.length}</p>

      {/* ✅ Safe rendering */}
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Dashboard;
