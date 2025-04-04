import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClassCard, { ClassItemProps } from "@/components/common/ClassCard";
import CTASection from "@/components/common/CTASection";
import ClassesHero from "@/components/classes/ClassesHero";
import FeaturedClasses from "@/components/classes/FeaturedClasses";
import SearchBar from "@/components/classes/SearchBar";
import ClassFilters from "@/components/classes/ClassFilters";
import ClassesGrid from "@/components/classes/ClassesGrid";
import ClassesPagination from "@/components/classes/ClassesPagination";

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
  
  const filteredClasses = enhancedClasses.filter(classItem => {
    const matchesSearch = classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "All Subjects" || classItem.subject === selectedSubject;
    
    const matchesGrade = selectedGrade === "All Grades" || classItem.level.includes(selectedGrade.replace("Grade ", ""));
    
    const price = parseInt(classItem.price.replace("$", ""));
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    
    const matchesFeatured = showFeaturedOnly ? classItem.featured : true;
    
    return matchesSearch && matchesSubject && matchesGrade && matchesPrice && matchesFeatured;
  });
  
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return parseInt(a.price.replace("$", "")) - parseInt(b.price.replace("$", ""));
      case "Price: High to Low":
        return parseInt(b.price.replace("$", "")) - parseInt(a.price.replace("$", ""));
      case "Rating: High to Low":
        return b.rating - a.rating;
      case "Newest First":
        return -1;
      default: // Recommended
        return b.featured ? 1 : -1;
    }
  });
  
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = sortedClasses.slice(indexOfFirstClass, indexOfLastClass);
  const totalPages = Math.ceil(sortedClasses.length / classesPerPage);
  
  const featuredClasses = enhancedClasses.filter(cls => cls.featured);
  
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSubject("All Subjects");
    setSelectedGrade("All Grades");
    setPriceRange([5, 20]);
    setShowFeaturedOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <ClassesHero />
        
        <FeaturedClasses classes={featuredClasses} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />
          
          {showFilters && (
            <ClassFilters 
              subjects={subjects}
              grades={grades}
              sortOptions={sortOptions}
              selectedSubject={selectedSubject}
              selectedGrade={selectedGrade}
              priceRange={priceRange}
              showFeaturedOnly={showFeaturedOnly}
              sortBy={sortBy}
              onSubjectChange={setSelectedSubject}
              onGradeChange={setSelectedGrade}
              onPriceRangeChange={setPriceRange}
              onFeaturedToggle={setShowFeaturedOnly}
              onSortByChange={setSortBy}
            />
          )}
          
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {currentClasses.length} of {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'}
            </p>
          </div>
          
          <ClassesGrid 
            classes={currentClasses} 
            emptyStateResetFilters={resetFilters}
          />
          
          <ClassesPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        
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
