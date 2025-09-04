import { useEffect, useState } from "react";
import notificationService from "../services/NotificationService";
import InAppNotification from "./InAppNotification";

function Bills() {
  const [bills, setBills] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [splitBill, setSplitBill] = useState(false);
  const [selectedRoommates, setSelectedRoommates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:3000/bills"),
      fetch("http://localhost:3000/roommates")
    ])
      .then(([billsRes, roommatesRes]) => Promise.all([billsRes.json(), roommatesRes.json()]))
      .then(([billsData, roommatesData]) => {
        setBills(billsData);
        setRoommates(roommatesData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addBill = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount || !dueDate) return;
    
    setLoading(true);
    
    if (splitBill && selectedRoommates.length > 0) {
      // Create split bills
      const splitAmount = Number(amount) / selectedRoommates.length;
      const billPromises = selectedRoommates.map(roommateId => {
        const roommate = roommates.find(r => r.id == roommateId); // Use == for flexible comparison
        if (!roommate) {
          console.error(`Roommate with id ${roommateId} not found`);
          return Promise.reject(`Roommate not found`);
        }
        
        const splitBillData = {
          name: `${name.trim()} (${roommate.name}'s share)`,
          amount: parseFloat(splitAmount.toFixed(2)), // Round to 2 decimal places
          dueDate,
          paid: false,
          originalBill: name.trim(),
          assignedTo: roommate.name,
          splitBill: true
        };
        
        return fetch("http://localhost:3000/bills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(splitBillData)
        }).then(res => res.json());
      });
      
      Promise.all(billPromises)
        .then(newBills => {
          setBills([...bills, ...newBills]);
          setName("");
          setAmount("");
          setDueDate("");
          setSplitBill(false);
          setSelectedRoommates([]);
          setLoading(false);
          
          // Show success notification
          setNotification({
            type: 'success',
            title: 'Bill Split Successfully!',
            message: `${name.trim()} has been split among ${selectedRoommates.length} roommates (${formatCurrency(splitAmount)} each)`
          });
        })
        .catch((error) => {
          console.error('Error splitting bill:', error);
          setLoading(false);
          setNotification({
            type: 'error',
            title: 'Failed to Split Bill',
            message: 'Please try again later'
          });
        });
    } else {
      // Create regular bill
      const newBill = { 
        name: name.trim(), 
        amount: Number(amount), 
        dueDate, 
        paid: false,
        splitBill: false
      };

      fetch("http://localhost:3000/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBill)
      })
        .then(res => res.json())
        .then(data => {
          setBills([...bills, data]);
          setName("");
          setAmount("");
          setDueDate("");
          setLoading(false);
          
          // Show success notification
          setNotification({
            type: 'success',
            title: 'Bill Added Successfully!',
            message: `${data.name} (${formatCurrency(data.amount)}) has been added`
          });
        })
        .catch(() => {
          setLoading(false);
          setNotification({
            type: 'error',
            title: 'Failed to Add Bill',
            message: 'Please try again later'
          });
        });
    }
  };

  const handleRoommateToggle = (roommateId) => {
    // Convert to string for consistent comparison
    const idStr = String(roommateId);
    setSelectedRoommates(prev => 
      prev.includes(idStr) 
        ? prev.filter(id => id !== idStr)
        : [...prev, idStr]
    );
  };

  const calculateSplitAmount = () => {
    if (!amount || selectedRoommates.length === 0) return 0;
    return Number(amount) / selectedRoommates.length;
  };

  const markPaid = (id, paid) => {
    const bill = bills.find(b => b.id === id);
    
    fetch(`http://localhost:3000/bills/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid: !paid })
    })
      .then(res => res.json())
      .then(updated => {
        setBills(bills.map(bill => (bill.id === id ? updated : bill)));
        
        // Trigger notification when bill is marked as paid
        if (!paid && updated.paid) {
          const paidBy = bill.assignedTo || "Someone";
          notificationService.billPaidNotification(bill.name, bill.amount, paidBy);
        }
      });
  };

  const deleteBill = (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    
    fetch(`http://localhost:3000/bills/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setBills(bills.filter((bill) => bill.id !== id));
      });
  };

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBillStatus = (bill) => {
    if (bill.paid) return 'paid';
    const daysUntilDue = getDaysUntilDue(bill.dueDate);
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'due-soon';
    return 'upcoming';
  };

  const paidBills = bills.filter(bill => bill.paid);
  const unpaidBills = bills.filter(bill => !bill.paid);
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = paidBills.reduce((sum, bill) => sum + bill.amount, 0);
  const unpaidAmount = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="bills-container">
      <InAppNotification 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div>
            <h2>Bills & Expenses</h2>
            <p className="header-subtitle">Track and manage household bills</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{formatCurrency(unpaidAmount)}</span>
            <span className="stat-label">Unpaid</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{formatCurrency(paidAmount)}</span>
            <span className="stat-label">Paid</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{formatCurrency(totalAmount)}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      {/* Add Bill Form */}
      <div className="form-section">
        <h3><i className="fas fa-plus-circle"></i> Add New Bill</h3>
        <form onSubmit={addBill} className="bill-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="billName">Bill Name</label>
              <input
                id="billName"
                type="text"
                placeholder="e.g., Electricity Bill"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="billAmount">Amount ($)</label>
              <input
                id="billAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Bill Splitting Section */}
          <div className="bill-split-section">
            <div className="split-toggle">
              <label className="split-checkbox">
                <input
                  type="checkbox"
                  checked={splitBill}
                  onChange={(e) => {
                    setSplitBill(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedRoommates([]);
                    }
                  }}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                <span className="split-label">
                  <i className="fas fa-users"></i>
                  Split this bill among roommates
                </span>
              </label>
            </div>

            {splitBill && (
              <div className="split-options">
                <div className="roommates-selection">
                  <h4>Select Roommates to Split With:</h4>
                  <div className="roommates-grid">
                    {roommates.map(roommate => (
                      <label key={roommate.id} className="roommate-option">
                        <input
                          type="checkbox"
                          checked={selectedRoommates.includes(String(roommate.id))}
                          onChange={() => handleRoommateToggle(roommate.id)}
                          disabled={loading}
                        />
                        <span className="roommate-card-mini">
                          <span className="roommate-avatar-mini">
                            {roommate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                          <span className="roommate-name-mini">{roommate.name}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedRoommates.length > 0 && (
                  <div className="split-summary">
                    <div className="split-info">
                      <div className="split-detail">
                        <span className="split-label">Total Amount:</span>
                        <span className="split-value">{formatCurrency(Number(amount) || 0)}</span>
                      </div>
                      <div className="split-detail">
                        <span className="split-label">Split {selectedRoommates.length} ways:</span>
                        <span className="split-value">{formatCurrency(calculateSplitAmount())}</span>
                      </div>
                      <div className="split-detail">
                        <span className="split-label">Per person:</span>
                        <span className="split-value highlight">{formatCurrency(calculateSplitAmount())}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading || (splitBill && selectedRoommates.length === 0)}>
              <i className="fas fa-plus"></i>
              {loading ? "Adding..." : splitBill ? `Split Bill (${selectedRoommates.length} people)` : "Add Bill"}
            </button>
          </div>
        </form>
      </div>

      {/* Bills List */}
      <div className="bills-content">
        {loading && bills.length === 0 ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading bills...</p>
          </div>
        ) : bills.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-file-invoice-dollar"></i>
            <h3>No bills yet</h3>
            <p>Add your first bill to start tracking expenses!</p>
          </div>
        ) : (
          <div className="bills-grid">
            {/* Unpaid Bills */}
            {unpaidBills.length > 0 && (
              <div className="bills-section">
                <div className="section-header">
                  <h3><i className="fas fa-exclamation-circle"></i> Unpaid Bills ({unpaidBills.length})</h3>
                  <div className="section-total">
                    Total: {formatCurrency(unpaidAmount)}
                  </div>
                </div>
                <div className="bills-list">
                  {unpaidBills
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .map((bill) => {
                      const status = getBillStatus(bill);
                      const daysUntilDue = getDaysUntilDue(bill.dueDate);
                      
                      return (
                        <div key={bill.id} className={`bill-card ${status} ${bill.splitBill ? 'split-bill' : ''}`}>
                          <div className="bill-content">
                            <div className="bill-main">
                              <h4 className="bill-name">
                                {bill.name}
                                {bill.splitBill && <span className="split-indicator">👥</span>}
                              </h4>
                              <div className="bill-amount">{formatCurrency(bill.amount)}</div>
                              {bill.assignedTo && (
                                <div className="bill-assigned-to">
                                  <i className="fas fa-user"></i>
                                  Assigned to: {bill.assignedTo}
                                </div>
                              )}
                              <div className="bill-meta">
                                <span className="due-date">
                                  <i className="fas fa-calendar"></i>
                                  Due: {formatDate(bill.dueDate)}
                                </span>
                                {daysUntilDue >= 0 && (
                                  <span className="days-until">
                                    <i className="fas fa-clock"></i>
                                    {daysUntilDue === 0 ? 'Due today' : 
                                     daysUntilDue === 1 ? 'Due tomorrow' : 
                                     `${daysUntilDue} days left`}
                                  </span>
                                )}
                                {daysUntilDue < 0 && (
                                  <span className="overdue-days">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    {Math.abs(daysUntilDue)} days overdue
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="bill-actions">
                              <button
                                onClick={() => markPaid(bill.id, bill.paid)}
                                className="btn btn-success btn-sm"
                                title="Mark as paid"
                              >
                                <i className="fas fa-check"></i>
                                Mark Paid
                              </button>
                              <button
                                onClick={() => deleteBill(bill.id)}
                                className="btn btn-danger btn-sm"
                                title="Delete bill"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                          <div className="bill-status">
                            <span className={`status-badge ${status}`}>
                              {status === 'overdue' && <i className="fas fa-exclamation-triangle"></i>}
                              {status === 'due-soon' && <i className="fas fa-clock"></i>}
                              {status === 'upcoming' && <i className="fas fa-calendar-check"></i>}
                              {status === 'overdue' ? 'Overdue' : 
                               status === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Paid Bills */}
            {paidBills.length > 0 && (
              <div className="bills-section">
                <div className="section-header">
                  <h3><i className="fas fa-check-circle"></i> Paid Bills ({paidBills.length})</h3>
                  <div className="section-total">
                    Total: {formatCurrency(paidAmount)}
                  </div>
                </div>
                <div className="bills-list">
                  {paidBills
                    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
                    .map((bill) => (
                      <div key={bill.id} className="bill-card paid">
                        <div className="bill-content">
                          <div className="bill-main">
                            <h4 className="bill-name">{bill.name}</h4>
                            <div className="bill-amount">{formatCurrency(bill.amount)}</div>
                            <div className="bill-meta">
                              <span className="due-date">
                                <i className="fas fa-calendar"></i>
                                Due: {formatDate(bill.dueDate)}
                              </span>
                            </div>
                          </div>
                          <div className="bill-actions">
                            <button
                              onClick={() => markPaid(bill.id, bill.paid)}
                              className="btn btn-secondary btn-sm"
                              title="Mark as unpaid"
                            >
                              <i className="fas fa-undo"></i>
                              Undo
                            </button>
                            <button
                              onClick={() => deleteBill(bill.id)}
                              className="btn btn-danger btn-sm"
                              title="Delete bill"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="bill-status">
                          <span className="status-badge paid">
                            <i className="fas fa-check-circle"></i>
                            Paid
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

export default Bills;
