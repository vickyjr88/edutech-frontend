
import { TooltipProvider } from "@/components/ui/tooltip";
import StatCard from "./StatCard";
import { useStatCards } from "./hooks/useStatCards";
import { studentProgressData } from "./data/studentProgressData";

// Export shared data for other components to use
export { studentProgressData };

export default function StudentStatCards() {
  const { stats, handleCardClick, hovered, setHovered, animatePoints } = useStatCards();

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
            onCardClick={handleCardClick}
            isHovered={hovered === index}
            index={index}
            animatePoints={animatePoints}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}
