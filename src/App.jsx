import { useState } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import Dashboard from "./components/Dashboard";
import Chores from "./components/Chores";
import Bills from "./components/Bills";
import Calendar from "./components/Calendar";
import Roommates from "./components/Roommates";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container">
      <Header />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "chores" && <Chores />}
      {activeTab === "bills" && <Bills />}
      {activeTab === "calendar" && <Calendar />}
      {activeTab === "roommates" && <Roommates />}
    </div>
  );
}