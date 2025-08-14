import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getUserInitials(fullName: string) {
    return fullName
      .trim()
      .replace(/-/g, ' ')
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
}
import { format, addWeeks, setDay, setHours, setMinutes, isBefore } from 'date-fns';

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

  const now = new Date();
  const [currentHour, currentMinute] = [now.getHours(), now.getMinutes()];
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  let soonestClassDate = null;

  for (const day of schedule.daysOfWeek) {
    const normalizedDay = day.trim().toUpperCase();
    const dayIndex = daysMap[normalizedDay];
    const [classHour, classMinute] = schedule.startTime.split(':').map(Number);
    const classTimeInMinutes = classHour * 60 + classMinute;

    // Start with a date for the current week, set to the correct day and time
    let candidateDate = setMinutes(setHours(setDay(now, dayIndex, { weekStartsOn: 0 }), classHour), classMinute);

    // If the candidateDate is in the past relative to 'now', move it to next week
    if (isBefore(candidateDate, now)) {
      candidateDate = addWeeks(candidateDate, 1);
    }

    if (!soonestClassDate || candidateDate < soonestClassDate) {
      soonestClassDate = candidateDate;
    }
  }

  if (soonestClassDate) {
    return format(soonestClassDate, 'EEEE, HH:mm');
  } else {
    return 'No upcoming classes found.';
  }
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
