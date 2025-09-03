import { useEffect, useState } from 'react';

function InAppNotification({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      case 'event': return 'fas fa-calendar-plus';
      case 'delete': return 'fas fa-trash';
      default: return 'fas fa-bell';
    }
  };

  return (
    <div className={`in-app-notification ${notification.type} ${isVisible ? 'show' : ''}`}>
      <div className="notification-content">
        <div className="notification-icon">
          <i className={getNotificationIcon(notification.type)}></i>
        </div>
        <div className="notification-text">
          <div className="notification-title">{notification.title}</div>
          {notification.message && (
            <div className="notification-message">{notification.message}</div>
          )}
        </div>
        <button 
          className="notification-close"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}

export default InAppNotification;
