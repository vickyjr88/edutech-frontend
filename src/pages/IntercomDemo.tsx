import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageCircle, 
  HelpCircle, 
  Phone, 
  Users, 
  GraduationCap, 
  BookOpen,
  Star,
  CheckCircle
} from 'lucide-react';
import { 
  IntercomLauncher, 
  IntercomMessageButton, 
  IntercomContactButton,
  IntercomFloatingButton,
  useIntercom 
} from '@/components/support';
import { useIntercomTracking } from '@/hooks/useIntercomTracking';

const IntercomDemo = () => {
  const { isLoaded, show, showMessages, showNewMessage, trackEvent } = useIntercom();
  const { 
    trackStudentEvent, 
    trackParentEvent, 
    trackTeacherEvent, 
    trackPlatformEvent,
    trackSupportEvent 
  } = useIntercomTracking();
  
  const [selectedRole, setSelectedRole] = useState<'student' | 'parent' | 'teacher'>('student');

  const handleRoleSpecificAction = (action: string) => {
    switch (selectedRole) {
      case 'student':
        switch (action) {
          case 'enroll':
            trackStudentEvent.enrollInClass('class_123', 'Advanced Mathematics', 'Dr. Smith');
            break;
          case 'complete':
            trackStudentEvent.completeLesson('lesson_456', 'Algebra Basics', 45);
            break;
          case 'submit':
            trackStudentEvent.submitAssignment('assign_789', 'Math Homework', 'document');
            break;
        }
        break;
      
      case 'parent':
        switch (action) {
          case 'progress':
            trackParentEvent.viewChildProgress('child_123', 'Emma Johnson', 'weekly_report');
            break;
          case 'meeting':
            trackParentEvent.scheduleMeeting('teacher_456', 'Ms. Wilson', 'parent_conference');
            break;
          case 'payment':
            trackParentEvent.updatePayment('credit_card', 199.99);
            break;
        }
        break;
      
      case 'teacher':
        switch (action) {
          case 'create':
            trackTeacherEvent.createClass('class_789', 'Biology 101', 'Science');
            break;
          case 'publish':
            trackTeacherEvent.publishLesson('lesson_123', 'Cell Structure', 'class_789');
            break;
          case 'grade':
            trackTeacherEvent.gradeAssignment('assign_456', 'student_789', 85);
            break;
        }
        break;
    }
  };

  const roleData = {
    student: {
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      actions: [
        { key: 'enroll', label: 'Enroll in Class', description: 'Track class enrollment' },
        { key: 'complete', label: 'Complete Lesson', description: 'Track lesson completion' },
        { key: 'submit', label: 'Submit Assignment', description: 'Track assignment submission' }
      ],
      features: [
        'Live class participation tracking',
        'Assignment completion monitoring',
        'Achievement unlock notifications',
        'Learning progress insights'
      ]
    },
    parent: {
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      actions: [
        { key: 'progress', label: 'View Child Progress', description: 'Track progress viewing' },
        { key: 'meeting', label: 'Schedule Meeting', description: 'Track meeting scheduling' },
        { key: 'payment', label: 'Update Payment', description: 'Track payment updates' }
      ],
      features: [
        'Child progress monitoring',
        'Teacher communication tracking',
        'Billing and payment insights',
        'Family engagement metrics'
      ]
    },
    teacher: {
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      actions: [
        { key: 'create', label: 'Create Class', description: 'Track class creation' },
        { key: 'publish', label: 'Publish Lesson', description: 'Track lesson publishing' },
        { key: 'grade', label: 'Grade Assignment', description: 'Track grading activity' }
      ],
      features: [
        'Class creation and management',
        'Student engagement tracking',
        'Earnings and payment monitoring',
        'Teaching effectiveness insights'
      ]
    }
  };

  const currentRole = roleData[selectedRole];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Intercom Integration Demo</h1>
          <p className="text-muted-foreground">
            Role-specific customer support and user tracking for Learniverse
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant={isLoaded ? "default" : "secondary"}>
              {isLoaded ? "Intercom Loaded" : "Loading..."}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Role Selection & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role-Based Interaction</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="parent">Parent</TabsTrigger>
                    <TabsTrigger value="teacher">Teacher</TabsTrigger>
                  </TabsList>

                  <TabsContent value={selectedRole} className="mt-6">
                    <div className={`p-4 rounded-lg ${currentRole.bgColor} mb-4`}>
                      <div className="flex items-center gap-3">
                        <currentRole.icon className={`h-6 w-6 ${currentRole.color}`} />
                        <div>
                          <h3 className="font-medium capitalize">{selectedRole} Dashboard</h3>
                          <p className="text-sm text-muted-foreground">
                            Role-specific tracking and support features
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Track Events</h4>
                      {currentRole.actions.map((action) => (
                        <div key={action.key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{action.label}</div>
                            <div className="text-sm text-muted-foreground">{action.description}</div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleRoleSpecificAction(action.key)}
                            disabled={!isLoaded}
                          >
                            Track
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Role Features</h4>
                      <div className="space-y-2">
                        {currentRole.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Support Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Support Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <IntercomLauncher 
                    variant="default" 
                    text="Help Center"
                    className="w-full"
                  />
                  <IntercomMessageButton 
                    variant="default"
                    text="Messages"
                    className="w-full"
                  />
                </div>
                
                <IntercomContactButton 
                  variant="default"
                  text="Contact Support"
                  className="w-full"
                />

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Direct Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => show()}
                      disabled={!isLoaded}
                      className="w-full"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Show Widget
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => showMessages()}
                      disabled={!isLoaded}
                      className="w-full"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Show Messages
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => showNewMessage('I need help with my account')}
                    disabled={!isLoaded}
                    className="w-full mt-3"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Start New Conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integration Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Star className="h-4 w-4" />
                  <AlertDescription>
                    Role-based user segmentation with custom attributes for personalized support experiences.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Student Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Class enrollment tracking</li>
                      <li>• Learning progress monitoring</li>
                      <li>• Assignment submission alerts</li>
                      <li>• Achievement notifications</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Parent Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Child progress monitoring</li>
                      <li>• Billing and payment support</li>
                      <li>• Teacher communication</li>
                      <li>• Report generation</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Teacher Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Class management support</li>
                      <li>• Student engagement insights</li>
                      <li>• Earnings tracking</li>
                      <li>• Platform feature assistance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <strong>Automatic tracking includes:</strong>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• User role identification</li>
                    <li>• Platform section tracking</li>
                    <li>• Feature usage analytics</li>
                    <li>• Support interaction history</li>
                    <li>• Custom event attribution</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating Support Button */}
        <IntercomFloatingButton 
          position="bottom-right"
          variant="help"
          size="md"
        />
      </div>
    </div>
  );
};

export default IntercomDemo;