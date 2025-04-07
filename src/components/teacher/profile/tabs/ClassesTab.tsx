
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Star, Image, Video, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AvailabilityCalendar from "../calendar/AvailabilityCalendar";
import { useState } from "react";

interface ClassesTabProps {
  teacher: any;
}

export default function ClassesTab({ teacher }: ClassesTabProps) {
  const academicClasses = teacher.classes?.filter((c: any) => c.type === 'academic') || [];
  const afterSchoolClasses = teacher.classes?.filter((c: any) => c.type === 'afterschool') || [];

  const [selectedBookingReason, setSelectedBookingReason] = useState<string | null>(null);

  const renderClass = (classItem: any) => (
    <div key={classItem.id} className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col h-full">
      <div className="flex-grow">
        <div className="aspect-w-16 aspect-h-9 mb-3">
          <img 
            src={classItem.imageSrc || "https://images.unsplash.com/photo-1610484826967-09c5720778c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
            alt={classItem.title} 
            className="rounded-md object-cover w-full h-48" 
          />
        </div>
        <h3 className="font-medium mb-1">{classItem.title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Badge variant="outline" className="mr-2">{classItem.subject}</Badge>
          <span>{classItem.level}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center mr-3">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Flexible schedule</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>60 min</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto flex gap-2">
        <Link to={`/class/${classItem.id}`} className="flex-grow">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        <Link to={`/class/${classItem.id}/enroll`} className="flex-grow">
          <Button className="w-full">
            Enroll
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Availability Calendar Section */}
      <div className="mb-10">
        <h2 className="text-xl font-medium mb-4">Book a One-on-One Session</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium mb-3">Select a Reason</h3>
              <div className="space-y-2">
                {["Exam Prep", "Homework Help", "Subject Tuition", "After-school Activity", "Special Needs", "Other"].map(reason => (
                  <div 
                    key={reason}
                    onClick={() => setSelectedBookingReason(reason)}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedBookingReason === reason 
                        ? 'border-kidato-blue bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <AvailabilityCalendar teacherId={teacher.id} bookingReason={selectedBookingReason} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Academic Classes Section */}
      {academicClasses.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Academic Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicClasses.map(renderClass)}
          </div>
        </div>
      )}
      
      {/* After School Classes Section */}
      {afterSchoolClasses.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">After School Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {afterSchoolClasses.map(renderClass)}
          </div>
        </div>
      )}
      
      {/* Reviews Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Reviews</h2>
          <Link to="#reviews" className="text-kidato-blue text-sm hover:underline">View All</Link>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-medium">{teacher.rating}</span>
              <span className="text-gray-500 ml-1">({teacher.ratingCount} reviews)</span>
            </div>
          </div>
          
          {teacher.reviews && teacher.reviews.length > 0 ? (
            <div className="space-y-4">
              {teacher.reviews.slice(0, 2).map((review: any) => (
                <div key={review.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center mb-2">
                    {review.reviewerImage && (
                      <img 
                        src={review.reviewerImage} 
                        alt={review.reviewer} 
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                    )}
                    <div>
                      <p className="font-medium">{review.reviewer}</p>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
      
      {/* Gallery Section */}
      <div className="mb-10">
        <h2 className="text-xl font-medium mb-4">Gallery</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="rounded-full bg-gray-100 p-3">
                  <Image className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <p className="text-gray-500">Teacher has not uploaded any photos or videos yet.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="mb-10">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-medium mb-2">Need more information?</h3>
              <p className="text-gray-600">Contact {teacher.name} directly for personalized assistance.</p>
            </div>
            <Button className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Teacher
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
