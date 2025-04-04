
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClassCard, { ClassItemProps } from "@/components/common/ClassCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronDown, Users, GraduationCap, Clock, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import CTASection from "@/components/common/CTASection";

const mockClasses: ClassItemProps[] = [
  {
    title: "Introduction to Algebra",
    subject: "Mathematics",
    level: "Grade 7-8",
    teacher: "Ms. Amina Okafor",
    rating: 4.9,
    time: "Tuesdays & Thursdays, 4:00 PM",
    imageSrc: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "3 spots left",
    price: "$12/class"
  },
  {
    title: "Science Experiments at Home",
    subject: "Science",
    level: "Grade 5-6",
    teacher: "Mr. Daniel Mwangi",
    rating: 4.8,
    time: "Mondays & Wednesdays, 3:30 PM",
    imageSrc: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "2 spots left",
    price: "$10/class"
  },
  {
    title: "English Literature Essentials",
    subject: "English",
    level: "Grade 9-10",
    teacher: "Ms. Grace Okello",
    rating: 5.0,
    time: "Fridays, 5:00 PM",
    imageSrc: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "5 spots left",
    price: "$15/class"
  },
  {
    title: "Coding for Kids",
    subject: "Computer Science",
    level: "Grade 4-6",
    teacher: "Mr. Kwame Adu",
    rating: 4.7,
    time: "Saturdays, 10:00 AM",
    imageSrc: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "1 spot left",
    price: "$18/class"
  },
  {
    title: "History of Ancient Africa",
    subject: "History",
    level: "Grade 7-9",
    teacher: "Dr. Mandla Khumalo",
    rating: 4.8,
    time: "Mondays, 4:30 PM",
    imageSrc: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "4 spots left",
    price: "$14/class"
  },
  {
    title: "Creative Writing Workshop",
    subject: "English",
    level: "Grade 5-7",
    teacher: "Ms. Fatima Ahmed",
    rating: 4.9,
    time: "Wednesdays, 3:00 PM",
    imageSrc: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "2 spots left",
    price: "$11/class"
  },
  {
    title: "Chemistry Fundamentals",
    subject: "Science",
    level: "Grade 8-10",
    teacher: "Dr. Oluwaseun Adeyemi",
    rating: 4.7,
    time: "Tuesdays & Thursdays, 5:00 PM",
    imageSrc: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "3 spots left",
    price: "$16/class"
  },
  {
    title: "French for Beginners",
    subject: "Languages",
    level: "Grade 3-5",
    teacher: "Mme. Isabelle Diop",
    rating: 4.8,
    time: "Saturdays, 9:00 AM",
    imageSrc: "https://images.unsplash.com/photo-1505902987837-9e40ec37e607?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "5 spots left",
    price: "$12/class"
  },
  {
    title: "Introduction to Robotics",
    subject: "Technology",
    level: "Grade 6-8",
    teacher: "Mr. Jean-Pierre Mubiru",
    rating: 4.9,
    time: "Saturdays, 2:00 PM",
    imageSrc: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "1 spot left",
    price: "$20/class"
  },
  {
    title: "Advanced Mathematics",
    subject: "Mathematics",
    level: "Grade 9-12",
    teacher: "Dr. Chidi Okonkwo",
    rating: 5.0,
    time: "Mondays & Wednesdays, 6:00 PM",
    imageSrc: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "2 spots left",
    price: "$18/class"
  },
  {
    title: "Environmental Science",
    subject: "Science",
    level: "Grade 6-8",
    teacher: "Dr. Amara Osei",
    rating: 4.8,
    time: "Fridays, 3:30 PM",
    imageSrc: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "4 spots left",
    price: "$13/class"
  },
  {
    title: "Music Theory and Practice",
    subject: "Arts",
    level: "Grade 4-7",
    teacher: "Mr. David Adjei",
    rating: 4.7,
    time: "Saturdays, 11:00 AM",
    imageSrc: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "3 spots left",
    price: "$15/class"
  }
];

// Mark some classes as featured
const enhancedClasses = mockClasses.map((cls, index) => ({
  ...cls,
  featured: index === 1 || index === 5 || index === 8
}));

const subjects = ["All Subjects", "Mathematics", "Science", "English", "History", "Languages", "Computer Science", "Arts", "Technology"];
const grades = ["All Grades", "Grade 1-3", "Grade 4-6", "Grade 7-9", "Grade 10-12"];
const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Rating: High to Low", "Newest First"];

const AllClasses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([5, 20]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 8;
  
  // Filter classes based on all criteria
  const filteredClasses = enhancedClasses.filter(classItem => {
    // Search term filter
    const matchesSearch = classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Subject filter
    const matchesSubject = selectedSubject === "All Subjects" || classItem.subject === selectedSubject;
    
    // Grade filter
    const matchesGrade = selectedGrade === "All Grades" || classItem.level.includes(selectedGrade.replace("Grade ", ""));
    
    // Price filter - extract numeric value from price string
    const price = parseInt(classItem.price.replace("$", ""));
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    
    // Featured filter
    const matchesFeatured = showFeaturedOnly ? classItem.featured : true;
    
    return matchesSearch && matchesSubject && matchesGrade && matchesPrice && matchesFeatured;
  });
  
  // Sort classes
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return parseInt(a.price.replace("$", "")) - parseInt(b.price.replace("$", ""));
      case "Price: High to Low":
        return parseInt(b.price.replace("$", "")) - parseInt(a.price.replace("$", ""));
      case "Rating: High to Low":
        return b.rating - a.rating;
      case "Newest First":
        // For mock data, we'll just reverse the order
        return -1;
      default: // Recommended
        return b.featured ? 1 : -1;
    }
  });
  
  // Paginate classes
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = sortedClasses.slice(indexOfFirstClass, indexOfLastClass);
  const totalPages = Math.ceil(sortedClasses.length / classesPerPage);
  
  // Featured classes section
  const featuredClasses = enhancedClasses.filter(cls => cls.featured);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Enhanced Hero Section with Stats */}
        <div className="bg-gradient-to-r from-kidato-blue to-kidato-dark-blue py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Child's Learning Potential</h1>
                <p className="text-xl max-w-3xl mb-6">
                  Explore live, interactive classes taught by Africa's top educators designed to inspire and challenge your child.
                </p>
                <Button size="lg" className="bg-white text-kidato-blue hover:bg-gray-100">
                  Start Learning Today
                </Button>
              </div>
              
              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-2">
                    <Users className="h-8 w-8 text-kidato-orange" />
                  </div>
                  <h3 className="text-3xl font-bold">15,000+</h3>
                  <p className="text-sm opacity-80">Students Enrolled</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-2">
                    <GraduationCap className="h-8 w-8 text-kidato-orange" />
                  </div>
                  <h3 className="text-3xl font-bold">94%</h3>
                  <p className="text-sm opacity-80">Grade Improvement</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-2">
                    <Clock className="h-8 w-8 text-kidato-orange" />
                  </div>
                  <h3 className="text-3xl font-bold">500+</h3>
                  <p className="text-sm opacity-80">Weekly Classes</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-2">
                    <Award className="h-8 w-8 text-kidato-orange" />
                  </div>
                  <h3 className="text-3xl font-bold">4.8/5</h3>
                  <p className="text-sm opacity-80">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Classes Section */}
        {featuredClasses.length > 0 && (
          <div className="bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Classes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {featuredClasses.map((classItem, index) => (
                  <ClassCard key={`featured-${index}`} classItem={classItem} />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for classes, subjects, or teachers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="md:w-auto flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {/* Enhanced Expandable Filters */}
          {showFilters && (
            <div className="rounded-lg mb-8 p-6 bg-gray-50 border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                  <Slider
                    defaultValue={[5, 20]}
                    min={5}
                    max={30}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                </div>
                
                <div className="flex items-center">
                  <label htmlFor="featured-toggle" className="text-sm font-medium text-gray-700 mr-3">
                    Show Featured Classes Only
                  </label>
                  <Switch
                    id="featured-toggle"
                    checked={showFeaturedOnly}
                    onCheckedChange={setShowFeaturedOnly}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <ToggleGroup type="single" value={sortBy} onValueChange={(value) => value && setSortBy(value)}>
                    {sortOptions.map((option) => (
                      <ToggleGroupItem 
                        key={option} 
                        value={option} 
                        className="text-xs px-3 py-1 data-[state=on]:bg-kidato-blue data-[state=on]:text-white"
                      >
                        {option}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
            </div>
          )}
          
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {currentClasses.length} of {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'}
            </p>
          </div>
          
          {/* Classes Grid */}
          {currentClasses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentClasses.map((classItem, index) => (
                <ClassCard key={index} classItem={classItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No classes found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSubject("All Subjects");
                  setSelectedGrade("All Grades");
                  setPriceRange([5, 20]);
                  setShowFeaturedOnly(false);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {filteredClasses.length > classesPerPage && (
            <Pagination className="my-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  if (totalPages <= 5) {
                    // Show all pages if there are 5 or less
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else {
                    // Show dynamic pagination for more than 5 pages
                    if (currentPage <= 3) {
                      // Near the start
                      if (i < 4) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink 
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else {
                        return (
                          <PaginationItem key="ellipsis-end">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                    } else if (currentPage > totalPages - 3) {
                      // Near the end
                      if (i === 0) {
                        return (
                          <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      } else {
                        return (
                          <PaginationItem key={totalPages - 4 + i}>
                            <PaginationLink 
                              isActive={currentPage === totalPages - 4 + i}
                              onClick={() => setCurrentPage(totalPages - 4 + i)}
                            >
                              {totalPages - 4 + i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    } else {
                      // In the middle
                      if (i === 0) {
                        return (
                          <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      } else if (i === 4) {
                        return (
                          <PaginationItem key="ellipsis-end">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      } else {
                        return (
                          <PaginationItem key={currentPage - 2 + i}>
                            <PaginationLink 
                              isActive={i === 2}
                              onClick={() => setCurrentPage(currentPage - 2 + i)}
                            >
                              {currentPage - 2 + i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    }
                  }
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
        
        {/* CTA Section */}
        <CTASection 
          title="Can't find what you're looking for?"
          description="Contact us to request specific subjects or suggest new class topics. We're constantly expanding our offerings to meet your child's educational needs."
          buttonText="Request a Class"
          buttonLink="/contact"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default AllClasses;
