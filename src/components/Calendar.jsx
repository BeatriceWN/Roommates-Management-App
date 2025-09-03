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
.then(res => res.json())
      .then(data => setEvents([...events, data]));

    setTitle("");
    setDate("");
  }; return (
    <div>
      <h2>📅 Calendar</h2>
      <form onSubmit={addEvent}>
        <input
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Add Event</button>
      </form> <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title} — {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Calendar;