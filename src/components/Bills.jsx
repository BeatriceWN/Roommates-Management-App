import { useEffect, useState } from "react";

function Bills() {
  const [bills, setBills] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/bills")
      .then(res => res.json())
      .then(data => setBills(data));
  }, []);

  const addBill = (e) => {
    e.preventDefault();
    const newBill = { name, amount: Number(amount), dueDate, paid: false };

    fetch("http://localhost:4000/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBill)
    })
      .then(res => res.json())
      .then(data => setBills([...bills, data]));

    setName("");
    setAmount("");
    setDueDate("");
  };

  const markPaid = (id, paid) => {
    fetch(`http://localhost:4000/bills/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid: !paid })
    })
      .then(res => res.json())
      .then(updated =>
        setBills(bills.map(bill => (bill.id === id ? updated : bill)))
      );
  };

  return (
    <div>
      <h2>💰 Bills</h2>
      <form onSubmit={addBill}>
        <input
          type="text"
          placeholder="Bill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Bill</button>
      </form>

      <ul>
        {bills.map(bill => (
          <li key={bill.id}>
            {bill.name} — ${bill.amount} (Due: {bill.dueDate})  
            <button onClick={() => markPaid(bill.id, bill.paid)}>
              {bill.paid ? "✅ Paid" : "❌ Unpaid"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bills;
