import { useData } from "../../context/DataContext";

export default function Notifications() {
  const { chores, bills, events } = useData();

  const today = new Date().toISOString().split("T")[0];

  const dueBills = bills.filter(
    (b) => !b.paid && b.dueDate <= today
  );
  const pendingChores = chores.filter((c) => !c.completed);
  const todayEvents = events.filter((e) => e.date === today);

  return (
    <div className="recent-section">
      <h3>Notifications</h3>
      <ul>
        {dueBills.map((b) => (
          <li key={b.id}>:warning: Bill due: {b.name} (${b.amount})</li>
        ))}
        {pendingChores.map((c) => (
          <li key={c.id}>:broom: Pending chore: {c.name}</li>
        
      </ul>
    </div>
  );
}