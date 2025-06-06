import { useState } from 'react';
import { toast } from 'sonner';
import { AIDescriptionService, DescriptionContext, GeneratedDescription } from '@/services/aiDescriptionService';

interface UseAIDescriptionReturn {
  isGenerating: boolean;
  generatedDescription: string | null;
  confidence: number | null;
  generateDescription: (context: DescriptionContext) => Promise<void>;
  clearGenerated: () => void;
  applyDescription: (onApply: (description: string) => void) => void;
}

/**
 * Hook for managing AI-powered description generation
 */
export const useAIDescription = (): UseAIDescriptionReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const generateDescription = async (context: DescriptionContext) => {
    // Validate that we have enough context
    if (!context.title && !context.subject) {
      toast.error('Please provide at least a class title or subject before generating a description');
      return;
    }

    setIsGenerating(true);
    setGeneratedDescription(null);
    setConfidence(null);

    // Show loading toast for longer operations
    const loadingToast = toast.loading('AI is crafting your class description...', {
      duration: 30000 // 30 seconds max
    });

    try {
      const result: GeneratedDescription = await AIDescriptionService.generateDescription(context);
      
      setGeneratedDescription(result.description);
      setConfidence(result.confidence);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success toast
      toast.success('Description generated successfully! Review and apply if you like it.', {
        duration: 5000
      });
      
    } catch (error) {
      console.error('Error generating description:', error);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show error toast
      toast.error('Failed to generate description. Please try again or write one manually.', {
        duration: 5000
      });
      
      setGeneratedDescription(null);
      setConfidence(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearGenerated = () => {
    setGeneratedDescription(null);
    setConfidence(null);
  };

  const applyDescription = (onApply: (description: string) => void) => {
    console.log('applyDescription called with:', generatedDescription);
    console.log('onApply function:', onApply);
    if (generatedDescription) {
      onApply(generatedDescription);
      console.log('Applied description:', generatedDescription);
      toast.success('Description applied to your class!');
      // Keep the generated description visible in case they want to revert
    } else {
      console.log('No generated description to apply');
      toast.error('No description to apply');
    }
  };

  return {
    isGenerating,
    generatedDescription,
    confidence,
    generateDescription,
    clearGenerated,
    applyDescription
  };
};