import { useState, useEffect } from "react";
import Header from "./Components/Header";
import Tasks from "./Components/Tasks";
import Addtask from "./Components/Addtask";
import "./index.css";
import { API_URL } from "./config";
fetch(`${API_URL}/todos`);

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks from backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`);
        const data = await response.json();
        setTasks(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Add Task function (POST to backend)
  const addTask = async (task) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete function (DELETE from backend)
  const deleteTask = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle reminder function (PUT to backend)
  const toggleReminder = async (id) => {
    try {
      const taskToToggle = tasks.find((task) => task.id === id);
      const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/todos${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        }
      );

      const data = await response.json();

      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, reminder: data.reminder } : task
        )
      );
    } catch (error) {
      console.error("Error toggling reminder:", error);
    }
  };

  return (
    <div className="container">
      <Header
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      {showAddTask && <Addtask onAdd={addTask} />}
      {isLoading ? (
        "Loading tasks..."
      ) : tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : (
        "OOPS! There is no Tasks yet."
      )}
    </div>
  );
};

export default App;
