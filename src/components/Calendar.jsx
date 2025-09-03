import { useEffect, useState } from "react";
function Calendar() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);
