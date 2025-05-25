
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CurriculumGradeFilterProps {
  onFilterChange: (curriculum: string, grade: string) => void;
}

const CurriculumGradeFilter = ({ onFilterChange }: CurriculumGradeFilterProps) => {
  const [curriculum, setCurriculum] = useState("");
  const [grade, setGrade] = useState("");

  const handleApplyFilter = () => {
    onFilterChange(curriculum, grade);
  };

  const handleClearFilters = () => {
    setCurriculum("");
    setGrade("");
    onFilterChange("", "");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div>
        <Select
          value={curriculum}
          onValueChange={setCurriculum}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Curriculum" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Curriculums</SelectLabel>
              <SelectItem value="igcse">IGCSE</SelectItem>
              <SelectItem value="ib">IB</SelectItem>
              <SelectItem value="american">American</SelectItem>
              <SelectItem value="british">British</SelectItem>
              <SelectItem value="kenyan">Kenyan</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Select
          value={grade}
          onValueChange={setGrade}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Grade/Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Primary</SelectLabel>
              <SelectItem value="1">Grade/Year 1</SelectItem>
              <SelectItem value="2">Grade/Year 2</SelectItem>
              <SelectItem value="3">Grade/Year 3</SelectItem>
              <SelectItem value="4">Grade/Year 4</SelectItem>
              <SelectItem value="5">Grade/Year 5</SelectItem>
              <SelectItem value="6">Grade/Year 6</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Secondary</SelectLabel>
              <SelectItem value="7">Grade/Year 7</SelectItem>
              <SelectItem value="8">Grade/Year 8</SelectItem>
              <SelectItem value="9">Grade/Year 9</SelectItem>
              <SelectItem value="10">Grade/Year 10</SelectItem>
              <SelectItem value="11">Grade/Year 11</SelectItem>
              <SelectItem value="12">Grade/Year 12</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-end space-x-2">
        <Button 
          onClick={handleApplyFilter}
          className="flex-1 bg-kidato-purple hover:bg-kidato-dark-blue"
        >
          Apply Filter
        </Button>
        
        <Button 
          onClick={handleClearFilters}
          variant="outline" 
          className="border-gray-300"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default CurriculumGradeFilter;
