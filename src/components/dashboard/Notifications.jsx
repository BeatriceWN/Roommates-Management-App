import { useEffect, useState } from "react";

export default function Notifications() {
  const [chores, setChores] = useState([]);
  const [bills, setBills] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [choresRes, billsRes, eventsRes] = await Promise.all([
          fetch("http://localhost:3000/chores"),
          fetch("http://localhost:3000/bills"),
          fetch("http://localhost:3000/events")
        ]);

        const [choresData, billsData, eventsData] = await Promise.all([
          choresRes.json(),
          billsRes.json(),
          eventsRes.json()
        ]);

        setChores(choresData);
        setBills(billsData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching notification data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const threeDaysStr = threeDaysFromNow.toISOString().split("T")[0];

  const dueBills = bills.filter(
    (b) => !b.paid && b.dueDate <= today
  );
  const pendingChores = chores.filter((c) => !c.completed);
  const todayEvents = events.filter((e) => e.date === today);
  const upcomingEvents = events.filter((e) => e.date > today && e.date <= threeDaysStr);

  const hasNotifications = dueBills.length > 0 || pendingChores.length > 0 || todayEvents.length > 0 || upcomingEvents.length > 0;

  if (loading) {
    return (
      <div className="notifications">
        <h3>
          <i className="fas fa-bell"></i>
          Notifications
        </h3>
        <div className="notification-list">
          <div className="notification-item">
            <div className="notification-icon">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <div className="notification-content">
              <strong>Loading...</strong>
              <p>Fetching notifications</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications">
      <h3>
        <i className="fas fa-bell"></i>
        Notifications
        {hasNotifications && (
          <span className="notification-count">{dueBills.length + pendingChores.length + todayEvents.length}</span>
        )}
      </h3>
      <div className="notification-list">
        {dueBills.map((b) => (
          <div key={`bill-${b.id}`} className="notification-item urgent">
            <div className="notification-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="notification-content">
              <strong>Bill Overdue</strong>
              <p>{b.name} - ${b.amount} was due {new Date(b.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        
        {pendingChores.slice(0, 3).map((c) => (
          <div key={`chore-${c.id}`} className="notification-item info">
            <div className="notification-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="notification-content">
              <strong>Pending Chore</strong>
              <p>{c.name} assigned to {c.assignedTo}</p>
            </div>
          </div>
        ))}
        
        {todayEvents.map((e) => (
          <div key={`event-${e.id}`} className="notification-item success">
            <div className="notification-icon">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="notification-content">
              <strong>Event Today</strong>
              <p>{e.title}</p>
            </div>
          </div>
        ))}
        
        {!hasNotifications && (
          <div className="notification-item">
            <div className="notification-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="notification-content">
              <strong>All caught up!</strong>
              <p>No pending notifications</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
