import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, RotateCcw, Trash2, Wand2, Bot, GraduationCap, Trophy, Star } from 'lucide-react';
import { formatLastSavedDate, getFormMetadata, clearStoredForm } from './utils/storageUtils';
import { useNavigate } from 'react-router-dom';
import { classService } from '@/integrations/api/services/class.service';
import { useAuth } from '@/contexts/AuthContext';
import CardWithCheckIcon from '../profile/CardWithCheckIcon';

interface WelcomeScreenProps {
  draftExists: boolean;
  lastSaved: number;
  onStartNew: (classType?: string) => void;
  onContinueDraft: () => void;
  onDiscardDraft: () => void;
  onStartWithAI?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  draftExists: initialDraftExists,
  lastSaved: initialLastSaved,
  onStartNew,
  onContinueDraft,
  onDiscardDraft,
  onStartWithAI
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [draftExists, setDraftExists] = useState(initialDraftExists);
  const [lastSaved, setLastSaved] = useState(initialLastSaved);
  const lastSavedText = formatLastSavedDate(lastSaved);

  // Verify draft on component mount
  useEffect(() => {
    const verifyDraftWithBackend = async () => {
      if (initialDraftExists) {
        const metadata = getFormMetadata();
        if (metadata.classId && user?.teacherId) {
          try {
            // Check if class exists in backend
            const { data, error } = await classService.getById(metadata.classId);

            if (error || !data) {
              console.log("Draft class no longer exists in backend, clearing");
              clearStoredForm();
              setDraftExists(false);
              setLastSaved(0);
            } else {
              console.log("Verified draft class exists in backend:", data.id);
            }
          } catch (err) {
            console.error("Error verifying draft class:", err);
          }
        }
      }
    };

    verifyDraftWithBackend();
  }, [initialDraftExists, user?.teacherId]);

  const handleContinueDraft = () => {
    const metadata = getFormMetadata();
    if (metadata.classId) {
      // Navigate to the class setup page with the class ID
      navigate(`/teacher-class-setup/${metadata.classId}`);
    } else {
      // If no class ID is found, just call the original handler
      onContinueDraft();
    }
  };

  const handleDiscardDraft = async () => {
    const metadata = getFormMetadata();
    if (metadata.classId) {
      try {
        // Delete the class from the backend
        await classService.delete(metadata.classId);
        console.log(`Class ${metadata.classId} deleted from backend`);
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    }

    // Clear local storage and call original handler
    clearStoredForm();
    onDiscardDraft();
  };
  
  return (
    <div className="container max-w-6xl px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Create a New Class</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose your class type and let us guide you through the setup process. Your progress will be automatically saved.
        </p>
      </div>

      {/* Draft Notice */}
      {draftExists && (
        <div className="mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">You have a draft in progress</p>
                    <p className="text-sm text-blue-700">Last edited: {lastSavedText}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleContinueDraft}
                    variant="default"
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Continue Draft
                  </Button>
                  <Button
                    onClick={handleDiscardDraft}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Discard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Class Type Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Academic Classes Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow border-kidato-blue-200 relative">
          {/* Favorite Halo */}
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-kidato-orange to-kidato-orange-400 rounded-full p-2 shadow-lg z-10">
            <Star className="h-4 w-4 text-white fill-current" />
          </div>
          <div className="absolute -top-3 -right-3 bg-kidato-orange-200 rounded-full w-8 h-8 opacity-30 animate-pulse"></div>
          
          <CardHeader className="pb-3 bg-gradient-to-r from-kidato-blue-50 to-kidato-purple-50 border-b border-kidato-blue-100">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-kidato-blue" />
              <CardTitle className="text-xl text-kidato-blue-800">Academic Classes</CardTitle>
              <span className="text-xs bg-kidato-orange-100 text-kidato-orange-800 px-2 py-1 rounded-full font-medium">Most Popular</span>
            </div>
            <CardDescription className="text-kidato-blue-600">
              Create formal curriculum-based classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CardWithCheckIcon>
                <span className="font-medium text-gray-900">Curriculum-aligned content</span>
                <p className="text-sm text-gray-600">Math, Science, Languages, History, and more</p>
              </CardWithCheckIcon>
              <CardWithCheckIcon>
                <span className="font-medium text-gray-900">Structured lesson plans</span>
                <p className="text-sm text-gray-600">Grade-specific learning objectives</p>
              </CardWithCheckIcon>
              <CardWithCheckIcon>
                <span className="font-medium text-gray-900">Assessment tools</span>
                <p className="text-sm text-gray-600">Quizzes, assignments, and progress tracking</p>
              </CardWithCheckIcon>
            </div>
          </CardContent>
          <CardFooter className="border-t border-kidato-blue-100 pt-4">
            <Button 
              onClick={() => onStartNew('academic')} 
              className="w-full bg-gradient-to-r from-kidato-blue to-kidato-purple hover:from-kidato-blue-600 hover:to-kidato-purple-600"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Create Academic Class
            </Button>
          </CardFooter>
        </Card>

        {/* After-School Classes Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow border-kidato-orange-200">
          <CardHeader className="pb-3 bg-gradient-to-r from-kidato-orange-50 to-orange-50 border-b border-kidato-orange-100">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-kidato-orange" />
              <CardTitle className="text-xl text-kidato-orange-800">After-School Classes</CardTitle>
            </div>
            <CardDescription className="text-kidato-orange-600">
              Extracurricular and enrichment activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CardWithCheckIcon>
                <span className="font-medium text-gray-900">Skills & hobbies</span>
                <p className="text-sm text-gray-600">Arts, sports, music, coding, and crafts</p>
              </CardWithCheckIcon>
              <CardWithCheckIcon>
                <span className="font-medium text-gray-900">Flexible scheduling</span>
                <p className="text-sm text-gray-600">Workshops, camps, and ongoing programs</p>
              </CardWithCheckIcon>
              <CardWithCheckIcon>
                <span className="font-medium text-gray-900">Creative projects</span>
                <p className="text-sm text-gray-600">Portfolio building and showcases</p>
              </CardWithCheckIcon>
            </div>
          </CardContent>
          <CardFooter className="border-t border-kidato-orange-100 pt-4">
            <Button 
              onClick={() => onStartNew('afterschool')} 
              className="w-full bg-gradient-to-r from-kidato-orange to-kidato-orange-400 hover:from-kidato-orange-600 hover:to-kidato-orange-500"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Create After-School Class
            </Button>
          </CardFooter>
        </Card>

        {/* AI-Assisted Creation Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-xl">AI-Assisted Creation</CardTitle>
            </div>
            <CardDescription>
              Let AI help design your class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CardWithCheckIcon>
                <span className="font-medium text-gray-900">Smart content generation</span>
                <p className="text-sm text-gray-600">Descriptions, objectives, and outlines</p>
              </CardWithCheckIcon>
              <CardWithCheckIcon>
                <span className="font-medium text-gray-900">Automated lesson plans</span>
                <p className="text-sm text-gray-600">Tailored to your subject and level</p>
              </CardWithCheckIcon>
              <CardWithCheckIcon>
                <span className="font-medium text-gray-900">Personalized suggestions</span>
                <p className="text-sm text-gray-600">Activities, resources, and assessments</p>
              </CardWithCheckIcon>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-700 font-medium mb-1">✨ Pro Tip</p>
              <p className="text-xs text-purple-600">
                Just describe your class idea and let AI create the complete structure!
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button 
              onClick={onStartWithAI}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Start with AI Helper
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeScreen;