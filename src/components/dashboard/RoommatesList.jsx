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

  return (
    <div>
      <h2>👥 Roommates</h2>
      <form onSubmit={addRoommate}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Add Roommate</button>
      </form>

      <ul>
        {roommates.map(r => (
          <li key={r.id}>
            {r.name} — {r.email} — {r.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Roommates;