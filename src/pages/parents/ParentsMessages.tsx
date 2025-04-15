
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { MessageSquare, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockMessages = [
  {
    id: 1,
    sender: "Mr. Williams",
    senderRole: "Math Teacher",
    message: "Emma did exceptionally well in today's algebra quiz!",
    time: "10:30 AM",
    unread: true,
    avatar: "MW"
  },
  {
    id: 2,
    sender: "Ms. Rodriguez",
    senderRole: "Science Teacher",
    message: "Noah's science project is due next week. Please ensure...",
    time: "Yesterday",
    unread: false,
    avatar: "MR"
  },
  {
    id: 3,
    sender: "Mrs. Thompson",
    senderRole: "English Teacher",
    message: "Would you be available for a parent-teacher meeting?",
    time: "2 days ago",
    unread: false,
    avatar: "MT"
  }
];

const ParentsMessages = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />
        
        <main className="p-6 flex-1">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-kidato-blue" />
                <h1 className="text-2xl font-bold">Messages</h1>
              </div>
              
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input className="pl-8" placeholder="Search messages..." />
              </div>
            </div>
            
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`hover:border-blue-200 transition-colors cursor-pointer ${
                    message.unread ? 'bg-blue-50' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-500">
                          {message.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{message.sender}</p>
                            <p className="text-sm text-gray-600">{message.senderRole}</p>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-sm text-gray-500">{message.time}</span>
                            {message.unread && (
                              <Badge className="ml-2 bg-blue-500">New</Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mt-2">{message.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentsMessages;
