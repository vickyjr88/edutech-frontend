import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Clock, RotateCcw, Trash2, CheckCircle, BookOpen } from 'lucide-react';
import { formatLastSavedDate, getFormMetadata, clearStoredForm } from './utils/storageUtils';
import { useNavigate } from 'react-router-dom';
import { classService } from '@/integrations/api/services/class.service';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeScreenProps {
  draftExists: boolean;
  lastSaved: number;
  onStartNew: () => void;
  onContinueDraft: () => void;
  onDiscardDraft: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  draftExists: initialDraftExists,
  lastSaved: initialLastSaved,
  onStartNew,
  onContinueDraft,
  onDiscardDraft
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
              console.log("Verified draft class exists in backend:", data._id);
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
    <div className="container max-w-4xl px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Create a New Class</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Set up your class with a step-by-step wizard. Your progress will be automatically saved so you can return anytime.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2 text-blue-500" />
              Start Fresh
            </CardTitle>
            <CardDescription>
              Create a brand new class from scratch
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-sm">Start with a blank form</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-sm">Get guided through the setup process</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-sm">Create lesson plans, schedules and more</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="border-t pt-4 pb-4 px-6">
            <Button 
              onClick={onStartNew} 
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Class
            </Button>
          </CardFooter>
        </Card>
        
        {draftExists ? (
          <Card className="shadow-sm hover:shadow-md transition-shadow border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="flex items-center">
                <RotateCcw className="h-5 w-5 mr-2 text-blue-600" />
                Continue Draft
              </CardTitle>
              <CardDescription className="flex items-center text-blue-700">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Last edited: {lastSavedText}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm mb-4 text-blue-800">
                You have a draft in progress. You can continue where you left off or start a new class.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleContinueDraft}
                  className="w-full"
                  variant="default"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Continue Draft
                </Button>
                <Button
                  onClick={handleDiscardDraft}
                  className="w-full"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Discard Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-gray-500" />
                Templates & Examples
              </CardTitle>
              <CardDescription>
                Start with a pre-built template
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-2 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-500">Math Class Template (Coming Soon)</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-2 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-500">Science Class Template (Coming Soon)</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-2 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-500">Language Arts Class (Coming Soon)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="border-t pt-4 pb-4 px-6">
              <Button 
                disabled
                variant="outline"
                className="w-full opacity-60"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;