export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-main">
          <div className="header-icon">
            <i className="fas fa-home"></i>
          </div>
          <div className="header-text">
            <h1>Roommate Manager</h1>
            <p className="description">
              Simplify shared living with chore tracking, bill splitting, and more
            </p>
          </div>
        </div>
        <div className="header-actions">
          <div className="user-profile">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <span className="user-name">Welcome back!</span>
          </div>
        </div>
      </div>
    </header>
  );
}
