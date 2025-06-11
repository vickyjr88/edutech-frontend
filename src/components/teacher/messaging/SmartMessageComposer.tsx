import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  MessageCircle, Mail, Bell, X, Brain, Clock, Target, 
  Send, Users, Star, ChevronDown, Check, Sparkles,
  AlertTriangle, TrendingUp, Calendar, Zap, Phone
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Student {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  status: 'high-performer' | 'normal' | 'needs-attention' | 'inactive';
  lastActive: string;
  preferredPlatform: 'whatsapp' | 'email' | 'app';
  responseRate: number;
  subjects: string[];
}

interface RecipientGroup {
  id: string;
  title: string;
  count: number;
  students: Student[];
  aiReason: string;
  color: 'warning' | 'success' | 'danger' | 'info';
}

interface MessageTemplate {
  id: string;
  category: string;
  title: string;
  preview: string;
  content: string;
  responseRate: number;
  bestFor: string;
  tags: string[];
}

interface AIInsights {
  commonIssues: string[];
  suggestedTone: 'encouraging' | 'casual' | 'formal';
  optimalSendTime: string;
  expectedResponseRate: number;
  personalizedTips: string[];
}

interface Platform {
  id: 'whatsapp' | 'email' | 'app';
  name: string;
  icon: any;
  responseRate: number;
  deliveryTime: string;
  recommended?: boolean;
}

interface SmartMessageComposerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudents?: Student[];
  allStudents: Student[];
  onSendMessage: (messageData: any) => void;
}

const PLATFORMS: Platform[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    responseRate: 89,
    deliveryTime: 'Instant',
    recommended: true
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    responseRate: 45,
    deliveryTime: '2-4 hours'
  },
  {
    id: 'app',
    name: 'App Notification',
    icon: Bell,
    responseRate: 67,
    deliveryTime: 'Next login'
  }
];

const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: '1',
    category: 'Check-in',
    title: 'Assignment Reminder',
    preview: 'Hi [Name]! Friendly reminder about...',
    content: 'Hi [Name]! 👋\n\nFriendly reminder about your [Subject] assignment that was due yesterday. No worries if you need more time - we all have busy schedules!\n\nWould you like to discuss an extension or need any help with the material? I\'m here to support you.\n\nBest regards,\n[Teacher Name]',
    responseRate: 87,
    bestFor: 'behind-on-work',
    tags: ['assignment', 'reminder', 'supportive']
  },
  {
    id: '2',
    category: 'Check-in',
    title: 'Supportive Check-in',
    preview: 'Hey [Name], noticed you missed...',
    content: 'Hey [Name], 😊\n\nI noticed you missed our last few [Subject] sessions. Just wanted to check in and see how you\'re doing!\n\nIs everything okay? If you\'re facing any challenges or need support with the coursework, please don\'t hesitate to reach out.\n\nWe miss having you in class!\n\nTake care,\n[Teacher Name]',
    responseRate: 76,
    bestFor: 'inactive-students',
    tags: ['check-in', 'caring', 'support']
  },
  {
    id: '3',
    category: 'Celebration',
    title: 'Achievement Praise',
    preview: '🎉 Amazing work on your [Subject]...',
    content: '🎉 Amazing work on your [Subject] assignment, [Name]!\n\nI was really impressed by your [specific achievement]. Your hard work and dedication are truly paying off.\n\nKeep up the excellent work - you\'re setting a great example for your classmates!\n\nProud of your progress,\n[Teacher Name]',
    responseRate: 95,
    bestFor: 'high-performers',
    tags: ['celebration', 'achievement', 'motivation']
  },
  {
    id: '4',
    category: 'Support',
    title: 'Offer Help',
    preview: 'Hi [Name], I\'m here to help...',
    content: 'Hi [Name],\n\nI noticed you might be struggling with some of the recent [Subject] concepts. That\'s completely normal - this material can be challenging!\n\nWould you like to schedule a quick 15-minute one-on-one session? We could review the key points and make sure you feel confident moving forward.\n\nI have some time slots available this week. Let me know what works for you!\n\nHere to help,\n[Teacher Name]',
    responseRate: 82,
    bestFor: 'struggling-students',
    tags: ['help', 'one-on-one', 'academic-support']
  }
];

const SMART_GROUPS: RecipientGroup[] = [
  {
    id: 'behind-assignments',
    title: 'Behind on Assignments',
    count: 12,
    students: [],
    aiReason: "Haven't submitted this week's work",
    color: 'warning'
  },
  {
    id: 'high-performers',
    title: 'High Performers',
    count: 24,
    students: [],
    aiReason: 'Ready for advanced challenges',
    color: 'success'
  },
  {
    id: 'need-checkin',
    title: 'Need Check-in',
    count: 8,
    students: [],
    aiReason: 'Inactive for 3+ days',
    color: 'danger'
  },
  {
    id: 'recent-achievers',
    title: 'Recent Achievers',
    count: 15,
    students: [],
    aiReason: 'Completed assignments with excellence',
    color: 'info'
  }
];

export const SmartMessageComposer: React.FC<SmartMessageComposerProps> = ({
  isOpen,
  onClose,
  selectedStudents = [],
  allStudents,
  onSendMessage
}) => {
  const [currentStep, setCurrentStep] = useState<'recipients' | 'compose' | 'preview'>('recipients');
  const [recipients, setRecipients] = useState<Student[]>(selectedStudents);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['whatsapp']);
  const [scheduleOption, setScheduleOption] = useState<'now' | 'optimal' | 'custom'>('now');
  const [personalizeSettings, setPersonalizeSettings] = useState({
    useNames: true,
    includeSubject: true,
    addRecentAchievement: false
  });
  const [tone, setTone] = useState<'casual' | 'formal' | 'encouraging'>('encouraging');
  const [accordionValue, setAccordionValue] = useState<string>("ai-groups");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Mock AI insights based on selected recipients
  const aiInsights: AIInsights = useMemo(() => {
    const totalStudents = recipients.length;
    const whatsappPreferred = recipients.filter(s => s.preferredPlatform === 'whatsapp').length;
    
    return {
      commonIssues: ['Assignment delays', 'Attendance gaps', 'Need encouragement'],
      suggestedTone: 'encouraging',
      optimalSendTime: 'Today 6:30 PM',
      expectedResponseRate: Math.round(recipients.reduce((acc, s) => acc + s.responseRate, 0) / totalStudents || 0),
      personalizedTips: [
        `${whatsappPreferred} students prefer WhatsApp (90% response rate)`,
        'Add assignment extension offer (+23% response boost)',
        'Include emoji for engagement (+15% response rate)'
      ]
    };
  }, [recipients]);

  const handleGroupSelect = (groupId: string, checked: boolean) => {
    if (checked) {
      setSelectedGroups(prev => [...prev, groupId]);
      const group = SMART_GROUPS.find(g => g.id === groupId);
      if (group) {
        // Mock adding students from group
        const mockStudents = allStudents.slice(0, group.count);
        setRecipients(prev => [...prev, ...mockStudents.filter(s => !prev.find(p => p.id === s.id))]);
      }
      // Auto-close accordion when a group is selected
      setAccordionValue("");
    } else {
      setSelectedGroups(prev => prev.filter(id => id !== groupId));
    }
  };

  const handleStudentSelect = (student: Student, checked: boolean) => {
    if (checked) {
      setRecipients(prev => [...prev, student]);
    } else {
      setRecipients(prev => prev.filter(s => s.id !== student.id));
    }
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setMessageContent(template.content);
  };

  const personalizeMessage = (content: string) => {
    let personalizedContent = content;
    
    if (personalizeSettings.useNames && recipients.length === 1) {
      personalizedContent = personalizedContent.replace(/\[Name\]/g, recipients[0].name);
    }
    
    if (personalizeSettings.includeSubject && recipients.length > 0) {
      const commonSubject = recipients[0].subjects[0] || 'your subject';
      personalizedContent = personalizedContent.replace(/\[Subject\]/g, commonSubject);
    }
    
    personalizedContent = personalizedContent.replace(/\[Teacher Name\]/g, 'Your Teacher');
    
    return personalizedContent;
  };

  const getColorClass = (color: RecipientGroup['color']) => {
    switch (color) {
      case 'warning': return 'border-[#f99325] bg-[#f99325]/10 text-[#f99325]';
      case 'success': return 'border-[#2ed573] bg-[#2ed573]/10 text-[#2ed573]';
      case 'danger': return 'border-red-500 bg-red-50 text-red-600';
      case 'info': return 'border-[#5e6ad2] bg-[#5e6ad2]/10 text-[#5e6ad2]';
      default: return 'border-gray-300 bg-gray-50 text-gray-600';
    }
  };

  const renderRecipientsStep = () => (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* AI Insights Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#5e6ad2]/10 to-[#abb4dd]/10 rounded-2xl px-6 py-3 mb-4">
          <Brain className="w-6 h-6 text-[#5e6ad2] animate-pulse" />
          <span className="text-lg font-semibold text-[#5e6ad2]">AI has analyzed your students</span>
          <Sparkles className="w-5 h-5 text-[#f99325]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Who would you like to message?</h2>
        <p className="text-xl text-gray-600">Choose from smart groups or select individual students</p>
      </div>

      {/* Smart Groups - Enhanced Layout with Accordion */}
      <div className="mb-12">
        <Accordion 
          type="single" 
          collapsible 
          value={accordionValue} 
          onValueChange={setAccordionValue}
          className="w-full"
        >
          <AccordionItem value="ai-groups" className="border-0">
            <AccordionTrigger className="hover:no-underline p-0 pb-6">
              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5e6ad2] to-[#abb4dd] rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900">AI-Recommended Groups</h3>
                    <p className="text-gray-600">Smart categorization based on student behavior and performance</p>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {SMART_GROUPS.map((group, index) => (
                  <Card 
                    key={group.id} 
                    className={`relative border-2 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 transform ${
                      selectedGroups.includes(group.id) 
                        ? 'ring-4 ring-opacity-50 shadow-2xl scale-105' + ' ' + getColorClass(group.color).replace('border-', 'ring-')
                        : getColorClass(group.color)
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <Checkbox
                            checked={selectedGroups.includes(group.id)}
                            onCheckedChange={(checked) => handleGroupSelect(group.id, checked as boolean)}
                            className="h-6 w-6 mt-1"
                          />
                          <Badge variant="secondary" className="px-3 py-1 font-semibold">
                            {group.count} students
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold leading-tight">{group.title}</h4>
                          <p className="text-sm opacity-90 leading-relaxed">{group.aiReason}</p>
                        </div>

                        {/* Visual indicator */}
                        <div className="flex items-center gap-2 pt-2">
                          <div className={`w-2 h-2 rounded-full ${
                            group.color === 'warning' ? 'bg-[#f99325]' :
                            group.color === 'success' ? 'bg-[#2ed573]' :
                            group.color === 'danger' ? 'bg-red-500' : 'bg-[#5e6ad2]'
                          } animate-pulse`} />
                          <span className="text-xs font-medium opacity-75">
                            {group.color === 'warning' ? 'Needs Support' :
                             group.color === 'success' ? 'High Performers' :
                             group.color === 'danger' ? 'Urgent Attention' : 'Celebrating Success'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Selected Groups Tags */}
        {selectedGroups.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5e6ad2] to-[#abb4dd] rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Selected Groups</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {selectedGroups.map((groupId) => {
                const group = SMART_GROUPS.find(g => g.id === groupId);
                if (!group) return null;
                
                return (
                  <div
                    key={groupId}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-sm transition-all duration-200 ${getColorClass(group.color)}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      group.color === 'warning' ? 'bg-[#f99325]' :
                      group.color === 'success' ? 'bg-[#2ed573]' :
                      group.color === 'danger' ? 'bg-red-500' : 'bg-[#5e6ad2]'
                    }`} />
                    <span className="font-medium text-sm">{group.title}</span>
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {group.count}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGroupSelect(groupId, false)}
                      className="h-5 w-5 p-0 hover:bg-black/10 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-12">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        <div className="px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-500">OR</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </div>

      {/* Individual Students - Enhanced Layout */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f99325] to-[#ff7675] rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Individual Students</h3>
              <p className="text-gray-600">Handpick specific students for your message</p>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setRecipients(allStudents)}
              className="hover:bg-[#5e6ad2]/10"
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setRecipients([])}
              className="hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>
        </div>
        
        <Card className="bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {allStudents.map((student, index) => (
                <div 
                  key={student.id} 
                  className={`group relative flex items-center gap-3 p-4 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg border ${
                    recipients.some(r => r.id === student.id)
                      ? 'bg-gradient-to-br from-[#5e6ad2]/10 to-[#abb4dd]/10 border-[#5e6ad2] shadow-md scale-105'
                      : 'bg-gray-50/70 hover:bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleStudentSelect(student, !recipients.some(r => r.id === student.id))}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <Checkbox
                    checked={recipients.some(r => r.id === student.id)}
                    onCheckedChange={(checked) => handleStudentSelect(student, checked as boolean)}
                    className="h-5 w-5 z-10"
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-[#5e6ad2] to-[#abb4dd] text-white font-bold text-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">{student.name}</p>
                    <p className="text-xs text-gray-500 truncate">{student.subjects.join(', ')}</p>
                    
                    {/* Status indicator */}
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        student.status === 'high-performer' ? 'bg-[#2ed573]' :
                        student.status === 'needs-attention' ? 'bg-[#f99325]' :
                        student.status === 'inactive' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-xs text-gray-500 capitalize">
                        {student.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {recipients.some(r => r.id === student.id) && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#2ed573] rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Selected Recipients Summary */}
      {recipients.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-[#5e6ad2]/5 via-white to-[#abb4dd]/5 border-2 border-[#5e6ad2]/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#5e6ad2]/5 to-transparent opacity-50" />
          <CardContent className="relative p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5e6ad2] to-[#abb4dd] rounded-2xl flex items-center justify-center shadow-lg">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {recipients.length} Student{recipients.length !== 1 ? 's' : ''} Selected
                    </h3>
                    <p className="text-gray-600">Ready to craft your personalized message</p>
                  </div>
                </div>
                
                {/* Student badges */}
                <div className="flex flex-wrap gap-2">
                  {recipients.slice(0, 8).map((student) => (
                    <Badge 
                      key={student.id} 
                      className="bg-white/80 text-[#5e6ad2] border border-[#5e6ad2]/20 hover:bg-[#5e6ad2]/10 px-3 py-1"
                    >
                      {student.name}
                    </Badge>
                  ))}
                  {recipients.length > 8 && (
                    <Badge className="bg-[#5e6ad2] text-white px-3 py-1">
                      +{recipients.length - 8} more
                    </Badge>
                  )}
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#2ed573]" />
                    <span>Avg Response: {aiInsights.expectedResponseRate}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#f99325]" />
                    <span>Best Time: {aiInsights.optimalSendTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => setCurrentStep('compose')}
                  className="bg-gradient-to-r from-[#5e6ad2] to-[#abb4dd] hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Continue to Compose →
                </Button>
                <p className="text-xs text-gray-500 text-center">AI will help personalize your message</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderComposeStep = () => (
    <div className="space-y-8">
      {/* Quick Templates */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose a Template</h3>
          <p className="text-gray-600">Start with a proven template or write from scratch</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MESSAGE_TEMPLATES.map((template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer hover:shadow-lg transition-all duration-200 border-2 ${
                selectedTemplate?.id === template.id ? 'border-[#5e6ad2] bg-[#5e6ad2]/5 shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-base text-gray-900">{template.title}</h4>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    🔥 {template.responseRate}% response
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{template.preview}</p>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Message Composer & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Message Composer */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Compose Your Message</h3>
            <p className="text-gray-600">Personalize your message with AI assistance</p>
          </div>
          
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-6">
              <Textarea
                placeholder="Write your message here or select a template above..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="min-h-40 resize-none text-base leading-relaxed"
              />
              
              {/* Personalization Options */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Personalization Options</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={personalizeSettings.useNames}
                        onCheckedChange={(checked) => setPersonalizeSettings(prev => ({ ...prev, useNames: checked }))}
                      />
                      <div>
                        <span className="text-sm font-medium">Use student names</span>
                        <p className="text-xs text-gray-500">Replace [Name] with actual names</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={personalizeSettings.includeSubject}
                        onCheckedChange={(checked) => setPersonalizeSettings(prev => ({ ...prev, includeSubject: checked }))}
                      />
                      <div>
                        <span className="text-sm font-medium">Include subject</span>
                        <p className="text-xs text-gray-500">Replace [Subject] with class subject</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={personalizeSettings.addRecentAchievement}
                        onCheckedChange={(checked) => setPersonalizeSettings(prev => ({ ...prev, addRecentAchievement: checked }))}
                      />
                      <div>
                        <span className="text-sm font-medium">Add achievements</span>
                        <p className="text-xs text-gray-500">Include recent accomplishments</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Stats & Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Characters: <span className="font-medium">{messageContent.length}</span></p>
                  <p>Expected responses: <span className="font-medium text-green-600">~{Math.round(recipients.length * aiInsights.expectedResponseRate / 100)} students</span></p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep('recipients')}
                    className="px-6 py-3"
                    size="lg"
                  >
                    ← Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep('preview')}
                    disabled={!messageContent.trim()}
                    className="bg-[#5e6ad2] hover:bg-[#5e6ad2]/90 px-6 py-3"
                    size="lg"
                  >
                    Preview & Send →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#5e6ad2]" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-[#5e6ad2]/10 to-[#abb4dd]/10 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-[#5e6ad2] mb-3">For {recipients.length} students:</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  {aiInsights.personalizedTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#5e6ad2] mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expected Response Rate</span>
                  <span className="font-semibold text-[#2ed573]">{aiInsights.expectedResponseRate}%</span>
                </div>
                <Progress value={aiInsights.expectedResponseRate} className="h-3" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Best send time:</span>
                  <span className="font-medium">{aiInsights.optimalSendTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Suggested tone:</span>
                  <span className="font-medium capitalize">{aiInsights.suggestedTone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-8">
      {/* Platform Selection */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Delivery Platforms</h3>
          <p className="text-gray-600">Select which platforms to send your message through</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <Card
                key={platform.id}
                className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-lg ${
                  selectedPlatforms.includes(platform.id) 
                    ? 'border-[#5e6ad2] bg-[#5e6ad2]/5 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedPlatforms(prev => 
                    prev.includes(platform.id)
                      ? prev.filter(p => p !== platform.id)
                      : [...prev, platform.id]
                  );
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-gray-700" />
                      <span className="font-semibold text-base">{platform.name}</span>
                    </div>
                    {platform.recommended && (
                      <Badge className="bg-[#2ed573] text-white text-xs">Recommended</Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-medium">{platform.responseRate}% response rate</p>
                    <p>Delivery: {platform.deliveryTime}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Message Preview & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Preview</h3>
            <p className="text-gray-600">How your message will appear to students</p>
          </div>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <pre className="whitespace-pre-wrap text-base text-gray-800 font-sans leading-relaxed">
                  {personalizeMessage(messageContent)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Send Summary</h3>
            <p className="text-gray-600">Review your message details before sending</p>
          </div>
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Recipients:</span>
                  <span className="font-semibold text-lg">{recipients.length} students</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Platforms:</span>
                  <div className="flex gap-1">
                    {selectedPlatforms.map((platformId) => {
                      const platform = PLATFORMS.find(p => p.id === platformId);
                      const Icon = platform?.icon;
                      return Icon ? <Icon key={platformId} className="w-4 h-4 text-gray-600" /> : null;
                    })}
                    <span className="font-semibold ml-2">{selectedPlatforms.length} selected</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Send time:</span>
                  <span className="font-semibold">
                    {scheduleOption === 'now' ? 'Send Now' : 
                     scheduleOption === 'optimal' ? aiInsights.optimalSendTime : 'Custom Schedule'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Expected responses:</span>
                  <span className="font-semibold text-[#2ed573] text-lg">
                    ~{Math.round(recipients.length * aiInsights.expectedResponseRate / 100)} students ({aiInsights.expectedResponseRate}%)
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('compose')}
                  className="w-full py-3"
                  size="lg"
                >
                  ← Edit Message
                </Button>
                <Button
                  onClick={() => {
                    onSendMessage({
                      recipients,
                      content: personalizeMessage(messageContent),
                      platforms: selectedPlatforms,
                      scheduleOption,
                      personalizeSettings
                    });
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-[#5e6ad2] to-[#abb4dd] hover:opacity-90 py-3"
                  size="lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Messages 🚀
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[70vw] h-[90vh] bg-gradient-to-br from-[#ededf4] via-white to-[#f8f9ff] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#5e6ad2]/20 to-[#abb4dd]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#f99325]/20 to-[#2ed573]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#5e6ad2]/5 to-transparent rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
        </div>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#5e6ad2] via-[#7c8adb] to-[#abb4dd] text-white p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#2ed573] rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                  Smart Message Composer
                </h1>
                <p className="text-white/90 mt-2 text-lg">
                  AI-powered messaging that saves time while maintaining personal connection
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Enhanced</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Save 80% Time</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-medium">95% Response Rate</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-2xl p-4 transition-all duration-300 hover:scale-105"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Enhanced Step Indicator */}
        <div className="relative px-12 py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <div className="flex items-center justify-center max-w-4xl mx-auto">
            <div className="flex items-center justify-between w-full">
              {[
                { key: 'recipients', label: 'Select Recipients', icon: Users, description: 'Choose your students' },
                { key: 'compose', label: 'Compose Message', icon: MessageCircle, description: 'Write with AI help' },
                { key: 'preview', label: 'Preview & Send', icon: Send, description: 'Review and deliver' }
              ].map(({ key, label, icon: Icon, description }, index) => (
                <div key={key} className="flex items-center relative group">
                  {/* Step Circle */}
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                      currentStep === key 
                        ? 'bg-gradient-to-br from-[#5e6ad2] to-[#7c8adb] border-[#5e6ad2] text-white shadow-2xl shadow-[#5e6ad2]/30 scale-110' 
                        : index < ['recipients', 'compose', 'preview'].indexOf(currentStep)
                          ? 'bg-gradient-to-br from-[#2ed573] to-[#26d0ce] border-[#2ed573] text-white shadow-lg'
                          : 'border-gray-300 text-gray-400 bg-white/70 hover:bg-white hover:border-gray-400'
                    }`}>
                      {index < ['recipients', 'compose', 'preview'].indexOf(currentStep) ? (
                        <Check className="w-7 h-7 animate-in zoom-in duration-300" />
                      ) : (
                        <Icon className="w-7 h-7" />
                      )}
                    </div>
                    {/* Active pulse animation */}
                    {currentStep === key && (
                      <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-[#5e6ad2]/30 animate-ping"></div>
                    )}
                    {/* Step number badge */}
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      currentStep === key 
                        ? 'bg-white text-[#5e6ad2] shadow-md' 
                        : index < ['recipients', 'compose', 'preview'].indexOf(currentStep)
                          ? 'bg-white text-[#2ed573] shadow-md'
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Step Info */}
                  <div className="ml-4 hidden lg:block">
                    <div className={`font-semibold text-base transition-colors ${
                      currentStep === key ? 'text-[#5e6ad2]' : 'text-gray-700'
                    }`}>
                      {label}
                    </div>
                    <div className={`text-sm transition-colors ${
                      currentStep === key ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {description}
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < 2 && (
                    <div className="flex-1 mx-8 relative">
                      <div className="h-0.5 bg-gray-200 relative">
                        <div 
                          className={`h-0.5 bg-gradient-to-r from-[#5e6ad2] to-[#2ed573] transition-all duration-700 ${
                            index < ['recipients', 'compose', 'preview'].indexOf(currentStep) ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                      {/* Moving dot animation */}
                      {index === ['recipients', 'compose', 'preview'].indexOf(currentStep) - 1 && (
                        <div className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#5e6ad2] rounded-full animate-pulse shadow-lg">
                          <div className="absolute inset-0 w-2 h-2 bg-[#5e6ad2] rounded-full animate-ping opacity-75"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {currentStep === 'recipients' && renderRecipientsStep()}
            {currentStep === 'compose' && renderComposeStep()}
            {currentStep === 'preview' && renderPreviewStep()}
          </div>
        </div>
      </div>
    </div>
  );
};