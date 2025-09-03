import { useEffect, useState } from "react";
import notificationService from "../services/NotificationService";

function Roommates() {
  const [roommates, setRoommates] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [room, setRoom] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/roommates")
      .then(res => res.json())
      .then(data => {
        setRoommates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addRoommate = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    
    setLoading(true);
    const newRoommate = { 
      name: name.trim(), 
      email: email.trim(), 
      phone: phone.trim(),
      room: room.trim() || null,
      moveInDate: moveInDate || null,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    fetch("http://localhost:3000/roommates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoommate)
    })
      .then(res => res.json())
      .then(data => {
        setRoommates([...roommates, data]);
        
        // Trigger notification for new roommate
        notificationService.newRoommateNotification(data.name);
        
        setName("");
        setEmail("");
        setPhone("");
        setRoom("");
        setMoveInDate("");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const deleteRoommate = (id) => {
    if (!window.confirm("Are you sure you want to remove this roommate?")) return;
    
    fetch(`http://localhost:3000/roommates/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setRoommates(roommates.filter((roommate) => roommate.id !== id));
      });
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #43e97b, #38f9d7)',
      'linear-gradient(135deg, #fa709a, #fee140)',
      'linear-gradient(135deg, #a8edea, #fed6e3)',
      'linear-gradient(135deg, #ff9a9e, #fecfef)',
      'linear-gradient(135deg, #ffecd2, #fcb69f)'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getDaysLiving = (joinedDate) => {
    if (!joinedDate) return null;
    const today = new Date();
    const joined = new Date(joinedDate);
    const diffTime = today - joined;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="roommates-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <h2>Roommates</h2>
            <p className="header-subtitle">Manage household members and contacts</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{roommates.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{roommates.filter(r => r.room).length}</span>
            <span className="stat-label">With Rooms</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{roommates.filter(r => r.moveInDate).length}</span>
            <span className="stat-label">Move-in Set</span>
          </div>
        </div>
      </div>

      {/* Add Roommate Form */}
      <div className="form-section">
        <h3><i className="fas fa-user-plus"></i> Add New Roommate</h3>
        <form onSubmit={addRoommate} className="roommate-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roommateName">Full Name</label>
              <input
                id="roommateName"
                type="text"
                placeholder="e.g., John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="roommateEmail">Email Address</label>
              <input
                id="roommateEmail"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="roommatePhone">Phone Number</label>
              <input
                id="roommatePhone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roommateRoom">Room (Optional)</label>
              <input
                id="roommateRoom"
                type="text"
                placeholder="e.g., Room A, Master Bedroom"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="moveInDate">Move-in Date (Optional)</label>
              <input
                id="moveInDate"
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <i className="fas fa-user-plus"></i>
                {loading ? "Adding..." : "Add Roommate"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Roommates List */}
      <div className="roommates-content">
        {loading && roommates.length === 0 ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading roommates...</p>
          </div>
        ) : roommates.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-users"></i>
            <h3>No roommates yet</h3>
            <p>Add your first roommate to start building your household directory!</p>
          </div>
        ) : (
          <div className="roommates-grid">
            {roommates.map((roommate) => {
              const daysLiving = getDaysLiving(roommate.joinedDate);
              return (
                <div key={roommate.id} className="roommate-card">
                  <div className="roommate-header">
                    <div 
                      className="roommate-avatar"
                      style={{ background: getAvatarColor(roommate.name) }}
                    >
                      {getInitials(roommate.name)}
                    </div>
                    <div className="roommate-actions">
                      <button
                        onClick={() => deleteRoommate(roommate.id)}
                        className="btn btn-danger btn-sm"
                        title="Remove roommate"
                      >
                        <i className="fas fa-user-minus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="roommate-info">
                    <h4 className="roommate-name">{roommate.name}</h4>
                    {roommate.room && (
                      <div className="roommate-room">
                        <i className="fas fa-door-open"></i>
                        {roommate.room}
                      </div>
                    )}
                  </div>

                  <div className="roommate-contact">
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <a href={`mailto:${roommate.email}`} className="contact-link">
                        {roommate.email}
                      </a>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <a href={`tel:${roommate.phone}`} className="contact-link">
                        {roommate.phone}
                      </a>
                    </div>
                  </div>

                  <div className="roommate-details">
                    {roommate.moveInDate && (
                      <div className="detail-item">
                        <span className="detail-label">Move-in Date:</span>
                        <span className="detail-value">{formatDate(roommate.moveInDate)}</span>
                      </div>
                    )}
                    {roommate.joinedDate && daysLiving !== null && (
                      <div className="detail-item">
                        <span className="detail-label">Living here:</span>
                        <span className="detail-value">
                          {daysLiving === 0 ? 'Just joined!' : 
                           daysLiving === 1 ? '1 day' : 
                           daysLiving < 30 ? `${daysLiving} days` :
                           daysLiving < 365 ? `${Math.floor(daysLiving / 30)} months` :
                           `${Math.floor(daysLiving / 365)} years`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="roommate-footer">
                    <div className="quick-actions">
                      <a 
                        href={`mailto:${roommate.email}`} 
                        className="btn btn-sm btn-secondary"
                        title="Send email"
                      >
                        <i className="fas fa-envelope"></i>
                        Email
                      </a>
                      <a 
                        href={`tel:${roommate.phone}`} 
                        className="btn btn-sm btn-secondary"
                        title="Call"
                      >
                        <i className="fas fa-phone"></i>
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Roommates;
