import { useEffect, useState } from "react";

function Roommates() {
  const [roommates, setRoommates] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  