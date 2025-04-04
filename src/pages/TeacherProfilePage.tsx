
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeacherDetails from "@/components/teacher/TeacherDetails";
import { useEffect, useState } from "react";
import { MethodologyItem, StrategyItem, LanguageItem } from "@/components/teacher/professional-profile";

// Mock data for now - in a real app this would come from an API
const getMockTeacher = (teacherUrlName: string) => {
  if (!teacherUrlName) {
    console.log("No teacher ID provided");
    return getDefaultTeacher();
  }
  
  // Clean the teacher URL name to handle variations with dots or dashes
  // Replace dots with single dash and normalize consecutive dashes to single dash
  const normalizedTeacherName = teacherUrlName.replace(/\./g, '-').replace(/-+/g, '-').toLowerCase();
  
  console.log("Teacher ID from URL:", teacherUrlName);
  console.log("Looking for teacher with normalized name:", normalizedTeacherName);
  
  // For demo purposes, returning mock data for "mr-daniel-mwangi"
  if (normalizedTeacherName === "mr-daniel-mwangi") {
    return {
      id: "1",
      name: "Mr. Daniel Mwangi",
      imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "With over 8 years of teaching experience, Daniel is passionate about making learning engaging and accessible for all students. His teaching approach combines traditional methods with innovative techniques to ensure student success.",
      position: "Senior Science Teacher",
      school: "Nairobi International School",
      schoolStatus: "active", // can be "active" or "past"
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
        },
        {
          id: "lang4",
          language: "German",
          description: "Basic knowledge",
          isCertified: false
        },
        {
          id: "lang5",
          language: "Arabic",
          description: "Elementary proficiency",
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
        },
        {
          id: "cert4",
          name: "STEM Teaching Excellence",
          issuer: "African STEM Foundation",
          date: "2021",
          isVerified: true
        },
        {
          id: "cert5",
          name: "Environmental Education Leader",
          issuer: "National Environmental Authority",
          date: "2022",
          isVerified: true
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
      ],
      technicalSkills: [
        {
          id: "tech1",
          skill: "Learning Management Systems",
          description: "Proficient with Canvas, Moodle, and Google Classroom",
          level: "Advanced"
        },
        {
          id: "tech2",
          skill: "Educational Software",
          description: "Experience with Kahoot, Quizlet, and Nearpod for interactive lessons",
          level: "Advanced"
        },
        {
          id: "tech3",
          skill: "Video Production",
          description: "Creation of educational videos using Camtasia and OBS Studio",
          level: "Intermediate"
        },
        {
          id: "tech4",
          skill: "Microsoft Office Suite",
          description: "Advanced use of Word, PowerPoint, and Excel for classroom materials",
          level: "Advanced"
        },
        {
          id: "tech5",
          skill: "Digital Assessment Tools",
          description: "Implementing formative and summative assessments using digital platforms",
          level: "Intermediate"
        },
        {
          id: "tech6",
          skill: "Virtual Reality in Education",
          description: "Using VR applications to create immersive learning experiences",
          level: "Basic"
        },
        {
          id: "tech7",
          skill: "Interactive Whiteboard Technology",
          description: "Creating engaging visual presentations and collaborative exercises",
          level: "Advanced"
        },
        {
          id: "tech8",
          skill: "Data Analytics for Education",
          description: "Analyzing student performance data to improve teaching methods",
          level: "Intermediate"
        }
      ]
    };
  }

  // If no matching teacher found, return default teacher
  console.log("No matching teacher found, returning default teacher");
  return getDefaultTeacher();
};

// Separate function for the default teacher to avoid code duplication
const getDefaultTeacher = () => {
  return {
    id: "default",
    name: "Teacher",
    imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bio: "This teacher is passionate about education and helping students succeed. With a focus on personalized learning approaches and modern teaching techniques, they aim to inspire and empower students to reach their full potential.",
    position: "Teacher",
    school: "Central High School",
    schoolStatus: "active",
    rating: 4.5,
    ratingCount: 50,
    videoProfileUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    education: [
      {
        id: "edu1", 
        institution: "University of Education",
        degree: "Master's in Teaching",
        dates: "2015 - 2017"
      },
      {
        id: "edu2",
        institution: "State University",
        degree: "Bachelor of Arts in History",
        dates: "2011 - 2015"
      },
      {
        id: "edu3",
        institution: "Teaching Certification Program",
        degree: "Professional Teaching Certificate",
        dates: "2018"
      }
    ],
    experience: [
      {
        id: "exp1",
        position: "Lead Teacher",
        institution: "Central High School",
        dates: "2019 - Present",
        description: "Developing curriculum and leading classroom activities for grades 9-12 with a focus on interactive learning experiences."
      },
      {
        id: "exp2",
        position: "Assistant Teacher",
        institution: "Woodland Elementary",
        dates: "2017 - 2019",
        description: "Supported lead teachers in classroom management and provided individualized instruction to students."
      }
    ],
    methodologies: [
      {
        id: "meth1",
        methodology: "Differentiated Instruction",
        description: "Tailoring instruction to meet individual needs of diverse learners",
        is_certified: true
      },
      {
        id: "meth2",
        methodology: "Problem-Based Learning",
        description: "Engaging students with authentic problems that require critical thinking",
        is_certified: false
      },
      {
        id: "meth3",
        methodology: "Flipped Classroom",
        description: "Inverting traditional teaching methods to enhance engagement",
        is_certified: true
      }
    ],
    strategies: [
      {
        id: "str1",
        strategy: "Collaborative Learning",
        description: "Facilitating group activities that develop teamwork skills",
        is_certified: true
      },
      {
        id: "str2",
        strategy: "Visual Learning",
        description: "Using diagrams, charts, and videos to enhance comprehension",
        is_certified: true
      },
      {
        id: "str3",
        strategy: "Formative Assessment",
        description: "Ongoing assessment to guide instructional decisions",
        is_certified: false
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
        language: "Spanish",
        description: "Intermediate level",
        isCertified: true
      },
      {
        id: "lang3",
        language: "German",
        description: "Basic knowledge",
        isCertified: false
      },
      {
        id: "lang4",
        language: "French",
        description: "Intermediate proficiency",
        isCertified: true
      },
      {
        id: "lang5",
        language: "Mandarin",
        description: "Elementary level",
        isCertified: false
      }
    ],
    certifications: [
      {
        id: "cert1",
        name: "Certified Education Professional",
        issuer: "National Education Board",
        date: "2019",
        isVerified: true
      },
      {
        id: "cert2",
        name: "Technology Integration Specialist",
        issuer: "EdTech Institute",
        date: "2020",
        isVerified: true
      },
      {
        id: "cert3",
        name: "Student Mentorship Certification",
        issuer: "Mentoring Alliance",
        date: "2021",
        isVerified: false
      },
      {
        id: "cert4",
        name: "Advanced Classroom Management",
        issuer: "Education Leadership Council",
        date: "2022",
        isVerified: true
      },
      {
        id: "cert5",
        name: "Multicultural Education Specialist",
        issuer: "Global Education Initiative",
        date: "2023",
        isVerified: true
      }
    ],
    classes: [
      {
        id: "class1",
        title: "Introduction to World History",
        subject: "History",
        level: "Grade 9-10",
        rating: 4.6,
        imageSrc: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "class2",
        title: "Critical Thinking Skills",
        subject: "Cross-disciplinary",
        level: "All Grades",
        rating: 4.8,
        imageSrc: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "class3",
        title: "Study Skills Workshop",
        subject: "Academic Skills",
        level: "Grade 7-12",
        rating: 4.5,
        imageSrc: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ],
    reviews: [
      {
        id: "rev1",
        reviewer: "Parent of Student",
        reviewerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
        rating: 5,
        comment: "Our child has shown significant improvement in their study habits and confidence. The teacher is patient, knowledgeable, and genuinely cares about student success.",
        date: "April 15, 2023"
      },
      {
        id: "rev2",
        reviewer: "High School Student",
        reviewerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
        rating: 4,
        comment: "The classes are engaging and interactive. I've learned a lot of useful techniques that have helped me with my other subjects as well.",
        date: "March 3, 2023"
      },
      {
        id: "rev3",
        reviewer: "School Administrator",
        reviewerImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
        rating: 5,
        comment: "An exceptional educator who consistently goes above and beyond for their students. Their innovative teaching methods have been an asset to our school.",
        date: "January 22, 2023"
      }
    ],
    technicalSkills: [
      {
        id: "tech1",
        skill: "Learning Management Systems",
        description: "Proficient with Canvas, Moodle, and Google Classroom",
        level: "Advanced"
      },
      {
        id: "tech2",
        skill: "Educational Software",
        description: "Experience with Kahoot, Quizlet, and Nearpod for interactive lessons",
        level: "Advanced"
      },
      {
        id: "tech3",
        skill: "Video Production",
        description: "Creation of educational videos using Camtasia and OBS Studio",
        level: "Intermediate"
      },
      {
        id: "tech4",
        skill: "Microsoft Office Suite",
        description: "Advanced use of Word, PowerPoint, and Excel for classroom materials",
        level: "Advanced"
      },
      {
        id: "tech5",
        skill: "Digital Assessment Tools",
        description: "Implementing formative and summative assessments using digital platforms",
        level: "Intermediate"
      },
      {
        id: "tech6",
        skill: "Assistive Technology",
        description: "Using tools to support students with diverse learning needs",
        level: "Advanced"
      },
      {
        id: "tech7",
        skill: "Coding and Programming",
        description: "Teaching basic programming concepts using Scratch and Python",
        level: "Intermediate"
      },
      {
        id: "tech8",
        skill: "3D Printing for Education",
        description: "Creating physical models to enhance conceptual understanding",
        level: "Basic"
      }
    ]
  };
};

const TeacherProfilePage = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we're using mock data
    console.log("Teacher ID from URL:", teacherId);
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
