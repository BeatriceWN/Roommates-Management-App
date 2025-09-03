import { useState } from "react";
import { useData } from "../context/DataContext";

export default function Bills() {
  const { bills, addBill, markBillPaid } = useData();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !dueDate) return;
    addBill(name, parseFloat(amount), dueDate);
    setName("");
    setAmount("");
    setDueDate("");
  };

  return (
    <div className="tab-content">
      <h2>Bills</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Bill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Add Bill</button>
      </form>

  <ul>
    {bills.map((bill) => (
      <li key={bill.id}>
        <strong>{bill.name}</strong> - ${bill.amount} (Due {bill.dueDate}){" "}
        {bill.paid ? (
          <span>:white_check_mark: Paid</span>
        ) : (
          <button onClick={() => markBillPaid(bill.id)}>Mark Paid</button>
        )}
      </li>
    ))}
  </ul>
</div>
  );
}