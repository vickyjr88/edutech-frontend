
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ClassFiltersProps {
  subjects: string[];
  grades: string[];
  sortOptions: string[];
  selectedSubject: string;
  selectedGrade: string;
  priceRange: number[];
  showFeaturedOnly: boolean;
  sortBy: string;
  onSubjectChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onPriceRangeChange: (values: number[]) => void;
  onFeaturedToggle: (checked: boolean) => void;
  onSortByChange: (value: string) => void;
}

const ClassFilters = ({ 
  subjects,
  grades,
  sortOptions,
  selectedSubject,
  selectedGrade,
  priceRange,
  showFeaturedOnly,
  sortBy,
  onSubjectChange,
  onGradeChange,
  onPriceRangeChange,
  onFeaturedToggle,
  onSortByChange
}: ClassFiltersProps) => {
  // Helper function to ensure no empty string values
  const getValidValue = (value: string, fallback: string): string => {
    return value === "" ? fallback : value;
  };

  // Filter out any empty strings from arrays
  const validSubjects = subjects.map(subject => getValidValue(subject, `subject-${Math.random().toString(36).substring(2, 7)}`));
  const validGrades = grades.map(grade => getValidValue(grade, `grade-${Math.random().toString(36).substring(2, 7)}`));
  const validSortOptions = sortOptions.map(option => getValidValue(option, `option-${Math.random().toString(36).substring(2, 7)}`));

  return (
    <div className="rounded-lg mb-8 p-6 bg-gray-50 border border-gray-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {subjects.map((subject, index) => (
                  <SelectItem 
                    key={`subject-${index}`} 
                    value={getValidValue(subject, `subject-${index}`)}
                  >
                    {subject || "Default Subject"}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
          <Select value={selectedGrade} onValueChange={onGradeChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {grades.map((grade, index) => (
                  <SelectItem 
                    key={`grade-${index}`} 
                    value={getValidValue(grade, `grade-${index}`)}
                  >
                    {grade || "Default Grade"}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
          <Slider
            defaultValue={[5, 20]}
            min={5}
            max={30}
            step={1}
            value={priceRange}
            onValueChange={onPriceRangeChange}
            className="my-4"
          />
        </div>
        
        <div className="flex items-center">
          <label htmlFor="featured-toggle" className="text-sm font-medium text-gray-700 mr-3">
            Show Featured Classes Only
          </label>
          <Switch
            id="featured-toggle"
            checked={showFeaturedOnly}
            onCheckedChange={onFeaturedToggle}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <ToggleGroup type="single" value={sortBy} onValueChange={(value) => value && onSortByChange(value)}>
            {sortOptions.map((option, index) => (
              <ToggleGroupItem 
                key={`option-${index}`} 
                value={getValidValue(option, `option-${index}`)}
                className="text-xs px-3 py-1 data-[state=on]:bg-kidato-blue data-[state=on]:text-white"
              >
                {option || "Default Option"}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default ClassFilters;
