
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, PlusCircle, Sparkles, Bot, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import AIClassHelper from "../AIClassHelper";

export interface EmptyStateProps {
  onAddLesson: () => void;
  onApplyAIContent?: (changes: {
    lessonPlans?: Array<{
      id: string;
      title: string;
      description: string;
      duration?: string;
    }>
  }) => void;
}

export const EmptyState = ({ onAddLesson, onApplyAIContent }: EmptyStateProps) => {
  const [showAIHelper, setShowAIHelper] = useState(false);

  const handleApplyAIChanges = (changes: any) => {
    if (onApplyAIContent && changes.lessonPlans) {
      onApplyAIContent(changes);
      setShowAIHelper(false);
    }
  };

  if (showAIHelper) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">AI Lesson Plan Creator</h3>
          <Button 
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => setShowAIHelper(false)}
          >
            Back to Manual Creation
          </Button>
        </div>
        <AIClassHelper 
          onApplyChanges={handleApplyAIChanges}
          initialPrompt="Create lesson plans for my class"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Nudge Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-blue-900">Get AI-Powered Lesson Plans</CardTitle>
            <CardDescription className="text-blue-700">
              Save hours of planning! Let AI create comprehensive lesson plans tailored to your class topic and student level.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-blue-600">
              <div className="flex items-center">
                <Bot className="h-4 w-4 mr-1.5" />
                AI-Generated Content
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1.5" />
                Multiple Lessons
              </div>
              <div className="flex items-center">
                <Wand2 className="h-4 w-4 mr-1.5" />
                Instant Creation
              </div>
            </div>
            <Button
              type="button"
              onClick={() => setShowAIHelper(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Create with AI
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Manual Creation Option */}
      <div className="text-center py-6">
        <BookOpen className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        <h3 className="text-sm font-medium text-gray-900 mb-2">Create Manually</h3>
        <p className="text-sm text-gray-500 mb-4">Start from scratch and build your lesson plans step by step</p>
        <Button
          type="button" 
          onClick={onAddLesson}
          variant="outline"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add First Lesson
        </Button>
      </div>
    </div>
  );
};
