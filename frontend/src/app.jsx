import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch(`${API}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setInput("");
  };

  const toggleTask = async (id) => {
    const res = await fetch(`${API}/tasks/${id}`, { method: "PUT" });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📝 Todo App</h1>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button style={styles.addBtn} onClick={addTask}>Add</button>
      </div>
      {tasks.length === 0 && <p style={styles.empty}>No tasks yet. Add one!</p>}
      <ul style={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} style={styles.item}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                ...styles.title,
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#aaa" : "#222",
                cursor: "pointer",
              }}
            >
              {task.completed ? "✅" : "⬜"} {task.title}
            </span>
            <button style={styles.deleteBtn} onClick={() => deleteTask(task.id)}>🗑️</button>
          </li>
        ))}
      </ul>
      <p style={styles.footer}>{tasks.filter((t) => t.completed).length} / {tasks.length} completed</p>
    </div>
  );
}

const styles = {
  container: { maxWidth: "500px", margin: "60px auto", fontFamily: "Segoe UI, sans-serif", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", background: "#fff" },
  heading: { textAlign: "center", color: "#1A5276", marginBottom: "24px" },
  inputRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { flex: 1, padding: "10px 14px", fontSize: "15px", borderRadius: "8px", border: "1px solid #ccc" },
  addBtn: { padding: "10px 20px", background: "#1A5276", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", cursor: "pointer" },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 10px", borderBottom: "1px solid #f0f0f0" },
  title: { fontSize: "15px", flex: 1 },
  deleteBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", marginLeft: "10px" },
  empty: { textAlign: "center", color: "#aaa", margin: "20px 0" },
  footer: { textAlign: "center", color: "#888", marginTop: "16px", fontSize: "13px" },
};