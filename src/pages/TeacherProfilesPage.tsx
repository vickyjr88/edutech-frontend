
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Mock teacher data - in a real app this would come from an API
const mockTeachers = [
  {
    id: "1",
    urlName: "mr-daniel-mwangi",
    name: "Mr. Daniel Mwangi",
    position: "Senior Science Teacher",
    imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    subjects: ["Science", "Chemistry", "Physics"],
    rating: 4.8,
    location: "Nairobi, Kenya"
  },
  {
    id: "2",
    urlName: "ms-sarah-johnson",
    name: "Ms. Sarah Johnson",
    position: "Mathematics Specialist",
    imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    subjects: ["Mathematics", "Algebra", "Geometry"],
    rating: 4.9,
    location: "Mombasa, Kenya"
  },
  {
    id: "3",
    urlName: "mr-james-ochieng",
    name: "Mr. James Ochieng",
    position: "English Literature Teacher",
    imageSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    subjects: ["English", "Literature", "Drama"],
    rating: 4.7,
    location: "Kisumu, Kenya"
  },
  {
    id: "4",
    urlName: "dr-amina-hassan",
    name: "Dr. Amina Hassan",
    position: "History Professor",
    imageSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    subjects: ["History", "Geography", "Social Studies"],
    rating: 4.6,
    location: "Nakuru, Kenya"
  },
  {
    id: "5",
    urlName: "mr-david-mutua",
    name: "Mr. David Mutua",
    position: "Computer Science Instructor",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    subjects: ["Computer Science", "Programming", "Web Development"],
    rating: 4.9,
    location: "Eldoret, Kenya"
  },
  {
    id: "6",
    urlName: "mrs-elizabeth-wangari",
    name: "Mrs. Elizabeth Wangari",
    position: "Art & Music Teacher",
    imageSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    subjects: ["Art", "Music", "Design"],
    rating: 4.8,
    location: "Thika, Kenya"
  }
];

const TeacherProfilesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState(mockTeachers);

  useEffect(() => {
    const results = mockTeachers.filter(teacher => 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      teacher.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeachers(results);
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Expert Teachers</h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Discover our community of passionate educators ready to guide your learning journey
            </p>
          </div>
          
          {/* Search bar */}
          <div className="mb-8 max-w-lg mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, subject, or location..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-kidato-blue focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Teacher grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.map((teacher) => (
              <div 
                key={teacher.id} 
                className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:shadow-lg hover:-translate-y-1"
              >
                <Link to={`/teacher/${teacher.urlName}`}>
                  <div className="relative h-64">
                    <img 
                      className="w-full h-full object-cover"
                      src={teacher.imageSrc} 
                      alt={teacher.name} 
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center text-white">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span>{teacher.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{teacher.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{teacher.position}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {teacher.subjects.slice(0, 3).map((subject, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {teacher.location}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <Button className="w-full bg-kidato-blue hover:bg-kidato-dark-blue">
                      View Profile
                    </Button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {filteredTeachers.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-900">No teachers found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherProfilesPage;
