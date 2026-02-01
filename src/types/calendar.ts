
export interface ScheduleEvent {
    id: number | string;
    title: string;
    date: string; // ISO string
    time: string; // Human-readable time
    location?: string;
    meetingLink?: string;
    description?: string;
    type: "class" | "hangout" | "birthday" | "achievement" | "assignment" | "personal" | "other";
    duration?: number; // In hours
}
