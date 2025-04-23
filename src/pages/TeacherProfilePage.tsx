import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeacherDetails from "@/components/teacher/TeacherDetails";
import { useEffect, useState } from "react";

const getMockTeacher = (teacherUrlName: string) => {
  if (!teacherUrlName) {
    console.log("No teacher ID provided");
    return getDefaultTeacher();
  }
  
  const normalizedTeacherName = teacherUrlName.replace(/\./g, '-').replace(/-+/g, '-').toLowerCase();
  
  console.log("Teacher ID from URL:", teacherUrlName);
  console.log("Looking for teacher with normalized name:", normalizedTeacherName);
  
  if (normalizedTeacherName === "mr-daniel-mwangi") {
    return {
      id: "1",
      name: "Mr. Daniel Mwangi",
      imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "With over 8 years of teaching experience, Daniel is passionate about making learning engaging and accessible for all students. His teaching approach combines traditional methods with innovative techniques to ensure student success.",
      position: "Senior Science Teacher",
      school: "Nairobi International School",
      schoolStatus: "active",
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
          imageSrc: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "academic"
        },
        {
          id: "class2",
          title: "Introduction to Chemistry",
          subject: "Chemistry",
          level: "Grade 7-8",
          rating: 4.9,
          imageSrc: "https://images.unsplash.com/photo-1587394910144-ab3451fd93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "academic"
        },
        {
          id: "class3",
          title: "Physics in Everyday Life",
          subject: "Physics",
          level: "Grade 6-7",
          rating: 4.7,
          imageSrc: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "academic"
        },
        {
          id: "class4",
          title: "Creative Arts & Crafts",
          subject: "Arts",
          level: "Ages 8-10",
          rating: 4.9,
          imageSrc: "https://images.unsplash.com/photo-1613140952277-1c6bd0386ff5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "afterschool"
        },
        {
          id: "class5",
          title: "Coding for Kids",
          subject: "Technology",
          level: "Ages 10-14",
          rating: 5.0,
          imageSrc: "https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "afterschool"
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
  } else if (normalizedTeacherName === "ms-amina-okafor") {
    return {
      id: "2",
      name: "Ms. Amina Okafor",
      imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Ms. Amina Okafor is an experienced mathematics teacher with over 10 years of teaching across various educational levels. She specializes in making complex mathematical concepts accessible and engaging for all students.",
      position: "Mathematics Teacher",
      school: "Nairobi Academy",
      schoolStatus: "active",
      rating: 4.9,
      ratingCount: 156,
      videoProfileUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      education: [
        {
          id: "edu1",
          institution: "University of Lagos",
          degree: "Master's in Mathematics Education",
          dates: "2010 - 2012"
        },
        {
          id: "edu2",
          institution: "Ahmadu Bello University",
          degree: "Bachelor of Science in Mathematics",
          dates: "2006 - 2010"
        }
      ],
      experience: [
        {
          id: "exp1",
          position: "Mathematics Teacher",
          institution: "Nairobi Academy",
          dates: "2017 - Present",
          description: "Teaching mathematics to high school students with a focus on practical applications and real-world problem solving."
        },
        {
          id: "exp2",
          position: "Mathematics Teacher",
          institution: "International School of Abuja",
          dates: "2012 - 2017",
          description: "Developed comprehensive mathematics curriculum for middle school students."
        }
      ],
      methodologies: [
        {
          id: "meth1",
          methodology: "Socratic Method",
          description: "Using questioning to stimulate critical thinking and illuminate ideas",
          is_certified: true
        },
        {
          id: "meth2",
          methodology: "Problem-Based Learning",
          description: "Centering learning around complex, real-world problems",
          is_certified: true
        },
        {
          id: "meth3",
          methodology: "Mastery Learning",
          description: "Ensuring students master a concept before moving to the next level",
          is_certified: true
        }
      ],
      strategies: [
        {
          id: "str1",
          strategy: "Visual Learning",
          description: "Using diagrams, graphs, and visual models to enhance mathematical understanding",
          is_certified: true
        },
        {
          id: "str2",
          strategy: "Cooperative Learning",
          description: "Organizing students into small groups for mutual support and learning",
          is_certified: true
        },
        {
          id: "str3",
          strategy: "Technology Integration",
          description: "Incorporating digital tools and software to enhance mathematical concepts",
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
          language: "Yoruba",
          description: "Native proficiency",
          isCertified: true
        },
        {
          id: "lang3",
          language: "Hausa",
          description: "Intermediate level",
          isCertified: false
        },
        {
          id: "lang4",
          language: "Swahili",
          description: "Intermediate level",
          isCertified: false
        }
      ],
      certifications: [
        {
          id: "cert1",
          name: "Certified Mathematics Educator",
          issuer: "African Mathematics Initiative",
          date: "2015",
          isVerified: true
        },
        {
          id: "cert2",
          name: "Advanced STEM Teaching Certificate",
          issuer: "Educational Development Institute",
          date: "2018",
          isVerified: true
        },
        {
          id: "cert3",
          name: "Digital Mathematics Instruction",
          issuer: "Global EdTech Alliance",
          date: "2020",
          isVerified: true
        },
        {
          id: "cert4",
          name: "Mathematics Competition Coach",
          issuer: "Pan-African Mathematics Olympiad",
          date: "2019",
          isVerified: true
        },
        {
          id: "cert5",
          name: "Educational Leadership",
          issuer: "Teachers Without Borders",
          date: "2021",
          isVerified: false
        }
      ],
      classes: [
        {
          id: "class1",
          title: "Algebra Fundamentals",
          subject: "Mathematics",
          level: "Grade 8-9",
          rating: 4.9,
          imageSrc: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "academic"
        },
        {
          id: "class2",
          title: "Geometry in Real Life",
          subject: "Mathematics",
          level: "Grade 10-11",
          rating: 4.8,
          imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "academic"
        },
        {
          id: "class3",
          title: "Advanced Calculus",
          subject: "Mathematics",
          level: "Grade 11-12",
          rating: 4.7,
          imageSrc: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "academic"
        },
        {
          id: "class4",
          title: "Math Fun & Games",
          subject: "Mathematics",
          level: "Ages 6-8",
          rating: 4.9,
          imageSrc: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "afterschool"
        },
        {
          id: "class5",
          title: "Competitive Math Coaching",
          subject: "Mathematics",
          level: "Ages 12-16",
          rating: 5.0,
          imageSrc: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "afterschool"
        }
      ],
      reviews: [
        {
          id: "rev1",
          reviewer: "David Njoroge",
          reviewerImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
          rating: 5,
          comment: "Ms. Okafor's teaching style transformed my daughter's relationship with mathematics. She now enjoys solving problems and has improved significantly.",
          date: "April 10, 2023"
        },
        {
          id: "rev2",
          reviewer: "Fatima Hassan",
          reviewerImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
          rating: 5,
          comment: "An excellent teacher who breaks down complex concepts into manageable pieces. My son's confidence in math has soared under her guidance.",
          date: "March 22, 2023"
        },
        {
          id: "rev3",
          reviewer: "Michael Ochieng",
          reviewerImage: "https://images.unsplash.com/photo-1500648767785-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
          rating: 4,
          comment: "Very methodical and patient. Provides excellent resources and is always available to help with difficult problems.",
          date: "February 5, 2023"
        }
      ],
      technicalSkills: [
        {
          id: "tech1",
          skill: "Mathematical Software",
          description: "Proficient with MATLAB, GeoGebra, and Mathematica",
          level: "Advanced"
        },
        {
          id: "tech2",
          skill: "Online Learning Platforms",
          description: "Experience with Khan Academy, Coursera, and EdX for supplemental instruction",
          level: "Advanced"
        },
        {
          id: "tech3",
          skill: "Data Analysis",
          description: "Using statistical tools to track and improve student performance",
          level: "Intermediate"
        },
        {
          id: "tech4",
          skill: "Interactive Whiteboard",
          description: "Creating dynamic mathematical visualizations for classroom instruction",
          level: "Advanced"
        },
        {
          id: "tech5",
          skill: "Educational Apps",
          description: "Implementing mobile applications for practice and assessment",
          level: "Intermediate"
        },
        {
          id: "tech6",
          skill: "Learning Management Systems",
          description: "Managing course content and assessments through digital platforms",
          level: "Advanced"
        },
        {
          id: "tech7",
          skill: "Programming for Education",
          description: "Basic Python and JavaScript for creating educational tools",
          level: "Intermediate"
        },
        {
          id: "tech8",
          skill: "Virtual Mathematics Labs",
          description: "Designing and implementing virtual experiments and simulations",
          level: "Advanced"
        }
      ]
    };
  }

  console.log("No matching teacher found, returning default teacher");
  return getDefaultTeacher();
};

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
        imageSrc: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "academic"
      },
      {
        id: "class2",
        title: "Critical Thinking Skills",
        subject: "Cross-disciplinary",
        level: "All Grades",
        rating: 4.8,
        imageSrc: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "academic"
      },
      {
        id: "class3",
        title: "Study Skills Workshop",
        subject: "Academic Skills",
        level: "Grade 7-12",
        rating: 4.5,
        imageSrc: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "academic"
      },
      {
        id: "class4",
        title: "Creative Writing Club",
        subject: "English",
        level: "Ages 10-14",
        rating: 4.7,
        imageSrc: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "afterschool"
      },
      {
        id: "class5",
        title: "Public Speaking for Youth",
        subject: "Communication",
        level: "Ages 12-16",
        rating: 4.9,
        imageSrc: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "afterschool"
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
};

const TeacherProfilePage = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        {teacher && (
          <TeacherDetails teacher={teacher} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TeacherProfilePage;
