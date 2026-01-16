import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClassItemProps } from "@/components/common/ClassCard";
import CTASection from "@/components/common/CTASection";
import ClassesHero from "@/components/classes/ClassesHero";
import FeaturedClasses from "@/components/classes/FeaturedClasses";
import SearchBar from "@/components/classes/SearchBar";
import ClassFilters from "@/components/classes/ClassFilters";
import ClassesGrid from "@/components/classes/ClassesGrid";
import ClassesPagination from "@/components/classes/ClassesPagination";
import { api } from "@/integrations/api/client";
import { Loader2 } from "lucide-react";

// Offering type from /mvp/offerings endpoint
interface Offering {
  _id: string;
  teacherId: string;
  title: string;
  description: string;
  type: "one-time" | "monthly-package";
  subject: string;
  curriculum: string;
  gradeLevel: string;
  price: number;
  currency: string;
  sessionDuration: number;
  sessionsPerMonth: number;
  numberOfSessions: number;
  isActive: boolean;
  totalBookings: number;
  totalEarnings: number;
  createdAt: string;
  updatedAt: string;
}

// Subject to image mapping for better visuals
const subjectImages: Record<string, string> = {
  "Mathematics": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "Physics": "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "Chemistry": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "Biology": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "English": "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "Science": "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "History": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "Computer Science": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "default": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
};

// Helper to map Offering to ClassItemProps
const mapOfferingToCardProps = (offering: Offering, index: number): ClassItemProps => {
  // Format price with currency
  const priceString = offering.price > 0 
    ? `${offering.currency} ${offering.price}/${offering.type === 'monthly-package' ? 'month' : 'session'}` 
    : "Free";

  // Format session info
  const sessionInfo = offering.type === 'monthly-package'
    ? `${offering.sessionsPerMonth} sessions/month • ${offering.sessionDuration} min each`
    : `${offering.sessionDuration} min session`;

  // Get image based on subject
  const imageSrc = subjectImages[offering.subject] || subjectImages["default"];

  return {
    title: offering.title,
    subject: offering.subject || "General",
    level: offering.gradeLevel || "All Levels",
    teacher: offering.curriculum || "Various",
    rating: 4.5 + (index % 5) * 0.1, // Placeholder rating
    time: sessionInfo,
    imageSrc,
    spots: offering.isActive ? "Available" : "Unavailable",
    price: priceString,
    featured: index < 3 // First 3 are featured
  };
};

const subjects = ["All Subjects", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Science", "History", "Computer Science"];
const grades = ["All Grades", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Rating: High to Low", "Newest First"];

const AllClasses = () => {
  const [classes, setClasses] = useState<ClassItemProps[]>([]);
  const [featuredClasses, setFeaturedClasses] = useState<ClassItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 8;

  // Fetch offerings on mount
  useEffect(() => {
    const fetchOfferings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all offerings using /mvp/offerings endpoint
        const { data: offerings, error: apiError } = await api.get<Offering[]>('/mvp/offerings');

        if (apiError) {
          throw new Error(apiError.message || "Failed to load offerings");
        }

        if (offerings && offerings.length > 0) {
          // Map API data to card props
          const mappedClasses = offerings.map((offering, index) => mapOfferingToCardProps(offering, index));
          setClasses(mappedClasses);

          // Featured classes are first 3
          setFeaturedClasses(mappedClasses.slice(0, 3).map(c => ({ ...c, featured: true })));
        } else {
          setClasses([]);
          setFeaturedClasses([]);
        }
      } catch (err) {
        console.error("Failed to fetch offerings:", err);
        setError("Failed to load classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject === "All Subjects" || classItem.subject === selectedSubject;

    const matchesGrade = selectedGrade === "All Grades" || classItem.level.includes(selectedGrade);

    // Extract numeric price from string like "KES 500/month" or "KES 100/session"
    const priceMatch = classItem.price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0]) : 0;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

    const matchesFeatured = showFeaturedOnly ? classItem.featured : true;

    return matchesSearch && matchesSubject && matchesGrade && matchesPrice && matchesFeatured;
  });

  const sortedClasses = [...filteredClasses].sort((a, b) => {
    // Extract numeric price for sorting
    const getPriceNum = (priceStr: string) => {
      const match = priceStr.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };
    
    switch (sortBy) {
      case "Price: Low to High":
        return getPriceNum(a.price) - getPriceNum(b.price);
      case "Price: High to Low":
        return getPriceNum(b.price) - getPriceNum(a.price);
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

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSubject("All Subjects");
    setSelectedGrade("All Grades");
    setPriceRange([0, 1000]);
    setShowFeaturedOnly(false);
    setSortBy("Recommended");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <ClassesHero />

        {!loading && featuredClasses.length > 0 && (
          <FeaturedClasses classes={featuredClasses} />
        )}

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
              onReset={resetFilters}
            />
          )}

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-kidato-purple" />
              <span className="ml-2 text-gray-600">Loading classes...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-kidato-purple hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        <CTASection
          title="Can't find what you're looking for?"
          description="Contact us to request specific subjects or suggest new class topics. We're constantly expanding our offerings to meet your child's educational needs."
          buttonText="Request a Class"
          buttonLink="/contact-us"
        />
      </main>

      <Footer />
    </div>
  );
};

export default AllClasses;
