import { useData } from "../../context/DataContext";

export default function RecentChores() {
  const { chores, markChoreComplete } = useData();

  const recent = [...chores].slice(0, 5);

  return (
    <div className="recent-section">
      <h3>
        <i className="fas fa-tasks"></i>
        Recent Chores
      </h3>
      <ul>
        {recent.length === 0 && (
          <li className="chore-item">
            <div className="item-content">
              <span className="text-muted">No chores yet</span>
            </div>
          </li>
        )}
        {recent.map((chore) => (
          <li key={chore.id} className="chore-item">
            <div className="item-content">
              <div className="item-main">
                <strong>{chore.name}</strong>
                <div className="text-muted">
                  <i className="fas fa-user"></i> {chore.assignedTo}
                </div>
              </div>
              <div className="item-actions">
                {chore.completed ? (
                  <span className="status-badge completed">
                    <i className="fas fa-check"></i> Complete
                  </span>
                ) : (
                  <button 
                    className="btn btn-sm btn-success" 
                    onClick={() => markChoreComplete(chore.id)}
                  >
                    <i className="fas fa-check"></i> Mark Complete
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
