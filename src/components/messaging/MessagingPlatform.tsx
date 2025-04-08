
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Users, 
  User, 
  Send, 
  Search, 
  PlusCircle, 
  Hash, 
  Bell,
  FileText,
  Paperclip,
  Image,
  Smile
} from "lucide-react";
import MessageItem from "./MessageItem";
import ChannelsList from "./ChannelsList";
import UsersList from "./UsersList";

// Mock data for demonstration
const channels = [
  { id: 1, name: "announcements", unread: 2 },
  { id: 2, name: "homework-help", unread: 0 },
  { id: 3, name: "class-discussion", unread: 5 },
  { id: 4, name: "parent-corner", unread: 1 },
  { id: 5, name: "events", unread: 0 }
];

const directMessages = [
  { id: 1, name: "Ms. Johnson", role: "Teacher", status: "online", avatar: "" },
  { id: 2, name: "David Miller", role: "Student", status: "online", avatar: "" },
  { id: 3, name: "Sarah Parker", role: "Parent", status: "offline", avatar: "" },
  { id: 4, name: "Robert Smith", role: "Teacher", status: "away", avatar: "" },
  { id: 5, name: "Emily Wilson", role: "Student", status: "online", avatar: "" }
];

const messages = [
  { 
    id: 1, 
    author: "Ms. Johnson", 
    role: "Teacher", 
    avatar: "", 
    content: "Good morning everyone! Don't forget we have a quiz tomorrow on chapter 5.",
    timestamp: "10:15 AM",
    reactions: [{ emoji: "👍", count: 3 }, { emoji: "📝", count: 2 }]
  },
  { 
    id: 2, 
    author: "David Miller", 
    role: "Student", 
    avatar: "", 
    content: "Will the quiz cover all the topics from the chapter or just the ones we discussed in class?",
    timestamp: "10:17 AM",
    reactions: []
  },
  { 
    id: 3, 
    author: "Ms. Johnson", 
    role: "Teacher", 
    avatar: "", 
    content: "Great question, David! The quiz will focus on the topics we covered in class, specifically sections 5.1 through 5.3.",
    timestamp: "10:20 AM",
    reactions: [{ emoji: "🙏", count: 4 }]
  },
  { 
    id: 4, 
    author: "Sarah Parker", 
    role: "Parent", 
    avatar: "", 
    content: "Thank you for the information. I'll help my child prepare tonight.",
    timestamp: "10:25 AM",
    reactions: [{ emoji: "❤️", count: 2 }]
  },
  { 
    id: 5, 
    author: "Emily Wilson", 
    role: "Student", 
    avatar: "", 
    content: "Could you share any practice problems that might be similar to what will be on the quiz?",
    timestamp: "10:30 AM",
    reactions: [{ emoji: "👆", count: 6 }]
  },
  { 
    id: 6, 
    author: "Ms. Johnson", 
    role: "Teacher", 
    avatar: "", 
    content: "I've just uploaded a set of practice problems to the resources section. They should give you a good idea of what to expect.",
    timestamp: "10:35 AM",
    reactions: [{ emoji: "🎉", count: 8 }]
  }
];

export default function MessagingPlatform() {
  const [newMessage, setNewMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState("homework-help");
  const [activeTab, setActiveTab] = useState("channels");
  
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      console.log("Sending message:", newMessage);
      // Here you would typically add the message to the messages array
      // and potentially send it to a backend server
      setNewMessage("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-140px)] flex">
      {/* Left sidebar - Channels and DMs */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Kidato Class</h2>
          <p className="text-xs text-gray-400">Mathematics 101</p>
        </div>
        
        <Tabs 
          defaultValue="channels" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="px-2 pt-2">
            <TabsList className="w-full bg-gray-700">
              <TabsTrigger value="channels" className="w-1/2 data-[state=active]:bg-gray-600">
                <Hash className="h-4 w-4 mr-1" /> Channels
              </TabsTrigger>
              <TabsTrigger value="dms" className="w-1/2 data-[state=active]:bg-gray-600">
                <MessageCircle className="h-4 w-4 mr-1" /> DMs
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="channels" className="mt-0 p-0">
            <ChannelsList channels={channels} activeChannel={activeChannel} setActiveChannel={setActiveChannel} />
          </TabsContent>
          
          <TabsContent value="dms" className="mt-0 p-0">
            <UsersList users={directMessages} />
          </TabsContent>
        </Tabs>
        
        <div className="mt-auto p-3 bg-gray-900">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-400">Student</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content - Messages */}
      <div className="flex-1 flex flex-col">
        {/* Channel header */}
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <div className="flex items-center">
            <Hash className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="font-medium">{activeChannel}</h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Users className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <FileText className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
        
        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>
        
        {/* Message input */}
        <div className="p-4 border-t">
          <div className="flex items-end bg-gray-100 rounded-lg p-2">
            <div className="flex space-x-2 mb-2 px-2">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <PlusCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <Image className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1">
              <Input 
                placeholder="Message #homework-help"
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <Smile className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleSendMessage} 
                disabled={newMessage.trim() === ""}
                className="ml-2 bg-kidato-blue hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right sidebar - Member list */}
      <div className="w-60 border-l bg-gray-50 p-4 hidden lg:block">
        <h3 className="font-medium text-sm uppercase text-gray-500 mb-4">Members - 24</h3>
        
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-500 mt-4 mb-1">TEACHERS - 3</h4>
          {directMessages
            .filter(user => user.role === "Teacher")
            .map(user => (
              <div key={user.id} className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                <div className={`h-2 w-2 rounded-full mr-2 ${
                  user.status === 'online' ? 'bg-green-500' : 
                  user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            ))
          }
          
          <h4 className="text-xs font-medium text-gray-500 mt-4 mb-1">STUDENTS - 15</h4>
          {directMessages
            .filter(user => user.role === "Student")
            .map(user => (
              <div key={user.id} className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                <div className={`h-2 w-2 rounded-full mr-2 ${
                  user.status === 'online' ? 'bg-green-500' : 
                  user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback className="bg-purple-500 text-white text-xs">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            ))
          }
          
          <h4 className="text-xs font-medium text-gray-500 mt-4 mb-1">PARENTS - 6</h4>
          {directMessages
            .filter(user => user.role === "Parent")
            .map(user => (
              <div key={user.id} className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                <div className={`h-2 w-2 rounded-full mr-2 ${
                  user.status === 'online' ? 'bg-green-500' : 
                  user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback className="bg-green-500 text-white text-xs">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
