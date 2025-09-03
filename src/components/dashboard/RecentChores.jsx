import { useData } from "../../context/DataContext";

export default function RecentChores() {
  const { chores, markChoreComplete } = useData();

  const recent = [...chores].slice(0, 5);

   return (
    <div className="recent-section">
      <h3>Recent Chores</h3>
      <ul>
        {recent.length === 0 && <li>No chores yet</li>}
        {recent.map((chore) => (
          <li key={chore.id}>
            <strong>{chore.name}</strong> — {chore.assignedTo}{" "}
            {chore.completed ? (
              <span>:white_check_mark:</span>
            ) : (
              <button onClick={() => markChoreComplete(chore.id)}>Mark Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}