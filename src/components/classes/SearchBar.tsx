
import { Search, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  onToggleFilters,
  showFilters
}: SearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search for classes, subjects, or teachers..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Button 
        variant="outline" 
        className="md:w-auto flex items-center gap-2"
        onClick={onToggleFilters}
      >
        <Filter className="h-4 w-4" />
        Filters
        <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </Button>
    </div>
  );
};

export default SearchBar;
