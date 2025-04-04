
import { ClassItemProps } from "@/components/common/ClassCard";
import ClassCard from "@/components/common/ClassCard";

interface FeaturedClassesProps {
  classes: ClassItemProps[];
}

const FeaturedClasses = ({ classes }: FeaturedClassesProps) => {
  if (classes.length === 0) return null;
  
  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Classes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {classes.map((classItem, index) => (
            <ClassCard key={`featured-${index}`} classItem={classItem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedClasses;
