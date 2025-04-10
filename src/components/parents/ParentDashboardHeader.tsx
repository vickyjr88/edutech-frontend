
import { Bell, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ParentDashboardHeaderProps {
  parentName: string;
}

const ParentDashboardHeader = ({ parentName }: ParentDashboardHeaderProps) => {
  const initials = parentName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 flex items-center justify-between">
      <div className="md:hidden">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <span className="sr-only">Open sidebar</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>

      <div className="hidden md:flex items-center bg-gray-50 rounded-md px-3 py-1.5 flex-1 max-w-md">
        <Search className="h-4 w-4 text-gray-400 mr-2" />
        <input
          type="search"
          placeholder="Search..."
          className="bg-transparent border-none focus:outline-none text-sm flex-1"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-gray-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 ml-2">
          <span className="hidden sm:inline text-sm font-medium">{parentName}</span>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-kidato-blue text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default ParentDashboardHeader;
