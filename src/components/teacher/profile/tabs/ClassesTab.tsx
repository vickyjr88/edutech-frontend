
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Filter, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ClassesTabProps {
  teacher: {
    name: string;
    classes: Array<{
      id: string;
      title: string;
      subject: string;
      level: string;
      rating?: number;
      imageSrc?: string;
      type?: "academic" | "afterschool";
    }>;
  };
}

export default function ClassesTab({ teacher }: ClassesTabProps) {
  const [classType, setClassType] = useState<"all" | "academic" | "afterschool">("all");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  // Group classes by type (academic or afterschool)
  const academicClasses = teacher.classes.filter(cls => cls.type === "academic" || !cls.type);
  const afterschoolClasses = teacher.classes.filter(cls => cls.type === "afterschool");
  
  // Handle on-demand booking submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Booking request sent! We'll notify you once confirmed.", {
      position: "top-center",
    });
    setBookingOpen(false);
  };

  // Function to render classes based on current filter
  const renderClasses = () => {
    let classesToRender = teacher.classes;
    
    if (classType === "academic") {
      classesToRender = academicClasses;
    } else if (classType === "afterschool") {
      classesToRender = afterschoolClasses;
    }
    
    if (classesToRender.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No classes available in this category.</p>
        </div>
      );
    }
    
    return classesToRender.map((cls) => (
      <Card key={cls.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="h-48 w-full overflow-hidden relative">
          <img 
            src={cls.imageSrc || 'https://via.placeholder.com/400x250?text=Class+Image'} 
            alt={cls.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {cls.type && (
            <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${
              cls.type === 'academic' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {cls.type === 'academic' ? 'Academic' : 'After-School'}
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold text-gray-900 mb-1">{cls.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{cls.subject} · {cls.level}</p>
          
          {cls.rating && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{cls.rating}</span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 border-kidato-blue text-kidato-blue hover:bg-kidato-blue/10">
              View Details
            </Button>
            <Button className="flex-1 bg-kidato-blue hover:bg-kidato-blue/90">
              Enroll Now
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Classes by {teacher.name}</h2>
        
        <div className="flex gap-3">
          <Select value={classType} onValueChange={(value: "all" | "academic" | "afterschool") => setClassType(value)}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="academic">Academic Classes</SelectItem>
              <SelectItem value="afterschool">After-School Classes</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
            <DialogTrigger asChild>
              <Button className="bg-kidato-orange hover:bg-kidato-orange/90 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Book On-Demand
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Book On-Demand Session</DialogTitle>
                <DialogDescription>
                  Request a personalized one-on-one session with {teacher.name}.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBookingSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Input id="date" type="date" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">Time</Label>
                    <Input id="time" type="time" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="message" className="text-right pt-2">Notes</Label>
                    <Textarea id="message" placeholder="Any specific topics or requirements?" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-kidato-blue hover:bg-kidato-blue/90">
                    Request Session
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacher.classes.length > 0 ? (
          renderClasses()
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No classes available at the moment.</p>
          </div>
        )}
      </div>
    </>
  );
}
