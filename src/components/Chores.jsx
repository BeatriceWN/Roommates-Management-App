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

  