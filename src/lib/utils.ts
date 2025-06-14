import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getUserInitials(fullName: string) {
    return fullName
      .trim()
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
}
export function getNextClassTime(schedule) {
  const daysMap = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };

  const normalizedSchedule = schedule.daysOfWeek.map(day =>
    day.trim().toUpperCase()
  );

  const today = new Date();
  const currentDay = today.getDay();
  const currentTime = today.getHours() + today.getMinutes() / 60;

  let soonestDay = null;
  let minDaysUntil = 8;

  for (const day of normalizedSchedule) {
    const dayIndex = daysMap[day];
    let daysUntil = (dayIndex - currentDay + 7) % 7;

    if (daysUntil === 0) {
      const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
      const classTime = startHour + startMinute / 60;

      if (classTime > currentTime) {
        soonestDay = day;
        minDaysUntil = 0;
        break;
      } else {
        daysUntil = 7;
      }
    }

    if (daysUntil < minDaysUntil) {
      minDaysUntil = daysUntil;
      soonestDay = day;
    }
  }

  const formattedDay = soonestDay.charAt(0) + soonestDay.slice(1).toLowerCase();
  return `${formattedDay}, ${schedule.startTime}`;
}
export function describeAvailability(availability) {
  if (!availability || !availability.days || !availability.times) return "No availability provided.";

  // Format days
  const days = availability.days.map(day =>
    day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
  );

  let dayString = "";
  if (days.length === 1) {
    dayString = days[0];
  } else if (days.length === 2) {
    dayString = `${days[0]} and ${days[1]}`;
  } else {
    dayString = `${days.slice(0, -1).join(", ")} and ${days[days.length - 1]}`;
  }

  // Format times
  const timeLabels = Object.entries(availability.times)
    .filter(([_, isAvailable]) => isAvailable)
    .map(([time]) => time);

  let timeString = "";
  if (timeLabels.length === 0) {
    timeString = "no specific time";
  } else if (timeLabels.length === 1) {
    timeString = timeLabels[0];
  } else if (timeLabels.length === 2) {
    timeString = `${timeLabels[0]} and ${timeLabels[1]}`;
  } else {
    timeString = `${timeLabels.slice(0, -1).join(", ")} and ${timeLabels[timeLabels.length - 1]}`;
  }

  return `${dayString} in the ${timeString}`;
}
