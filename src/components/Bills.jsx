import { useState } from "react";
import { useData } from "../context/DataContext";

export default function Bills() {
  const { bills, addBill, markBillPaid } = useData();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");