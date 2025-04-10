import { AchievementType } from "./AchievementsList";
import { LeaderboardEntryType } from "./LeaderboardTable";

export const mockAchievements: AchievementType[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first lesson on Kidato",
    icon: "Medal",
    category: "participation",
    xpValue: 50,
    unlocked: true,
    date: "April 5, 2025"
  },
  {
    id: 2,
    name: "Math Whiz",
    description: "Score 100% on 3 consecutive math quizzes",
    icon: "Brain",
    category: "academic",
    xpValue: 150,
    unlocked: true,
    date: "April 3, 2025"
  },
  {
    id: 3,
    name: "Science Explorer",
    description: "Complete all experiments in the Basic Science course",
    icon: "Beaker",
    category: "academic",
    xpValue: 200,
    progress: 75,
    unlocked: false
  },
  {
    id: 4,
    name: "Bookworm",
    description: "Read 10 books in the digital library",
    icon: "BookOpen",
    category: "academic",
    xpValue: 100,
    progress: 60,
    unlocked: false
  },
  {
    id: 5,
    name: "Helpful Friend",
    description: "Help 5 classmates with their questions in forums",
    icon: "Star",
    category: "social",
    xpValue: 75,
    progress: 40,
    unlocked: false
  },
  {
    id: 6,
    name: "Coding Ninja",
    description: "Complete the 'Introduction to Coding' course",
    icon: "Code",
    category: "academic",
    xpValue: 250,
    unlocked: true,
    date: "March 29, 2025"
  },
  {
    id: 7,
    name: "Perfect Attendance",
    description: "Attend classes for 30 consecutive days",
    icon: "Clock",
    category: "participation",
    xpValue: 100,
    progress: 83,
    unlocked: false
  },
  {
    id: 8,
    name: "Creative Genius",
    description: "Submit a project that receives recognition from teachers",
    icon: "Lightbulb",
    category: "creativity",
    xpValue: 125,
    unlocked: true,
    date: "March 25, 2025"
  }
];

export const mockRecentAchievements: AchievementType[] = [
  {
    id: 2,
    name: "Math Whiz",
    description: "Score 100% on 3 consecutive math quizzes",
    icon: "Brain",
    category: "academic",
    xpValue: 150,
    unlocked: true,
    date: "April 3, 2025"
  },
  {
    id: 6,
    name: "Coding Ninja",
    description: "Complete the 'Introduction to Coding' course",
    icon: "Code",
    category: "academic",
    xpValue: 250,
    unlocked: true,
    date: "March 29, 2025"
  },
  {
    id: 8,
    name: "Creative Genius",
    description: "Submit a project that receives recognition from teachers",
    icon: "Lightbulb",
    category: "creativity",
    xpValue: 125,
    unlocked: true,
    date: "March 25, 2025"
  }
];

export const mockLeaderboardData: LeaderboardEntryType[] = [
  {
    id: 101,
    rank: 1,
    name: "Alex Johnson",
    grade: "8th Grade",
    points: 1250,
    achievements: 15,
    streak: 21
  },
  {
    id: 102,
    rank: 2,
    name: "Olivia Smith",
    grade: "7th Grade",
    points: 1180,
    achievements: 14,
    streak: 14
  },
  {
    id: 103,
    rank: 3,
    name: "Ethan Brown",
    grade: "8th Grade",
    points: 1120,
    achievements: 12,
    streak: 7
  },
  {
    id: 104,
    rank: 4,
    name: "John Doe", // Current user
    grade: "7th Grade",
    points: 980,
    achievements: 11,
    streak: 9
  },
  {
    id: 105,
    rank: 5,
    name: "Sophia Wang",
    grade: "8th Grade",
    points: 950,
    achievements: 10,
    streak: 5
  },
  {
    id: 106,
    rank: 6,
    name: "Lucas Garcia",
    grade: "7th Grade",
    points: 920,
    achievements: 9,
    streak: 12
  },
  {
    id: 107,
    rank: 7,
    name: "Emma Wilson",
    grade: "8th Grade",
    points: 890,
    achievements: 10,
    streak: 6
  },
  {
    id: 108,
    rank: 8,
    name: "Aiden Thomas",
    grade: "7th Grade",
    points: 860,
    achievements: 8,
    streak: 4
  },
  {
    id: 109,
    rank: 9,
    name: "Mia Rodriguez",
    grade: "7th Grade",
    points: 830,
    achievements: 9,
    streak: 3
  },
  {
    id: 110,
    rank: 10,
    name: "Noah Lewis",
    grade: "8th Grade",
    points: 800,
    achievements: 7,
    streak: 8
  }
];
