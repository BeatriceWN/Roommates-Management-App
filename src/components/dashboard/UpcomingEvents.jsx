import { useData } from "../../context/DataContext";

export default function UpcomingEvents() {
  const { events } = useData();

  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  return (
    <div className="recent-section">
      <h3>
        <i className="fas fa-calendar-alt"></i>
        Upcoming Events
      </h3>
      <ul>
        {upcoming.length === 0 && (
          <li className="event-item">
            <div className="item-content">
              <span className="text-muted">No upcoming events</span>
            </div>
          </li>
        )}
        {upcoming.map((event) => (
          <li key={event.id} className="event-item">
            <div className="item-content">
              <div className="item-main">
                <strong>{event.title}</strong>
                <div className="text-muted">
                  <i className="fas fa-clock"></i> {formatDate(event.date)}
                </div>
              </div>
              <div className="item-actions">
                <span className="status-badge upcoming">
                  <i className="fas fa-calendar-check"></i> Scheduled
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
