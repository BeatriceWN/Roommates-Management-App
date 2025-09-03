import { useState, useEffect } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import Dashboard from "./components/Dashboard";
import Chores from "./components/Chores";
import Bills from "./components/Bills";
import Calendar from "./components/Calendar";
import Roommates from "./components/Roommates";
import notificationService from "./services/NotificationService";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Initialize notification service and start periodic checking
    const initNotifications = async () => {
      await notificationService.requestPermission();
      // Start checking every 15 minutes
      notificationService.startPeriodicCheck(15);
    };

    initNotifications();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <Header />
        <div className="content">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="main-content">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "chores" && <Chores />}
            {activeTab === "bills" && <Bills />}
            {activeTab === "calendar" && <Calendar />}
            {activeTab === "roommates" && <Roommates />}
          </main>
        </div>
      </div>
    </div>
  );
}
