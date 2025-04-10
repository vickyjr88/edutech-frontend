
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseFiltersProps {
  onClose: () => void;
}

const CourseFilters = ({ onClose }: CourseFiltersProps) => {
  return (
    <Card className="mb-8 border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium">Filter Courses</CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select className="w-full rounded-md border border-gray-300 p-2">
            <option value="">All Subjects</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="english">English</option>
            <option value="art">Art</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Grade Level</label>
          <select className="w-full rounded-md border border-gray-300 p-2">
            <option value="">All Grades</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
            <option value="9">Grade 9</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course Type</label>
          <select className="w-full rounded-md border border-gray-300 p-2">
            <option value="">All Types</option>
            <option value="academic">Academic</option>
            <option value="extracurricular">Extracurricular</option>
            <option value="enrichment">Enrichment</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseFilters;
