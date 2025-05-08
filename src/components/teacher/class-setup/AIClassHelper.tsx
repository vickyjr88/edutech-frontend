import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Bot, BookOpen, Check, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIClassHelperProps {
  onApplyChanges: (changes: {
    title?: string;
    description?: string;
    objectives?: string;
    lessonPlans?: Array<{
      id: string;
      title: string;
      description: string;
      duration?: string;
    }>
  }) => void;
  initialPrompt?: string;
}

// Sample class suggestions
const classSuggestions = [
  "A creative writing workshop for middle school students",
  "An introduction to robotics and coding for elementary students",
  "Math tutoring focused on algebra for high school students",
  "Science experiments you can do at home for grades 3-5",
  "Public speaking and debate skills for high schoolers",
  "Learn to play piano - beginner level for ages 8-12",
  "Spanish language immersion for elementary students",
  "Digital art and graphic design for teens",
  "Environmental science and sustainability for grades 6-8"
];

// Sample AI-generated responses
const aiResponses = {
  writing: {
    title: "Creative Writing Workshop: Finding Your Voice",
    description: "This interactive workshop helps middle school students discover their unique writing voice through engaging exercises, constructive feedback, and collaborative storytelling. Students will explore various writing styles, learn literary techniques, and create their own short stories and poems in a supportive environment.",
    objectives: "By the end of this class, students will be able to:\n- Identify and apply literary techniques in their writing\n- Develop compelling characters and plotlines\n- Give and receive constructive feedback\n- Complete at least two original creative pieces\n- Present their work with confidence",
    lessonPlans: [
      {
        id: "ai-lesson-1",
        title: "Finding Inspiration: The Writer's Eye",
        description: "Students learn to observe the world like writers, finding inspiration in everyday experiences. Activities include sensory observation exercises, free writing from visual prompts, and discussion of what inspires published authors.",
        duration: "60 minutes"
      },
      {
        id: "ai-lesson-2",
        title: "Character Development Workshop",
        description: "Students learn techniques for creating memorable characters. Activities include character profile worksheets, role-playing exercises, and writing dialogue between original characters.",
        duration: "60 minutes"
      },
      {
        id: "ai-lesson-3",
        title: "Plot Structure and Storytelling",
        description: "Students explore the elements of compelling plots. Activities include analyzing plot structures in famous stories, collaborative story mapping, and beginning their own short story outlines.",
        duration: "60 minutes"
      },
      {
        id: "ai-lesson-4",
        title: "Editing Workshop and Peer Review",
        description: "Students learn the art of revision and constructive feedback. Activities include editing techniques, peer review sessions, and finalizing their creative pieces.",
        duration: "60 minutes"
      },
      {
        id: "ai-lesson-5",
        title: "Showcase and Celebration",
        description: "Students share their completed works with the class. Activities include short readings, positive feedback sessions, and discussion of future writing goals.",
        duration: "60 minutes"
      }
    ]
  },
  robotics: {
    title: "Robots & Code: Introduction to Programming for Kids",
    description: "This hands-on course introduces elementary students to the exciting world of robotics and coding. Through playful activities and engaging challenges, students will learn basic programming concepts, build simple robots, and develop problem-solving skills in a collaborative environment.",
    objectives: "By the end of this class, students will be able to:\n- Understand basic programming concepts (sequences, loops, conditionals)\n- Build and program simple robots to perform tasks\n- Debug common programming problems\n- Work collaboratively on technical challenges\n- Present a final robotics project to classmates",
    lessonPlans: [
      {
        id: "ai-lesson-1",
        title: "Introduction to Robotics and Programming",
        description: "Students learn what robots are and how they work. Activities include unplugged coding games, introduction to the robotics kits, and basic movement commands.",
        duration: "60 minutes"
      },
      {
        id: "ai-lesson-2",
        title: "Programming Sequences and Loops",
        description: "Students learn to create sequences of commands and repeat them efficiently with loops. Activities include robot maze challenges and pattern creation exercises.",
        duration: "60 minutes"
      },
      {
        id: "ai-lesson-3",
        title: "Sensors and Conditional Statements",
        description: "Students learn how robots sense the world and make decisions. Activities include programming robots to respond to light, touch, and distance sensors.",
        duration: "60 minutes"
      },
      {
        id: "ai-lesson-4",
        title: "Building a Robot Helper",
        description: "Students design and build a robot that can help solve a real-world problem. Activities include brainstorming, designing, building, and initial programming.",
        duration: "60 minutes"
      },
      {
        id: "ai-lesson-5",
        title: "Robot Showcase and Challenges",
        description: "Students complete their robot helpers and demonstrate them to the class. Activities include friendly competitions, problem-solving challenges, and reflection on the learning journey.",
        duration: "60 minutes"
      }
    ]
  }
};

const AIClassHelper: React.FC<AIClassHelperProps> = ({ onApplyChanges, initialPrompt = '' }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [appliedChanges, setAppliedChanges] = useState<string[]>([]);

  const generateClassContent = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with sample data
    setTimeout(() => {
      if (prompt.toLowerCase().includes('writing') || selectedSuggestion?.toLowerCase().includes('writing')) {
        setAiResponse(aiResponses.writing);
      } else {
        setAiResponse(aiResponses.robotics);
      }
      setIsGenerating(false);
    }, 1500);
  };

  const handleApplyChange = (changeType: string) => {
    if (!aiResponse) return;
    
    switch (changeType) {
      case 'title':
        onApplyChanges({ title: aiResponse.title });
        break;
      case 'description':
        onApplyChanges({ description: aiResponse.description });
        break;
      case 'objectives':
        onApplyChanges({ objectives: aiResponse.objectives });
        break;
      case 'lessonPlans':
        onApplyChanges({ lessonPlans: aiResponse.lessonPlans });
        break;
      case 'all':
        onApplyChanges({
          title: aiResponse.title,
          description: aiResponse.description,
          objectives: aiResponse.objectives,
          lessonPlans: aiResponse.lessonPlans
        });
        break;
    }
    
    if (!appliedChanges.includes(changeType)) {
      setAppliedChanges([...appliedChanges, changeType]);
    }
  };

  return (
    <Card className="shadow-sm border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 pb-4">
        <CardTitle className="flex items-center text-blue-900">
          <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
          AI Class Creator
        </CardTitle>
        <CardDescription>
          Let AI help you create your class content quickly and easily
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          {!aiResponse ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1.5">Describe your class idea</label>
                <Textarea
                  placeholder="e.g., I want to create a creative writing workshop for middle school students..."
                  className="min-h-[100px] border-blue-200"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            
              <div>
                <label className="block text-sm font-medium mb-1.5">Or choose from suggestions:</label>
                <div className="flex flex-wrap gap-2">
                  {classSuggestions.slice(0, 5).map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border-blue-200 text-sm",
                        selectedSuggestion === suggestion && "bg-blue-50 border-blue-300"
                      )}
                      onClick={() => {
                        setSelectedSuggestion(suggestion);
                        setPrompt(suggestion);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">Class Title</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant={appliedChanges.includes('title') ? "outline" : "default"}
                    className={cn(
                      "h-7 text-xs",
                      appliedChanges.includes('title') ? "bg-green-50 text-green-700 border-green-200" : ""
                    )}
                    onClick={() => handleApplyChange('title')}
                    disabled={appliedChanges.includes('title')}
                  >
                    {appliedChanges.includes('title') ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Applied
                      </>
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
                <p className="text-gray-700 mt-1 p-3 bg-blue-50 rounded-md">{aiResponse.title}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">Description</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant={appliedChanges.includes('description') ? "outline" : "default"}
                    className={cn(
                      "h-7 text-xs",
                      appliedChanges.includes('description') ? "bg-green-50 text-green-700 border-green-200" : ""
                    )}
                    onClick={() => handleApplyChange('description')}
                    disabled={appliedChanges.includes('description')}
                  >
                    {appliedChanges.includes('description') ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Applied
                      </>
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
                <p className="text-gray-700 mt-1 p-3 bg-blue-50 rounded-md">{aiResponse.description}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">Objectives</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant={appliedChanges.includes('objectives') ? "outline" : "default"}
                    className={cn(
                      "h-7 text-xs",
                      appliedChanges.includes('objectives') ? "bg-green-50 text-green-700 border-green-200" : ""
                    )}
                    onClick={() => handleApplyChange('objectives')}
                    disabled={appliedChanges.includes('objectives')}
                  >
                    {appliedChanges.includes('objectives') ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Applied
                      </>
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
                <pre className="text-gray-700 mt-1 p-3 bg-blue-50 rounded-md whitespace-pre-wrap font-sans">{aiResponse.objectives}</pre>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">Lesson Plans ({aiResponse.lessonPlans.length})</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant={appliedChanges.includes('lessonPlans') ? "outline" : "default"}
                    className={cn(
                      "h-7 text-xs",
                      appliedChanges.includes('lessonPlans') ? "bg-green-50 text-green-700 border-green-200" : ""
                    )}
                    onClick={() => handleApplyChange('lessonPlans')}
                    disabled={appliedChanges.includes('lessonPlans')}
                  >
                    {appliedChanges.includes('lessonPlans') ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Applied
                      </>
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {aiResponse.lessonPlans.slice(0, 3).map((lesson: any, index: number) => (
                    <div key={lesson.id} className="p-3 bg-blue-50 rounded-md">
                      <p className="font-medium">{index + 1}. {lesson.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{lesson.description.substring(0, 100)}...</p>
                    </div>
                  ))}
                  {aiResponse.lessonPlans.length > 3 && (
                    <div className="text-center text-sm text-gray-500 pt-1">
                      +{aiResponse.lessonPlans.length - 3} more lessons
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        {!aiResponse ? (
          <Button
            type="button"
            variant="default"
            className="ml-auto"
            disabled={isGenerating || (!prompt && !selectedSuggestion)}
            onClick={generateClassContent}
          >
            {isGenerating ? (
              <>
                <motion.div 
                  className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                ></motion.div>
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Class Content
              </>
            )}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={() => {
                setAiResponse(null);
                setAppliedChanges([]);
              }}
            >
              <Trash className="h-4 w-4 mr-1.5" />
              Reset
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              className={cn(
                appliedChanges.includes('all') ? "bg-green-600 hover:bg-green-700" : ""
              )}
              onClick={() => handleApplyChange('all')}
              disabled={appliedChanges.includes('all')}
            >
              {appliedChanges.includes('all') ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  All Content Applied
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Apply All Content
                </>
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIClassHelper;