
import { Star } from "lucide-react";

interface ReviewsTabProps {
  teacher: {
    rating: number;
    ratingCount: number;
    reviews?: Array<{
      id: string;
      reviewer: string;
      reviewerImage?: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
}

export default function ReviewsTab({ teacher }: ReviewsTabProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews ({teacher.ratingCount})</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-4">
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
            <span className="text-3xl font-bold ml-2">{teacher.rating}</span>
          </div>
          <div>
            <p className="text-gray-500">{teacher.ratingCount} reviews</p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.round(teacher.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {teacher.reviews && teacher.reviews.length > 0 ? (
          teacher.reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start">
                <img 
                  src={review.reviewerImage || 'https://via.placeholder.com/40?text=User'} 
                  alt={review.reviewer}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{review.reviewer}</h4>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No reviews available yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
