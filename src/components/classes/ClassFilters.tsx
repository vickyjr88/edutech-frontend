
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
                {subjects.map((subject) => (
                  <SelectItem 
                    key={subject || "default-subject"} 
                    value={subject || subject === "" ? "default-subject" : subject}
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
                {grades.map((grade) => (
                  <SelectItem 
                    key={grade || "default-grade"} 
                    value={grade || grade === "" ? "default-grade" : grade}
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
            {sortOptions.map((option) => (
              <ToggleGroupItem 
                key={option || "default-option"} 
                value={option || option === "" ? "default-option" : option} 
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
