import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, Check, X, RefreshCw, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAIDescription } from '@/hooks/useAIDescription';
import { DescriptionContext } from '@/services/aiDescriptionService';

interface AIDescriptionButtonProps {
  context: DescriptionContext;
  onApplyDescription: (description: string) => void;
  className?: string;
  variant?: 'button' | 'inline';
  disabled?: boolean;
}

export const AIDescriptionButton: React.FC<AIDescriptionButtonProps> = ({
  context,
  onApplyDescription,
  className,
  variant = 'button',
  disabled = false
}) => {
  const {
    isGenerating,
    generatedDescription,
    confidence,
    generateDescription,
    clearGenerated,
    applyDescription
  } = useAIDescription();

  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = async () => {
    await generateDescription(context);
    if (!showPreview) {
      setShowPreview(true);
    }
  };

  const handleApply = () => {
    console.log('Applying description:', generatedDescription);
    console.log('onApplyDescription callback:', onApplyDescription);
    applyDescription(onApplyDescription);
    // Clear the generated description and hide the preview
    clearGenerated();
    setShowPreview(false);
  };

  const handleClose = () => {
    // Clear the generated description and hide the preview
    clearGenerated();
    setShowPreview(false);
  };

  const handleRegenerate = () => {
    clearGenerated();
    handleGenerate();
  };

  const copyToClipboard = () => {
    if (generatedDescription) {
      navigator.clipboard.writeText(generatedDescription);
    }
  };

  if (variant === 'inline') {
    return (
      <div className={cn("space-y-3", className)}>
        {/* AI Generation Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGenerate}
          disabled={disabled || isGenerating}
          className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </>
          )}
        </Button>

        {/* Generated Description Preview */}
        <AnimatePresence>
          {generatedDescription && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      AI Generated Description
                      {confidence && (
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(confidence * 100)}% confidence
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Textarea
                    value={generatedDescription}
                    readOnly
                    className="min-h-32 bg-white border-purple-200 text-sm resize-none mb-3"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleApply}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Apply This Description
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default button variant
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={disabled || isGenerating}
      className={cn(
        "text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300",
        className
      )}
    >
      {isGenerating ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate with AI
        </>
      )}
    </Button>
  );
};