import { useData } from "../../context/DataContext";

export default function RoommatesList() {
  const { roommates } = useData();

  return (
    <div className="recent-section">
      <h3>
        <i className="fas fa-users"></i>
        Roommates
      </h3>
      <div className="roommate-grid">
        {roommates.length === 0 && (
          <div className="roommate-card">
            <div className="user-avatar">
              <i className="fas fa-user-plus"></i>
            </div>
            <h3>Add Roommates</h3>
            <p className="text-muted">No roommates added yet</p>
          </div>
        )}
        {roommates.map((roommate) => (
          <div key={roommate.id} className="roommate-card">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <h3>{roommate.name}</h3>
            <p className="text-muted">{roommate.email}</p>
            <div className="roommate-stats">
              <div className="stat">
                <i className="fas fa-tasks"></i>
                <span>Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
