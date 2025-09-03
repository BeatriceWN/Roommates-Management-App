import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export function DataProvider({ children }) {
  const [chores, setChores] = useState(() => JSON.parse(localStorage.getItem("chores")) || []);
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem("bills")) || []);
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem("events")) || []);
  const [roommates, setRoommates] = useState(() =>
    JSON.parse(localStorage.getItem("roommates")) || [
      { id: crypto.randomUUID(), name: "John", email: "john@example.com", phone: "123-456-7890" },
      { id: crypto.randomUUID(), name: "Jane", email: "jane@example.com", phone: "098-765-4321" }
    ]
  ); 
  // Persist changes
  useEffect(() => localStorage.setItem("chores", JSON.stringify(chores)), [chores]);
  useEffect(() => localStorage.setItem("bills", JSON.stringify(bills)), [bills]);
  useEffect(() => localStorage.setItem("events", JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem("roommates", JSON.stringify(roommates)), [roommates]);
   // CRUD functions