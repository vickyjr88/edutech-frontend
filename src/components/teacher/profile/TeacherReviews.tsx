import React, { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  reviewer: string;
  reviewerType?: string;
  reviewerImage?: string;
  rating: number;
  comment: string;
  date: string;
}

interface TeacherReviewsProps {
  reviews: Review[];
}

const TeacherReviews: React.FC<TeacherReviewsProps> = ({ reviews }) => {
  const [expanded, setExpanded] = useState(false);
  const displayedReviews = expanded ? reviews : reviews.slice(0, 3);
  
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  const ratings = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <MessageSquare className="mr-2 h-6 w-6 text-kidato-blue" />
          Reviews & Feedback
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Rating Summary */}
          <div className="md:col-span-1 bg-blue-50 rounded-xl p-5">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-kidato-blue">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">Based on {reviews.length} reviews</div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center text-sm">
                  <div className="w-10 text-right mr-2">{rating} stars</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500"
                      style={{ width: `${(ratings[rating as keyof typeof ratings] / reviews.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-right ml-2">
                    {ratings[rating as keyof typeof ratings]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Cards */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10 mr-3">
                      {review.reviewerImage ? (
                        <AvatarImage src={review.reviewerImage} alt={review.reviewer} />
                      ) : (
                        <AvatarFallback className="bg-kidato-blue text-white">
                          {review.reviewer[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{review.reviewer}</h4>
                          {review.reviewerType && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 font-normal text-xs">
                              {review.reviewerType}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      <div className="flex items-center my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${
                              star <= review.rating 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reviews.length > 3 && (
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setExpanded(!expanded)}
                  className="border-kidato-blue text-kidato-blue hover:bg-blue-50"
                >
                  {expanded ? 'Show Less' : `View All ${reviews.length} Reviews`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherReviews;