import { useEffect, useState } from "react";

function Roommates() {
  const [roommates, setRoommates] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/roommates")
      .then(res => res.json())
      .then(data => setRoommates(data));
  }, []);

  const addRoommate = (e) => {
    e.preventDefault();
    const newRoommate = { name, email, phone };

    fetch("http://localhost:3000/roommates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoommate)
    })
      .then(res => res.json())
      .then(data => setRoommates([...roommates, data]));

    setName("");
    setEmail("");
    setPhone("");
  };
