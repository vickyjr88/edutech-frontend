import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BlogSearchInputProps {
  onSearch: (query: string) => void;
}

const BlogSearchInput: React.FC<BlogSearchInputProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.key)
    if (e.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search blog posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default BlogSearchInput;
