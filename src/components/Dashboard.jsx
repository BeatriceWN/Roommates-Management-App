import { useData } from "../context/DataContext";

export default function Dashboard() {
  const { chores, bills, events, roommates, markChoreComplete, markBillPaid } = useData();

  const completedChores = chores.filter(c => c.completed).length;
  const pendingBills = bills.filter(b => !b.paid).length;
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;

  return (
    <div className="tab-content">
      <h2>Dashboard</h2>
      <div className="stats">
        <p>Chores: {completedChores}/{chores.length}</p>
        <p>Bills Pending: {pendingBills}</p>
        <p>Roommates: {roommates.length}</p>
        <p>Upcoming Events: {upcomingEvents}</p>
      </div>

  
    ))}
  </ul>
</div>
  );
}

