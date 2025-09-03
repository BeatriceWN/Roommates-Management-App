import { useEffect, useState } from "react";
function Calendar() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);
  const addEvent = (e) => {
    e.preventDefault();
    const newEvent = { title, date };
 fetch("http://localhost:3000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent)
    })
