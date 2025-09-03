import { useEffect, useState } from "react";

function Chores() {
  const [chores, setChores] = useState([]);
  const [name, setName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Fetch chores
  useEffect(() => {
    fetch("http://localhost:3000/chores")
      .then((res) => res.json())
      .then((data) => setChores(data));
  }, []);

  // Add new chore
  const addChore = (e) => {
    e.preventDefault();
    const newChore = { name, assignedTo, completed: false };

    fetch("http://localhost:3000/chores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChore),
    })
      .then((res) => res.json())
      .then((data) => setChores([...chores, data]));

    setName("");
    setAssignedTo("");
  };

  // Mark complete
  const toggleComplete = (id, completed) => {
    fetch(`http://localhost:3000/chores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((res) => res.json())
      .then((updated) =>
        setChores(chores.map((chore) => (chore.id === id ? updated : chore)))
      );
  };

  return (
    <div>
      <h2>🧹 Chores</h2>
      <form onSubmit={addChore}>
        <input
          type="text"
          placeholder="Chore name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Assigned to"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        />
        <button type="submit">Add Chore</button>
      </form>

      <ul>
        {chores.map((chore) => (
          <li key={chore.id}>
            {chore.name} — {chore.assignedTo}
            <button onClick={() => toggleComplete(chore.id, chore.completed)}>
              {chore.completed ? "✅ Done" : "⏳ Pending"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chores;