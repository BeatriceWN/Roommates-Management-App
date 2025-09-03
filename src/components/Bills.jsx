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