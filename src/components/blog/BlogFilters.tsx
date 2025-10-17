import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { BlogFilters as BlogFiltersType, BlogCategory } from "@/types/blog";
import { blogApiService } from "@/services/blogApi";

interface BlogFiltersProps {
  filters: BlogFiltersType;
  onFiltersChange: (filters: Partial<BlogFiltersType>) => void;
}

const BlogFilters: React.FC<BlogFiltersProps> = ({ filters, onFiltersChange }) => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [popularTags, setPopularTags] = useState<Array<{ tag: string; count: number }>>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadFilters = async () => {
      try {
        setLoadingFilters(true);
        const [cats, stats] = await Promise.all([
          blogApiService.getCategories(),
          blogApiService.getStats(),
        ]);
        if (!isMounted) return;
        setCategories(cats || []);
        setPopularTags(stats?.topTags || []);
      } catch (e) {
        console.error('Failed to load blog filters:', e);
      } finally {
        if (isMounted) setLoadingFilters(false);
      }
    };
    loadFilters();
    return () => { isMounted = false; };
  }, []);

  const sortOptions = [
    { value: "publishedAt", label: "Latest" },
    { value: "updatedAt", label: "Recently Updated" },
    { value: "viewCount", label: "Most Popular" },
    { value: "title", label: "Alphabetical" }
  ];

  const handleSearch = (search: string) => {
    onFiltersChange({ search: search || undefined });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ 
      category: category === "all" ? undefined : category 
    });
  };

  const handleTagClick = (tag: string) => {
    onFiltersChange({ tag });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ sortBy: sortBy as any });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: undefined,
      tag: undefined,
      search: undefined,
      sortBy: "publishedAt"
    });
  };

  const hasActiveFilters = filters.category || filters.tag || filters.search;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Search and Sort Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {/* "All" option */}
              <Button
                key="all"
                variant={filters.category ? "outline" : "default"}
                size="sm"
                onClick={() => handleCategoryChange("all")}
                className="text-sm"
              >
                All Categories
              </Button>
              {(categories || []).map((category) => (
                <Button
                  key={category.slug || (category as any).id || category.name}
                  variant={filters.category === category.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.slug)}
                  className="text-sm"
                >
                  {category.name}
                </Button>
              ))}
              {loadingFilters && (
                <span className="text-xs text-gray-500">Loading...</span>
              )}
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {(popularTags || []).map((tag) => (
                <Badge
                  key={tag.tag}
                  variant={filters.tag === tag.tag ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => handleTagClick(tag.tag)}
                >
                  {tag.tag} ({tag.count})
                </Badge>
              ))}
              {loadingFilters && (
                <span className="text-xs text-gray-500">Loading...</span>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <Badge variant="default" className="flex items-center gap-1">
                    Category: {categories.find(c => c.slug === filters.category)?.name}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleCategoryChange("all")}
                    />
                  </Badge>
                )}
                {filters.tag && (
                  <Badge variant="default" className="flex items-center gap-1">
                    Tag: {filters.tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => onFiltersChange({ tag: undefined })}
                    />
                  </Badge>
                )}
                {filters.search && (
                  <Badge variant="default" className="flex items-center gap-1">
                    Search: {filters.search}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => onFiltersChange({ search: undefined })}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { BlogFilters };
