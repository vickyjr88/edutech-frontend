
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
import { Button } from "@/components/ui/button";

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
  onReset?: () => void;
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
  onSortByChange,
  onReset
}: ClassFiltersProps) => {
  return (
    <div className="rounded-lg mb-8 p-6 bg-gray-50 border border-gray-100 shadow-sm">
      {/* First Row: Subject, Grade, Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger className="bg-white w-full">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {subjects.map((subject, index) => (
                  <SelectItem key={`subject-${index}`} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
          <Select value={selectedGrade} onValueChange={onGradeChange}>
            <SelectTrigger className="bg-white w-full">
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {grades.map((grade, index) => (
                  <SelectItem key={`grade-${index}`} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: KES {priceRange[0]} - KES {priceRange[1]}
          </label>
          <Slider
            min={0}
            max={1000}
            step={50}
            value={priceRange}
            onValueChange={onPriceRangeChange}
            className="my-4"
          />
        </div>
      </div>

      {/* Second Row: Sort By and Featured Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <label htmlFor="featured-toggle" className="text-sm font-medium text-gray-700">
            Show Featured Only
          </label>
          <Switch
            id="featured-toggle"
            checked={showFeaturedOnly}
            onCheckedChange={onFeaturedToggle}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-medium text-gray-700 mr-2">Sort By:</label>
          {sortOptions.map((option, index) => (
            <Button
              key={`option-${index}`}
              variant={sortBy === option ? "default" : "outline"}
              size="sm"
              onClick={() => onSortByChange(option)}
              className={sortBy === option 
                ? "bg-kidato-purple hover:bg-kidato-purple/90 text-white" 
                : "hover:bg-gray-100"
              }
            >
              {option}
            </Button>
          ))}
        </div>

        {onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClassFilters;
