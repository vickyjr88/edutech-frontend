
// Mock event data types
export interface ScheduleEvent {
  id: number;
  title: string;
  date: string; // ISO string
  time: string; // Human-readable time
  location?: string;
  description?: string;
  type: "class" | "hangout" | "birthday" | "achievement" | "assignment";
  duration?: number; // In hours
}

// Generate dates for the next few days
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);

// Mock events data
export const mockEvents: ScheduleEvent[] = [
  {
    id: 1,
    title: "Math Class",
    date: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
    time: "9:00 AM - 10:30 AM",
    location: "Room 203",
    description: "Advanced algebra with Mr. Johnson",
    type: "class",
    duration: 1.5
  },
  {
    id: 2,
    title: "Science Lab",
    date: new Date(today.setHours(13, 0, 0, 0)).toISOString(),
    time: "1:00 PM - 2:30 PM",
    location: "Science Building, Lab 4",
    description: "Chemistry experiment: Reactions of metals",
    type: "class",
    duration: 1.5
  },
  {
    id: 3,
    title: "Study Group",
    date: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
    time: "4:00 PM - 5:30 PM",
    location: "Library",
    description: "Group study for upcoming history test",
    type: "hangout",
    duration: 1.5
  },
  {
    id: 4,
    title: "Sarah's Birthday Party",
    date: new Date(tomorrow.setHours(15, 0, 0, 0)).toISOString(),
    time: "3:00 PM - 6:00 PM",
    location: "Oakwood Park",
    description: "Don't forget to bring a gift!",
    type: "birthday",
    duration: 3
  },
  {
    id: 5,
    title: "Math Competition Award",
    date: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(),
    time: "10:00 AM - 11:00 AM",
    location: "School Auditorium",
    description: "Recognition ceremony for math competition winners",
    type: "achievement",
    duration: 1
  },
  {
    id: 6,
    title: "Science Project Due",
    date: new Date(nextWeek.setHours(14, 0, 0, 0)).toISOString(),
    time: "2:00 PM",
    location: "Science Class",
    description: "Final submission of renewable energy project",
    type: "assignment",
    duration: 0.5
  },
  {
    id: 7,
    title: "Coding Club",
    date: new Date(nextWeek.setHours(16, 0, 0, 0)).toISOString(),
    time: "4:00 PM - 5:30 PM",
    location: "Computer Lab",
    description: "Working on web development projects",
    type: "class",
    duration: 1.5
  },
  {
    id: 8,
    title: "Movie Night with Friends",
    date: new Date(today.setHours(19, 0, 0, 0)).toISOString(),
    time: "7:00 PM - 10:00 PM",
    location: "Downtown Cinema",
    description: "Watching the new sci-fi movie",
    type: "hangout",
    duration: 3
  },
  {
    id: 9,
    title: "Piano Lesson",
    date: new Date(tomorrow.setHours(17, 30, 0, 0)).toISOString(),
    time: "5:30 PM - 6:30 PM",
    location: "Music Room",
    description: "Weekly piano lesson with Ms. Davis",
    type: "class",
    duration: 1
  },
  {
    id: 10,
    title: "English Essay Due",
    date: new Date(nextWeek.setHours(11, 0, 0, 0)).toISOString(),
    time: "11:00 AM",
    location: "English Class",
    description: "Submit analytical essay on 'To Kill a Mockingbird'",
    type: "assignment",
    duration: 0.5
  },
  {
    id: 11,
    title: "Basketball Practice",
    date: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
    time: "3:00 PM - 4:30 PM",
    location: "Gym",
    description: "Team practice for upcoming tournament",
    type: "class",
    duration: 1.5
  },
  {
    id: 12,
    title: "Achievement Ceremony",
    date: new Date(nextWeek.setHours(18, 0, 0, 0)).toISOString(),
    time: "6:00 PM - 8:00 PM",
    location: "School Auditorium",
    description: "Annual student achievement awards ceremony",
    type: "achievement",
    duration: 2
  }
];
