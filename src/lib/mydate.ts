export function formatYYYYMMDD(s: string): string {
  const date = new Date(s);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatYYYYMMDDTime(s: string): string {
  const date = new Date(s);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateToOnlyTime(time: string): string {
  const date = new Date(time);

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatTime24To12(time: string): string {
  // "13:00" -> "1:00 PM"
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function formatClassDays(days: string[]): string {
  return days.join(", ");
}
