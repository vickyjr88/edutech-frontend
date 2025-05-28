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