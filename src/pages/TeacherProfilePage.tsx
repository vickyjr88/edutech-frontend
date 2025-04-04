
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeacherDetails from "@/components/teacher/TeacherDetails";
import { useEffect, useState } from "react";
import { MethodologyItem, StrategyItem, LanguageItem } from "@/components/teacher/professional-profile";

// Mock data for now - in a real app this would come from an API
const getMockTeacher = (teacherUrlName: string) => {
  // For demo purposes, returning mock data for "mr-daniel-mwangi"
  if (teacherUrlName === "mr-daniel-mwangi") {
    return {
      id: "1",
      name: "Mr. Daniel Mwangi",
      imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "With over 8 years of teaching experience, Daniel is passionate about making learning engaging and accessible for all students. His teaching approach combines traditional methods with innovative techniques to ensure student success.",
      position: "Senior Science Teacher",
      rating: 4.8,
      ratingCount: 127,
      videoProfileUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      education: [
        {
          id: "edu1",
          institution: "University of Nairobi",
          degree: "Master's in Education",
          dates: "2012 - 2014"
        },
        {
          id: "edu2",
          institution: "Kenyatta University",
          degree: "Bachelor of Science in Chemistry",
          dates: "2008 - 2012"
        }
      ],
      experience: [
        {
          id: "exp1",
          position: "Senior Science Teacher",
          institution: "Nairobi International School",
          dates: "2018 - Present",
          description: "Teaching science subjects to middle and high school students with emphasis on practical experiments and real-world applications."
        },
        {
          id: "exp2",
          position: "Science Teacher",
          institution: "Moi Avenue Primary School",
          dates: "2014 - 2018",
          description: "Developed and implemented engaging science curriculum for grades 4-6."
        }
      ],
      methodologies: [
        {
          id: "meth1",
          methodology: "Bloom's Taxonomy",
          description: "Using comprehensive framework to develop critical thinking skills",
          is_certified: true
        },
        {
          id: "meth2",
          methodology: "Inquiry-Based Learning",
          description: "Encouraging students to investigate real questions through project-based work",
          is_certified: true
        },
        {
          id: "meth3",
          methodology: "Universal Design for Learning",
          description: "Implementing flexible approaches to meet diverse learner needs",
          is_certified: false
        }
      ],
      strategies: [
        {
          id: "str1",
          strategy: "Project-Based Learning",
          description: "Guiding students to explore real-world problems and challenges",
          is_certified: true
        },
        {
          id: "str2",
          strategy: "Gamification",
          description: "Using game elements to increase student engagement",
          is_certified: false
        },
        {
          id: "str3",
          strategy: "Blended Learning",
          description: "Combining online educational materials with traditional classroom methods",
          is_certified: true
        }
      ],
      languages: [
        {
          id: "lang1",
          language: "English",
          description: "Native proficiency",
          isCertified: true
        },
        {
          id: "lang2",
          language: "Swahili",
          description: "Native proficiency",
          isCertified: true
        },
        {
          id: "lang3",
          language: "French",
          description: "Intermediate level",
          isCertified: false
        }
      ],
      certifications: [
        {
          id: "cert1",
          name: "Certified Science Educator",
          issuer: "Kenya Education Board",
          date: "2016",
          isVerified: true
        },
        {
          id: "cert2",
          name: "Digital Learning Specialist",
          issuer: "Google for Education",
          date: "2019",
          isVerified: true
        },
        {
          id: "cert3",
          name: "First Aid Certification",
          issuer: "Kenya Red Cross",
          date: "2020",
          isVerified: false
        }
      ],
      classes: [
        {
          id: "class1",
          title: "Science Experiments at Home",
          subject: "Science",
          level: "Grade 5-6",
          rating: 4.8,
          imageSrc: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "class2",
          title: "Introduction to Chemistry",
          subject: "Chemistry",
          level: "Grade 7-8",
          rating: 4.9,
          imageSrc: "https://images.unsplash.com/photo-1587394910144-ab3451fd93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "class3",
          title: "Physics in Everyday Life",
          subject: "Physics",
          level: "Grade 6-7",
          rating: 4.7,
          imageSrc: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
      ],
      reviews: [
        {
          id: "rev1",
          reviewer: "Jane Muthoni",
          reviewerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
          rating: 5,
          comment: "Mr. Mwangi is an exceptional teacher! My daughter has improved tremendously in her science grades since taking his classes.",
          date: "March 15, 2023"
        },
        {
          id: "rev2",
          reviewer: "John Kamau",
          reviewerImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
          rating: 4,
          comment: "Very knowledgeable and patient teacher. The interactive experiments really helped my son understand complex concepts.",
          date: "February 2, 2023"
        },
        {
          id: "rev3",
          reviewer: "Sarah Wanjiku",
          reviewerImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
          rating: 5,
          comment: "Mr. Daniel makes learning science fun! His practical approach to teaching is refreshing and effective.",
          date: "December 10, 2022"
        }
      ]
    };
  }

  // Default teacher data if no match is found
  return {
    id: "default",
    name: "Teacher",
    imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bio: "This teacher is passionate about education and helping students succeed.",
    position: "Teacher",
    rating: 4.5,
    ratingCount: 50,
    videoProfileUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    education: [],
    experience: [],
    methodologies: [],
    strategies: [],
    languages: [],
    certifications: [],
    classes: [],
    reviews: []
  };
};

const TeacherProfilePage = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we're using mock data
    const teacherData = getMockTeacher(teacherId || "");
    setTeacher(teacherData);
    setLoading(false);
  }, [teacherId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-blue"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 bg-gray-50">
        {teacher && <TeacherDetails teacher={teacher} />}
      </main>
      <Footer />
    </div>
  );
};

export default TeacherProfilePage;
