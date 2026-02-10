export function getDaysInMonth(month: number, year: number): string[] {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days: string[] = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(`${monthName} ${day}`);
  }

  return days;
}
