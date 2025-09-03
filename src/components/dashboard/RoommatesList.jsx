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