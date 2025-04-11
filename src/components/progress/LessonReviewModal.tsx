
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Check,
  Star,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  MessageSquare,
  Smile,
  Frown,
  Meh,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface LessonReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  lessonId: string;
}

interface ReviewQuestion {
  id: string;
  question: string;
  type: "emoji" | "rating" | "thumbs" | "text";
  answer: any;
}

const LessonReviewModal = ({
  isOpen,
  onClose,
  lessonTitle,
  lessonId,
}: LessonReviewModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [reviewData, setReviewData] = useState<ReviewQuestion[]>([
    {
      id: "understood",
      question: "Did you understand today's lesson?",
      type: "emoji",
      answer: null,
    },
    {
      id: "enjoyed",
      question: "Did you enjoy the lesson?",
      type: "thumbs",
      answer: null,
    },
    {
      id: "favorite",
      question: "What was your favorite part?",
      type: "text",
      answer: "",
    },
    {
      id: "rating",
      question: "How would you rate this lesson?",
      type: "rating",
      answer: null,
    },
  ]);

  const handleAnswer = (value: any) => {
    const updatedReviewData = [...reviewData];
    updatedReviewData[step].answer = value;
    setReviewData(updatedReviewData);

    if (step < reviewData.length - 1) {
      setStep(step + 1);
    } else {
      submitReview();
    }
  };

  const submitReview = () => {
    // In a real app, this would send the data to an API
    console.log("Review submitted:", reviewData);
    toast({
      title: "Review Submitted!",
      description: "Thank you for sharing your thoughts about the lesson!",
      duration: 3000,
    });
    onClose();
    setStep(0);
    // Reset answers for next time
    setReviewData(reviewData.map(q => ({ ...q, answer: null })));
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const currentQuestion = reviewData[step];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
            Lesson Review
          </DialogTitle>
          <DialogDescription>
            Tell us what you thought about "{lessonTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-center mb-6">
              {currentQuestion?.question}
            </h3>

            {currentQuestion?.type === "emoji" && (
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => handleAnswer("understood")}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Smile
                    className={cn(
                      "h-12 w-12 mb-2",
                      currentQuestion.answer === "understood"
                        ? "text-green-500"
                        : "text-gray-400"
                    )}
                  />
                  <span>Yes, I get it!</span>
                </button>
                <button
                  onClick={() => handleAnswer("somewhat")}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Meh
                    className={cn(
                      "h-12 w-12 mb-2",
                      currentQuestion.answer === "somewhat"
                        ? "text-yellow-500"
                        : "text-gray-400"
                    )}
                  />
                  <span>Kind of</span>
                </button>
                <button
                  onClick={() => handleAnswer("confused")}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Frown
                    className={cn(
                      "h-12 w-12 mb-2",
                      currentQuestion.answer === "confused"
                        ? "text-red-500"
                        : "text-gray-400"
                    )}
                  />
                  <span>I'm confused</span>
                </button>
              </div>
            )}

            {currentQuestion?.type === "thumbs" && (
              <div className="flex justify-center gap-8">
                <button
                  onClick={() => handleAnswer("yes")}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <ThumbsUp
                    className={cn(
                      "h-12 w-12 mb-2",
                      currentQuestion.answer === "yes"
                        ? "text-green-500"
                        : "text-gray-400"
                    )}
                  />
                  <span>Yes!</span>
                </button>
                <button
                  onClick={() => handleAnswer("no")}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <ThumbsDown
                    className={cn(
                      "h-12 w-12 mb-2",
                      currentQuestion.answer === "no"
                        ? "text-red-500"
                        : "text-gray-400"
                    )}
                  />
                  <span>Not really</span>
                </button>
              </div>
            )}

            {currentQuestion?.type === "rating" && (
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleAnswer(rating)}
                    className="p-2"
                  >
                    <Star
                      className={cn(
                        "h-10 w-10",
                        currentQuestion.answer >= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  </button>
                ))}
              </div>
            )}

            {currentQuestion?.type === "text" && (
              <div className="flex flex-col items-center">
                <textarea
                  className="w-full p-3 border rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your answer here..."
                  value={currentQuestion.answer || ""}
                  onChange={(e) => {
                    const updatedReviewData = [...reviewData];
                    updatedReviewData[step].answer = e.target.value;
                    setReviewData(updatedReviewData);
                  }}
                />
                <Button 
                  onClick={() => handleAnswer(currentQuestion.answer || "")}
                  className="mt-4"
                  disabled={!currentQuestion.answer}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <div className="flex gap-1">
              {reviewData.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    idx === step ? "bg-blue-500" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {step > 0 && currentQuestion.type !== "text" && (
            <Button variant="outline" onClick={handlePrevious}>
              Back
            </Button>
          )}
          {currentQuestion?.type !== "text" && step < reviewData.length - 1 && (
            <Button 
              onClick={() => handleAnswer(currentQuestion.answer)}
              disabled={currentQuestion.answer === null}
              className="ml-auto"
            >
              Next
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonReviewModal;
