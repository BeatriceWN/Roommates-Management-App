export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { name: "dashboard", icon: "fa-home", label: "Dashboard" },
    { name: "chores", icon: "fa-tasks", label: "Chores" },
    { name: "bills", icon: "fa-money-bill", label: "Bills" },
    { name: "calendar", icon: "fa-calendar", label: "Calendar" },
    { name: "roommates", icon: "fa-users", label: "Roommates" },
  ];

  return (
    <div className="tab-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={tab-btn ${activeTab === tab.name ? "active" : ""}}
          onClick={() => setActiveTab(tab.name)}
        >
          <i className={fas ${tab.icon}}></i> {tab.label}
        </button>
      ))}
    </div>
  );
}

