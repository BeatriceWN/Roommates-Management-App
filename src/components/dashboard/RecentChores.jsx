import { useData } from "../../context/DataContext";

export default function RecentChores() {
  const { chores, markChoreComplete } = useData();

  const recent = [...chores].slice(0, 5);