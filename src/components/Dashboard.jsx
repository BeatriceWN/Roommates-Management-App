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



<h3>Recent Chores</h3>
  <ul>
    {chores.slice(0, 5).map(chore => (
      <li key={chore.id}>
        <strong>{chore.name}</strong> - {chore.assignedTo}
        {!chore.completed && (
          <button onClick={() => markChoreComplete(chore.id)}>Mark Complete</button>
        )}
      </li>
    ))}
  </ul>

  <h3>Upcoming Bills</h3>
  <ul>
    {bills.slice(0, 5).map(bill => (
      <li key={bill.id}>
        <strong>{bill.name}</strong> - ${bill.amount} (Due {bill.dueDate})
        {!bill.paid && (
          <button onClick={() => markBillPaid(bill.id)}>Mark Paid</button>
        )}
      </li>
  
    ))}
  </ul>
</div>
  );
}

