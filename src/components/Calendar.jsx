import { useEffect, useState } from "react";
import InAppNotification from "./InAppNotification";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/events")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addEvent = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    
    setLoading(true);
    const newEvent = { 
      title: title.trim(), 
      date, 
      time: time || null,
      description: description.trim() || null
    };

    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent)
    })
      .then(res => res.json())
      .then(data => {
        setEvents([...events, data]);
        setTitle("");
        setDate("");
        setTime("");
        setDescription("");
        setLoading(false);
        
        // Show success notification
        setNotification({
          type: 'event',
          title: 'Event Added Successfully!',
          message: `"${data.title}" has been scheduled for ${formatDate(data.date)}`
        });
      })
      .catch(() => {
        setLoading(false);
        setNotification({
          type: 'error',
          title: 'Failed to Add Event',
          message: 'Please try again later'
        });
      });
  };

  const deleteEvent = (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    const eventToDelete = events.find(event => event.id === id);
    
    fetch(`http://localhost:3000/events/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setEvents(events.filter((event) => event.id !== id));
        
        // Show delete notification
        setNotification({
          type: 'delete',
          title: 'Event Deleted',
          message: `"${eventToDelete.title}" has been removed from your calendar`
        });
      })
      .catch(() => {
        setNotification({
          type: 'error',
          title: 'Failed to Delete Event',
          message: 'Please try again later'
        });
      });
  };

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventStatus = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'past';
    if (diffDays === 0) return 'today';
    if (diffDays <= 7) return 'this-week';
    return 'upcoming';
  };

  const getDaysUntilEvent = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Group events by status
  const todayEvents = events.filter(event => getEventStatus(event.date) === 'today');
  const thisWeekEvents = events.filter(event => getEventStatus(event.date) === 'this-week');
  const upcomingEvents = events.filter(event => getEventStatus(event.date) === 'upcoming');
  const pastEvents = events.filter(event => getEventStatus(event.date) === 'past');

  return (
    <div className="calendar-container">
      <InAppNotification 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div>
            <h2>Calendar & Events</h2>
            <p className="header-subtitle">Schedule and track important events</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{todayEvents.length}</span>
            <span className="stat-label">Today</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{thisWeekEvents.length}</span>
            <span className="stat-label">This Week</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{events.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      {/* Add Event Form */}
      <div className="form-section">
        <h3><i className="fas fa-plus-circle"></i> Add New Event</h3>
        <form onSubmit={addEvent} className="event-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventTitle">Event Title</label>
              <input
                id="eventTitle"
                type="text"
                placeholder="e.g., Team Meeting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="eventDate">Date</label>
              <input
                id="eventDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="eventTime">Time (Optional)</label>
              <input
                id="eventTime"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="eventDescription">Description (Optional)</label>
              <textarea
                id="eventDescription"
                placeholder="Add event details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows="3"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <i className="fas fa-plus"></i>
              {loading ? "Adding..." : "Add Event"}
            </button>
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="events-content">
        {loading && events.length === 0 ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-calendar-alt"></i>
            <h3>No events scheduled</h3>
            <p>Add your first event to start organizing your schedule!</p>
          </div>
        ) : (
          <div className="events-grid">
            {/* Today's Events */}
            {todayEvents.length > 0 && (
              <div className="events-section">
                <div className="section-header">
                  <h3><i className="fas fa-star"></i> Today's Events ({todayEvents.length})</h3>
                </div>
                <div className="events-list">
                  {todayEvents
                    .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'))
                    .map((event) => (
                      <div key={event.id} className="event-card today">
                        <div className="event-content">
                          <div className="event-main">
                            <h4 className="event-title">{event.title}</h4>
                            <div className="event-meta">
                              <span className="event-date">
                                <i className="fas fa-calendar"></i>
                                {formatDate(event.date)}
                              </span>
                              {event.time && (
                                <span className="event-time">
                                  <i className="fas fa-clock"></i>
                                  {formatTime(event.time)}
                                </span>
                              )}
                            </div>
                            {event.description && (
                              <p className="event-description">{event.description}</p>
                            )}
                          </div>
                          <div className="event-actions">
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="btn btn-danger btn-sm"
                              title="Delete event"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="event-status">
                          <span className="status-badge today">
                            <i className="fas fa-star"></i>
                            Today
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* This Week's Events */}
            {thisWeekEvents.length > 0 && (
              <div className="events-section">
                <div className="section-header">
                  <h3><i className="fas fa-calendar-week"></i> This Week ({thisWeekEvents.length})</h3>
                </div>
                <div className="events-list">
                  {thisWeekEvents
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((event) => {
                      const daysUntil = getDaysUntilEvent(event.date);
                      return (
                        <div key={event.id} className="event-card this-week">
                          <div className="event-content">
                            <div className="event-main">
                              <h4 className="event-title">{event.title}</h4>
                              <div className="event-meta">
                                <span className="event-date">
                                  <i className="fas fa-calendar"></i>
                                  {formatDate(event.date)}
                                </span>
                                {event.time && (
                                  <span className="event-time">
                                    <i className="fas fa-clock"></i>
                                    {formatTime(event.time)}
                                  </span>
                                )}
                                <span className="days-until">
                                  <i className="fas fa-hourglass-half"></i>
                                  {daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                                </span>
                              </div>
                              {event.description && (
                                <p className="event-description">{event.description}</p>
                              )}
                            </div>
                            <div className="event-actions">
                              <button
                                onClick={() => deleteEvent(event.id)}
                                className="btn btn-danger btn-sm"
                                title="Delete event"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                          <div className="event-status">
                            <span className="status-badge this-week">
                              <i className="fas fa-calendar-week"></i>
                              This Week
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="events-section">
                <div className="section-header">
                  <h3><i className="fas fa-calendar-plus"></i> Upcoming Events ({upcomingEvents.length})</h3>
                </div>
                <div className="events-list">
                  {upcomingEvents
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((event) => {
                      const daysUntil = getDaysUntilEvent(event.date);
                      return (
                        <div key={event.id} className="event-card upcoming">
                          <div className="event-content">
                            <div className="event-main">
                              <h4 className="event-title">{event.title}</h4>
                              <div className="event-meta">
                                <span className="event-date">
                                  <i className="fas fa-calendar"></i>
                                  {formatDate(event.date)}
                                </span>
                                {event.time && (
                                  <span className="event-time">
                                    <i className="fas fa-clock"></i>
                                    {formatTime(event.time)}
                                  </span>
                                )}
                                <span className="days-until">
                                  <i className="fas fa-hourglass-half"></i>
                                  In {daysUntil} days
                                </span>
                              </div>
                              {event.description && (
                                <p className="event-description">{event.description}</p>
                              )}
                            </div>
                            <div className="event-actions">
                              <button
                                onClick={() => deleteEvent(event.id)}
                                className="btn btn-danger btn-sm"
                                title="Delete event"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                          <div className="event-status">
                            <span className="status-badge upcoming">
                              <i className="fas fa-calendar-plus"></i>
                              Upcoming
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div className="events-section">
                <div className="section-header">
                  <h3><i className="fas fa-history"></i> Past Events ({pastEvents.length})</h3>
                </div>
                <div className="events-list">
                  {pastEvents
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10) // Show only last 10 past events
                    .map((event) => (
                      <div key={event.id} className="event-card past">
                        <div className="event-content">
                          <div className="event-main">
                            <h4 className="event-title">{event.title}</h4>
                            <div className="event-meta">
                              <span className="event-date">
                                <i className="fas fa-calendar"></i>
                                {formatDate(event.date)}
                              </span>
                              {event.time && (
                                <span className="event-time">
                                  <i className="fas fa-clock"></i>
                                  {formatTime(event.time)}
                                </span>
                              )}
                            </div>
                            {event.description && (
                              <p className="event-description">{event.description}</p>
                            )}
                          </div>
                          <div className="event-actions">
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="btn btn-danger btn-sm"
                              title="Delete event"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="event-status">
                          <span className="status-badge past">
                            <i className="fas fa-history"></i>
                            Past
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
