export function todayKey(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function parseKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function dateKeyFromIso(iso: string): string {
  return todayKey(new Date(iso));
}

export function timeValueFromIso(iso: string): string {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function toIso(dateKey: string, time: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes).toISOString();
}

export function weekdayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
}

export function longDateLabel(dateKey: string): string {
  const date = parseKey(dateKey);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${weekday} ${date.getDate()}, ${month}`;
}

export function stripDays(selectedKey: string): Date[] {
  const selected = parseKey(selectedKey);
  const daysFromMonday = selected.getDay() === 0 ? 6 : selected.getDay() - 1;
  const monday = new Date(selected);
  monday.setDate(selected.getDate() - daysFromMonday);
  const sundayBefore = new Date(monday);
  sundayBefore.setDate(monday.getDate() - 1);

  return Array.from({ length: 8 }, (_, index) => {
    const day = new Date(sundayBefore);
    day.setDate(sundayBefore.getDate() + index);
    return day;
  });
}

export function weekBounds(selectedKey: string): { start: Date; end: Date } {
  const selected = parseKey(selectedKey);
  const daysFromMonday = selected.getDay() === 0 ? 6 : selected.getDay() - 1;
  const start = new Date(selected);
  start.setDate(selected.getDate() - daysFromMonday);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end };
}
