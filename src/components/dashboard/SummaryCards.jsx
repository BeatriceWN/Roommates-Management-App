import { useData } from "../../context/DataContext";

export default function SummaryCards() {
  const { chores, bills, events, roommates } = useData();

  const totalChores = chores.length;
  const completedChores = chores.filter((c) => c.completed).length;
  const pendingBills = bills.filter((b) => !b.paid).length;
  const totalRoommates = roommates.length;
  const upcomingEvents = events.filter(
    (e) => new Date(e.date) >= new Date()
    