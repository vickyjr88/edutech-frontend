
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Book, GraduationCap, Clock, Bot, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KidatoMascotDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface Message {
  id: number;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface QuickPrompt {
  icon: JSX.Element;
  text: string;
  prompt: string;
}

export default function KidatoMascotDialog({ isOpen, setIsOpen }: KidatoMascotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hi! I'm your Kidato AI assistant. How can I help with your studies today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts: QuickPrompt[] = [
    {
      icon: <Book className="h-4 w-4" />,
      text: "Help with homework",
      prompt: "Can you help me with my homework?",
    },
    {
      icon: <GraduationCap className="h-4 w-4" />,
      text: "Study tips",
      prompt: "What are some good study tips?",
    },
    {
      icon: <Clock className="h-4 w-4" />,
      text: "Create schedule",
      prompt: "Help me create a study schedule for this week.",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages([...messages, newUserMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const responses = [
        "I'd be happy to help with that! What specific part are you struggling with?",
        "Great question! Based on your current classes, here's what I recommend...",
        "Looking at your upcoming assignments, you might want to focus on the math homework due tomorrow.",
        "For your upcoming science test, I suggest reviewing chapters 3-5. Would you like me to create a study plan?",
        "Based on your progress, you're doing really well in Math! Keep it up!",
        "I can help you break down this problem. Let's approach it step by step.",
        "Let me check your schedule. You have a class starting in 30 minutes. Would you like me to remind you?",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newAssistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newAssistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" alt="Kidato Mascot" />
              <AvatarFallback className="bg-kidato-light-blue text-kidato-purple">K</AvatarFallback>
            </Avatar>
            <span>Kidato AI Assistant</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[60vh]">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "assistant" ? "" : "flex-row-reverse"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" alt="Kidato Mascot" />
                      <AvatarFallback className="bg-kidato-light-blue text-kidato-purple">K</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8 mt-1 bg-gray-200">
                      <AvatarFallback><UserRound className="h-5 w-5 text-gray-600" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "assistant"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-kidato-purple text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" alt="Kidato Mascot" />
                    <AvatarFallback className="bg-kidato-light-blue text-kidato-purple">K</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="p-3 border-t">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1"
                  onClick={() => handleQuickPrompt(item.prompt)}
                >
                  {item.icon}
                  <span className="ml-1">{item.text}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 border-t mt-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(input);
                    }
                  }}
                  placeholder="Type your question..."
                  className="w-full border rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-kidato-purple focus:border-transparent"
                />
              </div>
              <Button
                onClick={() => handleSendMessage(input)}
                className="bg-kidato-purple hover:bg-kidato-purple/90"
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
