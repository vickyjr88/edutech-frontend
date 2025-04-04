
import { ClassItemProps } from "@/components/common/ClassCard";
import ClassCard from "@/components/common/ClassCard";
import { Button } from "@/components/ui/button";

interface ClassesGridProps {
  classes: ClassItemProps[];
  emptyStateResetFilters: () => void;
}

const ClassesGrid = ({ classes, emptyStateResetFilters }: ClassesGridProps) => {
  if (classes.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-gray-800 mb-2">No classes found</h3>
        <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
        <Button onClick={emptyStateResetFilters}>
          Reset Filters
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {classes.map((classItem, index) => (
        <ClassCard key={index} classItem={classItem} />
      ))}
    </div>
  );
};

export default ClassesGrid;
