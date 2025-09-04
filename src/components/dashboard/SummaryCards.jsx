import { useState, useEffect } from "react";

export default function SummaryCards() {
  const [chores, setChores] = useState([]);
  const [bills, setBills] = useState([]);
  const [events, setEvents] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [choresRes, billsRes, eventsRes, roommatesRes] = await Promise.all([
          fetch("http://localhost:3000/chores"),
          fetch("http://localhost:3000/bills"),
          fetch("http://localhost:3000/events"),
          fetch("http://localhost:3000/roommates")
        ]);

        const [choresData, billsData, eventsData, roommatesData] = await Promise.all([
          choresRes.json(),
          billsRes.json(),
          eventsRes.json(),
          roommatesRes.json()
        ]);

        setChores(choresData);
        setBills(billsData);
        setEvents(eventsData);
        setRoommates(roommatesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="summary-cards">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="summary-card loading">
            <div className="card-icon">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <div className="card-content">
              <h3>Loading...</h3>
              <div className="number">--</div>
              <p className="text-muted">Fetching data</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() + 7);
  const thisWeekStr = thisWeek.toISOString().split("T")[0];

  // Chore statistics
  const totalChores = chores.length;
  const completedChores = chores.filter((c) => c.completed).length;
  const choreProgress = totalChores > 0 ? Math.round((completedChores / totalChores) * 100) : 0;

  // Bill statistics
  const totalBills = bills.length;
  const paidBills = bills.filter((b) => b.paid).length;
  const pendingBills = bills.filter((b) => !b.paid).length;
  const overdueBills = bills.filter((b) => !b.paid && b.dueDate < today).length;
  const billsProgress = totalBills > 0 ? Math.round((paidBills / totalBills) * 100) : 0;

  // Total amount statistics
  const totalBillAmount = bills.reduce((sum, bill) => sum + Number(bill.amount), 0);
  const paidAmount = bills.filter(b => b.paid).reduce((sum, bill) => sum + Number(bill.amount), 0);
  const pendingAmount = bills.filter(b => !b.paid).reduce((sum, bill) => sum + Number(bill.amount), 0);

  // Event statistics
  const totalEvents = events.length;
  const todayEvents = events.filter((e) => e.date === today).length;
  const thisWeekEvents = events.filter((e) => e.date >= today && e.date <= thisWeekStr).length;
  const upcomingEvents = events.filter((e) => e.date >= today).length;

  // Roommate statistics
  const totalRoommates = roommates.length;

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="card-icon">
          <i className="fas fa-tasks"></i>
        </div>
        <div className="card-content">
          <h3>Chores Progress</h3>
          <div className="number">{completedChores}/{totalChores}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${choreProgress}%` }}></div>
          </div>
          <p className="text-muted">{choreProgress}% Complete</p>
          <div className="card-stats">
            <span className="stat-item">
              <i className="fas fa-check-circle text-success"></i>
              {completedChores} Done
            </span>
            <span className="stat-item">
              <i className="fas fa-clock text-warning"></i>
              {totalChores - completedChores} Pending
            </span>
          </div>
        </div>
      </div>

      <div className="summary-card">
        <div className="card-icon bills">
          <i className="fas fa-money-bill-wave"></i>
        </div>
        <div className="card-content">
          <h3>Bills Overview</h3>
          <div className="number">${pendingAmount.toFixed(2)}</div>
          <div className="progress-bar">
            <div className="progress-fill bills-progress" style={{ width: `${billsProgress}%` }}></div>
          </div>
          <p className="text-muted">{billsProgress}% Paid ({paidBills}/{totalBills})</p>
          <div className="card-stats">
            <span className="stat-item">
              <i className="fas fa-exclamation-triangle text-danger"></i>
              {overdueBills} Overdue
            </span>
            <span className="stat-item">
              <i className="fas fa-clock text-warning"></i>
              {pendingBills} Pending
            </span>
          </div>
        </div>
      </div>

      <div className="summary-card">
        <div className="card-icon roommates">
          <i className="fas fa-users"></i>
        </div>
        <div className="card-content">
          <h3>Roommates</h3>
          <div className="number">{totalRoommates}</div>
          <p className="text-muted">Active members</p>
          <div className="card-stats">
            <span className="stat-item">
              <i className="fas fa-home text-primary"></i>
              Living together
            </span>
            {totalRoommates > 0 && (
              <span className="stat-item">
                <i className="fas fa-dollar-sign text-success"></i>
                ${(totalBillAmount / totalRoommates).toFixed(0)} avg/person
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="summary-card">
        <div className="card-icon events">
          <i className="fas fa-calendar-alt"></i>
        </div>
        <div className="card-content">
          <h3>Events</h3>
          <div className="number">{upcomingEvents}</div>
          <p className="text-muted">Upcoming events</p>
          <div className="card-stats">
            <span className="stat-item">
              <i className="fas fa-calendar-day text-danger"></i>
              {todayEvents} Today
            </span>
            <span className="stat-item">
              <i className="fas fa-calendar-week text-info"></i>
              {thisWeekEvents} This week
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
