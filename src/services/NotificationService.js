class NotificationService {
  constructor() {
    this.permission = null;
    this.init();
  }

  async init() {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notifications");
      return;
    }

    // Request permission if not already granted
    if (Notification.permission === "default") {
      this.permission = await Notification.requestPermission();
    } else {
      this.permission = Notification.permission;
    }
  }

  async requestPermission() {
    if (!("Notification" in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === "granted";
  }

  showNotification(title, options = {}) {
    if (this.permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    const defaultOptions = {
      icon: "/vite.svg",
      badge: "/vite.svg",
      requireInteraction: false,
      silent: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto close after 5 seconds unless requireInteraction is true
      if (!defaultOptions.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }

  // Specific notification types
  billDueNotification(billName, amount, dueDate) {
    this.showNotification(`💰 Bill Due: ${billName}`, {
      body: `$${amount} is due on ${new Date(dueDate).toLocaleDateString()}`,
      tag: `bill-due-${billName}`,
      requireInteraction: true
    });
  }

  billPaidNotification(billName, amount, paidBy) {
    this.showNotification(`✅ Bill Paid: ${billName}`, {
      body: `$${amount} was paid by ${paidBy}`,
      tag: `bill-paid-${billName}`
    });
  }

  choreCompletedNotification(choreName, completedBy) {
    this.showNotification(`🎉 Chore Completed: ${choreName}`, {
      body: `Completed by ${completedBy}`,
      tag: `chore-completed-${choreName}`
    });
  }

  choreOverdueNotification(choreName, assignedTo) {
    this.showNotification(`⚠️ Chore Overdue: ${choreName}`, {
      body: `Assigned to ${assignedTo} - Please complete soon!`,
      tag: `chore-overdue-${choreName}`,
      requireInteraction: true
    });
  }

  eventTodayNotification(eventTitle, time) {
    this.showNotification(`📅 Event Today: ${eventTitle}`, {
      body: time ? `Scheduled for ${time}` : "Don't forget!",
      tag: `event-today-${eventTitle}`
    });
  }

  eventUpcomingNotification(eventTitle, date, time) {
    const eventDate = new Date(date);
    const today = new Date();
    const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
    let timeText = "";
    if (daysUntil === 1) {
      timeText = "tomorrow";
    } else {
      timeText = `in ${daysUntil} days`;
    }

    this.showNotification(`📅 Upcoming Event: ${eventTitle}`, {
      body: `${timeText}${time ? ` at ${time}` : ""}`,
      tag: `event-upcoming-${eventTitle}`
    });
  }

  newRoommateNotification(roommateName) {
    this.showNotification(`👋 New Roommate: ${roommateName}`, {
      body: "Welcome to the house!",
      tag: `new-roommate-${roommateName}`
    });
  }

  // Check for due items and send notifications
  async checkAndNotify() {
    try {
      const [choresRes, billsRes, eventsRes] = await Promise.all([
        fetch("http://localhost:3000/chores"),
        fetch("http://localhost:3000/bills"),
        fetch("http://localhost:3000/events")
      ]);

      const [chores, bills, events] = await Promise.all([
        choresRes.json(),
        billsRes.json(),
        eventsRes.json()
      ]);

      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      // Check for due bills
      const dueBills = bills.filter(b => !b.paid && b.dueDate <= today);
      dueBills.forEach(bill => {
        this.billDueNotification(bill.name, bill.amount, bill.dueDate);
      });

      // Check for overdue chores (assuming chores have a dueDate field)
      const overdueChores = chores.filter(c => !c.completed && c.dueDate && c.dueDate < today);
      overdueChores.forEach(chore => {
        this.choreOverdueNotification(chore.name, chore.assignedTo);
      });

      // Check for today's events
      const todayEvents = events.filter(e => e.date === today);
      todayEvents.forEach(event => {
        this.eventTodayNotification(event.title, event.time);
      });

      // Check for tomorrow's events
      const tomorrowEvents = events.filter(e => e.date === tomorrowStr);
      tomorrowEvents.forEach(event => {
        this.eventUpcomingNotification(event.title, event.date, event.time);
      });

    } catch (error) {
      console.error("Error checking for notifications:", error);
    }
  }

  // Start periodic checking
  startPeriodicCheck(intervalMinutes = 30) {
    // Initial check
    this.checkAndNotify();
    
    // Set up periodic checking
    return setInterval(() => {
      this.checkAndNotify();
    }, intervalMinutes * 60 * 1000);
  }
}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService;
