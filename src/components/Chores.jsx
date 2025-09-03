import { useEffect, useState } from "react";
import notificationService from "../services/NotificationService";

function Chores() {
  const [chores, setChores] = useState([]);
  const [name, setName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch chores
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/chores")
      .then((res) => res.json())
      .then((data) => {
        setChores(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Add new chore
  const addChore = (e) => {
    e.preventDefault();
    if (!name.trim() || !assignedTo.trim()) return;
    
    setLoading(true);
    const newChore = { name: name.trim(), assignedTo: assignedTo.trim(), completed: false };

    fetch("http://localhost:3000/chores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChore),
    })
      .then((res) => res.json())
      .then((data) => {
        setChores([...chores, data]);
        setName("");
        setAssignedTo("");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Mark complete
  const toggleComplete = (id, completed) => {
    const chore = chores.find(c => c.id === id);
    
    fetch(`http://localhost:3000/chores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setChores(chores.map((chore) => (chore.id === id ? updated : chore)));
        
        // Trigger notification when chore is completed
        if (!completed && updated.completed) {
          notificationService.choreCompletedNotification(chore.name, chore.assignedTo);
        }
      });
  };

  // Delete chore
  const deleteChore = (id) => {
    if (!window.confirm("Are you sure you want to delete this chore?")) return;
    
    fetch(`http://localhost:3000/chores/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setChores(chores.filter((chore) => chore.id !== id));
      });
  };

  const completedChores = chores.filter(chore => chore.completed);
  const pendingChores = chores.filter(chore => !chore.completed);

  return (
    <div className="chores-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="fas fa-broom"></i>
          </div>
          <div>
            <h2>Household Chores</h2>
            <p className="header-subtitle">Manage and track household tasks</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{pendingChores.length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{completedChores.length}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{chores.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      {/* Add Chore Form */}
      <div className="form-section">
        <h3><i className="fas fa-plus-circle"></i> Add New Chore</h3>
        <form onSubmit={addChore} className="chore-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="choreName">Chore Name</label>
              <input
                id="choreName"
                type="text"
                placeholder="e.g., Clean the kitchen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                id="assignedTo"
                type="text"
                placeholder="e.g., John Doe"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <i className="fas fa-plus"></i>
                {loading ? "Adding..." : "Add Chore"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Chores List */}
      <div className="chores-content">
        {loading && chores.length === 0 ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading chores...</p>
          </div>
        ) : chores.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-broom"></i>
            <h3>No chores yet</h3>
            <p>Add your first chore to get started with household management!</p>
          </div>
        ) : (
          <div className="chores-grid">
            {/* Pending Chores */}
            {pendingChores.length > 0 && (
              <div className="chores-section">
                <div className="section-header">
                  <h3><i className="fas fa-clock"></i> Pending Chores ({pendingChores.length})</h3>
                </div>
                <div className="chores-list">
                  {pendingChores.map((chore) => (
                    <div key={chore.id} className="chore-card pending">
                      <div className="chore-content">
                        <div className="chore-main">
                          <h4 className="chore-name">{chore.name}</h4>
                          <div className="chore-meta">
                            <span className="assigned-to">
                              <i className="fas fa-user"></i>
                              {chore.assignedTo}
                            </span>
                          </div>
                        </div>
                        <div className="chore-actions">
                          <button
                            onClick={() => toggleComplete(chore.id, chore.completed)}
                            className="btn btn-success btn-sm"
                            title="Mark as completed"
                          >
                            <i className="fas fa-check"></i>
                            Complete
                          </button>
                          <button
                            onClick={() => deleteChore(chore.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete chore"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="chore-status">
                        <span className="status-badge pending">
                          <i className="fas fa-clock"></i>
                          Pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Chores */}
            {completedChores.length > 0 && (
              <div className="chores-section">
                <div className="section-header">
                  <h3><i className="fas fa-check-circle"></i> Completed Chores ({completedChores.length})</h3>
                </div>
                <div className="chores-list">
                  {completedChores.map((chore) => (
                    <div key={chore.id} className="chore-card completed">
                      <div className="chore-content">
                        <div className="chore-main">
                          <h4 className="chore-name">{chore.name}</h4>
                          <div className="chore-meta">
                            <span className="assigned-to">
                              <i className="fas fa-user"></i>
                              {chore.assignedTo}
                            </span>
                          </div>
                        </div>
                        <div className="chore-actions">
                          <button
                            onClick={() => toggleComplete(chore.id, chore.completed)}
                            className="btn btn-secondary btn-sm"
                            title="Mark as pending"
                          >
                            <i className="fas fa-undo"></i>
                            Undo
                          </button>
                          <button
                            onClick={() => deleteChore(chore.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete chore"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="chore-status">
                        <span className="status-badge completed">
                          <i className="fas fa-check-circle"></i>
                          Completed
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

export default Chores;
