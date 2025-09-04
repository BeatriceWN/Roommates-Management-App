import SummaryCards from "./dashboard/SummaryCards";
import RecentChores from "./dashboard/RecentChores";
import RecentBills from "./dashboard/RecentBills";
import UpcomingEvents from "./dashboard/UpcomingEvents";
import RoommatesList from "./dashboard/RoommatesList";
import Notifications from "./dashboard/Notifications";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p className="dashboard-subtitle">Keep track of your shared living space</p>
      </div>
      
      <SummaryCards />
      
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <RecentChores />
        </div>
        
        <div className="dashboard-section">
          <RecentBills />
        </div>
        
        <div className="dashboard-section">
          <UpcomingEvents />
        </div>
        
        <div className="dashboard-section">
          <Notifications />
        </div>
      </div>
      
      <div className="dashboard-footer">
        <RoommatesList />
      </div>
    </div>
  );
}
