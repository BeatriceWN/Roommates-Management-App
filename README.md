# 🏠 Roommate Management App

A comprehensive web application designed to help roommates manage their shared living space efficiently. Track chores, split bills, manage events, and stay organized with your housemates.

## 🌟 Features

### 📊 **Dashboard Overview**
- Real-time statistics and progress tracking
- Summary cards showing chores completion, bills status, and upcoming events
- Dynamic data visualization with progress bars
- Quick access to all major sections

### 🧹 **Chore Management**
- Assign chores to specific roommates
- Track completion status with visual indicators
- Mark chores as completed with instant feedback
- Organized by pending and completed sections

### 💰 **Bill Management & Splitting**
- Add and track household bills
- **Smart Bill Splitting**: Split bills among selected roommates
- Real-time calculation of split amounts
- Track payment status with visual indicators
- Overdue bill alerts and due date tracking

### 📅 **Calendar & Events**
- Schedule and manage household events
- Categorized by today, this week, upcoming, and past events
- Event details with time and descriptions
- Easy event creation and deletion

### 👥 **Roommate Profiles**
- Comprehensive roommate information
- Contact details and room assignments
- Move-in dates and living duration tracking
- Colorful avatar system

### 🔔 **Smart Notifications**
- **In-app notifications** for all user actions
- **Push notifications** for due bills and overdue chores
- Event reminders and completion confirmations
- Beautiful animated notification system

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Modern CSS with custom properties and animations
- **Data Management**: JSON Server for REST API simulation
- **State Management**: React Hooks (useState, useEffect)
- **Notifications**: Custom notification service with browser API
- **Icons**: Font Awesome
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:BeatriceWN/Roommates-Management-App.git
   cd Roommate-Management-App-Final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   
   **Terminal 1 - React Development Server:**
   ```bash
   npm run dev
   ```
   
   **Terminal 2 - JSON Server API:**
   ```bash
   npx json-server --watch db.json --port 3000
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - API Server: http://localhost:3000

## 👥 Team Members

- **Beatrice Wambui** - Master Bedroom
- **Praxcedes Kabeya** - Room A
- **Laban Mugutu** - Room B
- **Victorious Njoroge** - Room C
- **Nancy Adelice** - Room D

## 📁 Project Structure

```
Roommate-Management-App-Final/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── Chores.jsx
│   │   ├── Bills.jsx
│   │   ├── Calendar.jsx
│   │   ├── Roommates.jsx
│   │   ├── Header.jsx
│   │   ├── Tabs.jsx
│   │   ├── InAppNotification.jsx
│   │   └── dashboard/
│   │       ├── SummaryCards.jsx
│   │       ├── RecentChores.jsx
│   │       ├── RecentBills.jsx
│   │       ├── UpcomingEvents.jsx
│   │       ├── RoommatesList.jsx
│   │       └── Notifications.jsx
│   ├── context/
│   │   └── DataContext.jsx
│   ├── services/
│   │   └── NotificationService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── db.json
├── package.json
└── README.md
```

## 🎨 Key Features Explained

### Bill Splitting System
The app includes an intelligent bill splitting feature:
- Select multiple roommates from an intuitive interface
- Real-time calculation showing total amount and per-person cost
- Individual bills created for each selected roommate
- Visual indicators for split bills in the bills list

### Notification System
Two-tier notification system:
- **In-app notifications**: Immediate visual feedback for user actions
- **Push notifications**: Browser notifications for important reminders

### Responsive Design
- Mobile-first approach with breakpoints at 768px and 480px
- Flexible grid layouts that adapt to different screen sizes
- Touch-friendly interface elements

## 🔧 API Endpoints

The JSON Server provides the following endpoints:

- `GET /chores` - Fetch all chores
- `POST /chores` - Create new chore
- `PATCH /chores/:id` - Update chore
- `DELETE /chores/:id` - Delete chore

- `GET /bills` - Fetch all bills
- `POST /bills` - Create new bill
- `PATCH /bills/:id` - Update bill
- `DELETE /bills/:id` - Delete bill

- `GET /events` - Fetch all events
- `POST /events` - Create new event
- `DELETE /events/:id` - Delete event

- `GET /roommates` - Fetch all roommates

## 🎯 Usage Examples

### Adding a New Chore
1. Navigate to the Chores tab
2. Fill in the chore name and select assignee
3. Click "Add Chore"
4. Receive instant confirmation notification

### Splitting a Bill
1. Go to Bills tab and click "Add New Bill"
2. Enter bill details (name, amount, due date)
3. Check "Split this bill among roommates"
4. Select roommates from the visual interface
5. Review the split calculation
6. Submit to create individual bills for each roommate

### Managing Events
1. Access the Calendar tab
2. Add event with title, date, time, and description
3. Events are automatically categorized by timeline
4. Delete events with confirmation notifications

## 🚨 Troubleshooting

### Common Issues

**Port conflicts:**
- If port 5173 is busy, Vite will automatically use the next available port
- If port 3000 is busy for JSON Server, use: `npx json-server --watch db.json --port 3001`

**Data not loading:**
- Ensure both servers are running
- Check that JSON Server is accessible at http://localhost:3000
- Verify db.json file exists and is properly formatted

**Git pull issues:**
```bash
git stash
git pull origin main
git stash pop
```

## 🔄 Development Workflow

### Pulling Latest Changes
```bash
git pull origin main
npm install
npm run dev  # Terminal 1
npx json-server --watch db.json --port 3000  # Terminal 2
```

### Making Changes
1. Create a feature branch: `git checkout -b feature-name`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m "Description of changes"`
5. Push: `git push origin feature-name`
6. Create pull request

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: Push notifications require HTTPS in production and user permission.

## 🎨 Customization

### Theming
The app uses CSS custom properties for easy theming. Main color variables are defined in `src/index.css`:

```css
:root {
  --primary-color: #667eea;
  --success-color: #48bb78;
  --warning-color: #ed8936;
  --danger-color: #f56565;
  /* ... more variables */
}
```

### Adding New Features
1. Create component in appropriate directory
2. Add routing/navigation if needed
3. Update data structure in db.json if required
4. Add corresponding API calls
5. Update this README

## 📄 License

This project is developed as part of a group project for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues or questions, please contact any team member or create an issue in the repository.

---

**Happy Roommate Management! 🏠✨**
