import { useData } from "../../context/DataContext";

export default function SummaryCards() {
  const { chores, bills, events, roommates } = useData();

  const totalChores = chores.length;