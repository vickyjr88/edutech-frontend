
import { Sparkles, Award, Trophy } from "lucide-react";

// Shared data that will be used across components
export const studentProgressData = {
  streak: 7,
  achievements: {
    total: 12,
    unlocked: 8,
    recent: [
      { 
        name: "Quick Learner", 
        date: "Today", 
        icon: Sparkles, 
        color: "text-blue-500", 
        description: "Completed 5 lessons in a single day",
        xpEarned: 50
      },
      { 
        name: "Math Wizard", 
        date: "Yesterday", 
        icon: Award, 
        color: "text-purple-500",
        description: "Scored 95% or higher on 3 consecutive math quizzes",
        xpEarned: 100
      },
      { 
        name: "Reading Champion", 
        date: "Last week", 
        icon: Trophy, 
        color: "text-green-500",
        description: "Finished reading 5 books this month",
        xpEarned: 150
      },
    ]
  },
  level: {
    current: 5,
    xpForNext: 1250,
    currentXP: 850,
    title: "Scholar"
  }
};
