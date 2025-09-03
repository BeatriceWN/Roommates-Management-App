import { useData } from "../../context/DataContext";

export default function UpcomingEvents() {
  const { events } = useData();

  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="recent-section">
      <h3>Upcoming Events</h3>
      <ul>
        {upcoming.length === 0 && <li>No events</li>}
        {upcoming.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong> — {new Date(event.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}