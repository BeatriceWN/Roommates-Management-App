import { useEffect, useState } from "react";

function Chores() {
  const [chores, setChores] = useState([]);
  const [name, setName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Fetch chores
  useEffect(() => {
    fetch("http://localhost:4000/chores")
      .then(res => res.json())
      .then(data => setChores(data));
  }, []);

    // Add new chore
  const addChore = (e) => {
    e.preventDefault();
    const newChore = { name, assignedTo, completed: false };

    fetch("http://localhost:4000/chores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChore)
    })
      .then(res => res.json())
      .then(data => setChores([...chores, data]));

    setName("");
    setAssignedTo("");
  };