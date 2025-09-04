import { useData } from "../../context/DataContext";

export default function RecentBills() {
  const { bills, markBillPaid } = useData();

  const recent = [...bills].slice(0, 5);

  return (
    <div className="recent-section">
      <h3>
        <i className="fas fa-money-bill-wave"></i>
        Recent Bills
      </h3>
      <ul>
        {recent.length === 0 && (
          <li className="bill-item">
            <div className="item-content">
              <span className="text-muted">No bills yet</span>
            </div>
          </li>
        )}
        {recent.map((bill) => (
          <li key={bill.id} className="bill-item">
            <div className="item-content">
              <div className="item-main">
                <strong>{bill.name}</strong>
                <div className="text-muted">
                  <i className="fas fa-dollar-sign"></i> ${bill.amount} • Due {bill.dueDate}
                </div>
              </div>
              <div className="item-actions">
                {bill.paid ? (
                  <span className="status-badge paid">
                    <i className="fas fa-check-circle"></i> Paid
                  </span>
                ) : (
                  <button 
                    className="btn btn-sm btn-warning" 
                    onClick={() => markBillPaid(bill.id)}
                  >
                    <i className="fas fa-credit-card"></i> Mark Paid
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
