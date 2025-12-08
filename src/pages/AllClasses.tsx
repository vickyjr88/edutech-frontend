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
import { classService, Class } from "@/integrations/api/services/class.service";
import { Loader2 } from "lucide-react";

// Helper to map API Class to ClassItemProps
const mapClassToCardProps = (cls: Class, featured: boolean = false): ClassItemProps => {
  // Extract teacher name
  const teacherName = cls.teacher?.user?.fullName || cls.teacher?.name || "Unknown Teacher";

  // Find the first active cohort to get time and price info
  const cohort = (cls as any).cohorts?.find((c: any) => c.isActive) || (cls as any).cohorts?.[0];

  // Format time from cohort data
  let timeString = "Schedule TBA";
  if (cohort) {
    const days = cohort.daysOfWeek?.join(" & ") || "";
    const startTime = cohort.startTime || "";
    timeString = days && startTime ? `${days}, ${startTime}` : "Schedule TBA";
  }

  // Format price
  const price = cohort?.price || 0;
  const priceString = price > 0 ? `$${price}/class` : "Free";

  // Calculate spots left
  const maxStudents = cohort?.maximumStudents || 0;
  const currentStudents = cohort?.currentStudents || 0;
  const spotsLeft = Math.max(0, maxStudents - currentStudents);
  const spotsString = spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : "Class Full";

  // Use thumbnail or a default image
  const imageSrc = cls.thumbnailUrl || (cls as any).media?.thumbnailUrl ||
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

  return {
    title: cls.title,
    subject: cls.subject || "General",
    level: cls.gradeLevel || "All Levels",
    teacher: teacherName,
    rating: cls.rating || 4.5,
    time: timeString,
    imageSrc,
    spots: spotsString,
    price: priceString,
    featured: featured || cls.isFeatured
  };
};

const subjects = ["All Subjects", "Mathematics", "Science", "English", "History", "Languages", "Computer Science", "Arts", "Technology"];
const grades = ["All Grades", "Grade 1-3", "Grade 4-6", "Grade 7-9", "Grade 10-12"];
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
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 8;

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all published classes
        const { data: allClasses, error: allError } = await classService.browse({
          page: 1,
          limit: 100,
        });

        if (allError) {
          throw new Error(allError);
        }

        if (allClasses) {
          // Map API data to card props
          const mappedClasses = allClasses.map(cls => mapClassToCardProps(cls));
          setClasses(mappedClasses);

          // Filter featured classes
          const featured = mappedClasses.filter(cls => cls.featured);
          setFeaturedClasses(featured.length > 0 ? featured : mappedClasses.slice(0, 3).map(c => ({ ...c, featured: true })));
        }
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        setError("Failed to load classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject === "All Subjects" || classItem.subject === selectedSubject;

    const matchesGrade = selectedGrade === "All Grades" || classItem.level.includes(selectedGrade.replace("Grade ", ""));

    const price = parseInt(classItem.price.replace("$", "").replace("/class", "")) || 0;
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

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSubject("All Subjects");
    setSelectedGrade("All Grades");
    setPriceRange([0, 100]);
    setShowFeaturedOnly(false);
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
          buttonLink="/contact"
        />
      </main>

      <Footer />
    </div>
  );
};

export default AllClasses;
