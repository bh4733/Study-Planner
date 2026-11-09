const parseDay = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (value) => {
  const date = parseDay(value);
  return date
    ? date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No deadline";
};

export const formatDateForInput = (value) => {
  const date = parseDay(value);
  return date ? date.toISOString().split("T")[0] : "";
};

// Whole days from today to the deadline (negative = overdue), or null if none
export const daysUntil = (value) => {
  const date = parseDay(value);
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((date - today) / 86400000);
};
