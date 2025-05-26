import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  BookOpen, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  X, 
  CheckCircle2,
  Loader2,
  Star,
  Users
} from 'lucide-react';
import { teacherService, ClassRecommendation } from '@/integrations/api/services/teacher.service';
import { useToast } from '@/hooks/use-toast';

interface RecommendedClassesProps {
  onCreateClass?: (recommendation: ClassRecommendation) => void;
}

const RecommendedClasses: React.FC<RecommendedClassesProps> = ({ onCreateClass }) => {
  const [recommendations, setRecommendations] = useState<ClassRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await teacherService.getPendingRecommendations();
      if (!error && data) {
        const recommendationsArray = Array.isArray(data) ? data : [];
        setRecommendations(recommendationsArray);
        
        // If no recommendations found, try to generate some
        if (recommendationsArray.length === 0) {
          await generateRecommendations();
        }
      } else {
        // If API call fails, try to generate recommendations
        await generateRecommendations();
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // If fetching fails, try to generate recommendations
      await generateRecommendations();
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await teacherService.generateRecommendations();
      if (!error && data) {
        const recommendationsArray = Array.isArray(data) ? data : [];
        setRecommendations(recommendationsArray);
        
        if (recommendationsArray.length > 0) {
          toast({
            title: "New recommendations generated!",
            description: `Found ${recommendationsArray.length} class recommendations for you.`,
          });
        } else {
          toast({
            title: "No recommendations available",
            description: "Complete your teacher profile to get personalized class recommendations.",
          });
        }
      } else {
        toast({
          title: "Unable to generate recommendations",
          description: "Please ensure your teacher profile is complete and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error generating recommendations",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdopt = async (recommendation: ClassRecommendation) => {
    try {
      // For now, we'll just dismiss since class creation is handled elsewhere
      if (onCreateClass) {
        onCreateClass(recommendation);
      }
      
      // Remove from recommendations list
      setRecommendations(prev => prev.filter(r => r._id !== recommendation._id));
      
      toast({
        title: "Class recommendation adopted!",
        description: `"${recommendation.title}" has been added to your class creation flow.`,
      });
    } catch (error) {
      console.error('Error adopting recommendation:', error);
      toast({
        title: "Error adopting recommendation",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDismiss = async (recommendation: ClassRecommendation, reason?: string) => {
    try {
      await teacherService.dismissRecommendation(recommendation._id, reason);
      setRecommendations(prev => prev.filter(r => r._id !== recommendation._id));
      
      toast({
        title: "Recommendation dismissed",
        description: "We'll use this feedback to improve future recommendations.",
      });
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
      toast({
        title: "Error dismissing recommendation",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <Card className="border-t-4 border-t-kidato-orange">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Sparkles className="mr-2 h-5 w-5 text-kidato-orange" />
            AI-Recommended Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-kidato-orange" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-t-4 border-t-kidato-orange">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <Sparkles className="mr-2 h-5 w-5 text-kidato-orange" />
          AI-Recommended Classes
        </CardTitle>
        <CardDescription>
          Personalized class suggestions based on your expertise and teaching profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!Array.isArray(recommendations) || recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-kidato-orange-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No recommendations yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get AI-powered class recommendations tailored to your teaching expertise and profile. Complete your teacher profile for better recommendations.
            </p>
            <Button 
              onClick={generateRecommendations}
              disabled={isGenerating}
              className="bg-kidato-orange hover:bg-kidato-orange-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Recommendations
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(recommendations) && recommendations.map((recommendation) => (
              <div
                key={recommendation._id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                        <Badge variant="secondary" className="bg-kidato-orange-100 text-kidato-orange-dark">
                          {recommendation.confidence}% match
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{recommendation.summary}</p>
                      
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {recommendation.subject}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {recommendation.gradeLevel}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {recommendation.numberOfLessons} lessons
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          ${recommendation.suggestedPrice}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(recommendation)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {expandedCard === recommendation._id && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium text-gray-800 mb-3">Lesson Plans Preview</h5>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {Array.isArray(recommendation.lessonPlans) && recommendation.lessonPlans.slice(0, 3).map((lesson, index) => (
                          <div key={index} className="bg-gray-50 rounded p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h6 className="font-medium text-sm">{lesson.title}</h6>
                              <span className="text-xs text-gray-500">{lesson.duration} min</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {Array.isArray(lesson.objectives) ? lesson.objectives.join(', ') : ''}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(lesson.activities) && lesson.activities.slice(0, 2).map((activity, actIndex) => (
                                <Badge key={actIndex} variant="outline" className="text-xs">
                                  {activity}
                                </Badge>
                              ))}
                              {Array.isArray(lesson.activities) && lesson.activities.length > 2 && (
                                <span className="text-xs text-gray-500">+{lesson.activities.length - 2} more</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {Array.isArray(recommendation.lessonPlans) && recommendation.lessonPlans.length > 3 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{recommendation.lessonPlans.length - 3} more lessons...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedCard(
                        expandedCard === recommendation._id ? null : recommendation._id
                      )}
                    >
                      {expandedCard === recommendation._id ? 'Show Less' : 'View Details'}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                    
                    <Button
                      onClick={() => handleAdopt(recommendation)}
                      className="bg-kidato-purple hover:bg-kidato-purple-600"
                      size="sm"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Create This Class
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-4">
              <Button 
                variant="outline"
                onClick={generateRecommendations}
                disabled={isGenerating}
                className="border-kidato-orange-200 hover:bg-kidato-orange-50 text-kidato-orange-dark"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get More Recommendations
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedClasses;