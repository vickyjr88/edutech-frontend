// Mock teacher data for development purposes

export const getMockTeacher = (teacherUrlName: string) => {
  if (!teacherUrlName) {
    return getDefaultTeacher();
  }
  
  const normalizedTeacherName = teacherUrlName.replace(/\./g, '-').replace(/-+/g, '-').toLowerCase();
  
  if (normalizedTeacherName === "mr-daniel-mwangi") {
    return {
      id: "1",
      name: "Mr. Daniel Mwangi",
      imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      bio: "With over 8 years of teaching experience, Daniel is passionate about making learning engaging and accessible for all students. His teaching approach combines traditional methods with innovative techniques to ensure student success.",
      shortBio: "Dedicated science educator with a passion for interactive learning",
      position: "Senior Science Teacher",
      school: "Nairobi International School",
      schoolStatus: "active",
      location: "Nairobi, Kenya",
      rating: 4.8,
      ratingCount: 127,
      videoProfileUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      hourlyRate: "$20-30",
      availability: "Weekdays 3-8pm, Weekends 9am-5pm",
      openToWork: true,
      stats: {
        studentsHelped: 532,
        lessonsDelivered: 1275,
        classesCreated: 8,
        successRate: 97
      },
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
          imageSrc: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "academic",
          duration: "8 weeks",
          studentsEnrolled: 28
        },
        {
          id: "class2",
          title: "Introduction to Chemistry",
          subject: "Chemistry",
          level: "Grade 7-8",
          rating: 4.9,
          imageSrc: "https://images.unsplash.com/photo-1587394910144-ab3451fd93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "academic",
          duration: "12 weeks",
          studentsEnrolled: 32
        },
        {
          id: "class3",
          title: "Physics in Everyday Life",
          subject: "Physics",
          level: "Grade 6-7",
          rating: 4.7,
          imageSrc: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          type: "academic",
          duration: "10 weeks",
          studentsEnrolled: 24
        }
      ],
      reviews: [
        {
          id: "rev1",
          reviewer: "Jane Muthoni",
          reviewerType: "Parent",
          reviewerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
          rating: 5,
          comment: "Mr. Mwangi is an exceptional teacher! My daughter has improved tremendously in her science grades since taking his classes. He makes complex concepts accessible and engages students in ways that make learning fun and effective.",
          date: "March 15, 2023"
        },
        {
          id: "rev2",
          reviewer: "John Kamau",
          reviewerType: "Parent",
          reviewerImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
          rating: 4,
          comment: "Very knowledgeable and patient teacher. The interactive experiments really helped my son understand complex concepts. I appreciate how responsive he is to questions and concerns.",
          date: "February 2, 2023"
        },
        {
          id: "rev3",
          reviewer: "Sarah Wanjiku",
          reviewerType: "Student",
          reviewerImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
          rating: 5,
          comment: "Mr. Daniel makes learning science fun! His practical approach to teaching is refreshing and effective. I used to struggle with science, but now it's my favorite subject thanks to his innovative teaching methods.",
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
        }
      ],
      achievements: [
        {
          id: "ach1",
          title: "Teacher of the Year",
          issuer: "Nairobi Education Department",
          year: "2022"
        },
        {
          id: "ach2",
          title: "STEM Innovation Award",
          issuer: "African Science Foundation",
          year: "2021"
        }
      ]
    };
  }

  return getDefaultTeacher();
};

const getDefaultTeacher = () => {
  return {
    id: "default",
    name: "Teacher",
    imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    coverImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    bio: "This teacher is passionate about education and helping students succeed. With a focus on personalized learning approaches and modern teaching techniques, they aim to inspire and empower students to reach their full potential.",
    shortBio: "Experienced educator committed to student success and engagement",
    position: "Teacher",
    school: "Central High School",
    schoolStatus: "active",
    location: "Nairobi, Kenya",
    rating: 4.5,
    ratingCount: 50,
    videoProfileUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    hourlyRate: "$15-25",
    availability: "Weekdays 4-8pm, Weekends 10am-3pm",
    openToWork: true,
    stats: {
      studentsHelped: 250,
      lessonsDelivered: 780,
      classesCreated: 5,
      successRate: 94
    },
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
        type: "academic",
        duration: "10 weeks",
        studentsEnrolled: 22
      },
      {
        id: "class2",
        title: "Critical Thinking Skills",
        subject: "Cross-disciplinary",
        level: "All Grades",
        rating: 4.8,
        imageSrc: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "academic",
        duration: "6 weeks",
        studentsEnrolled: 18
      }
    ],
    reviews: [
      {
        id: "rev1",
        reviewer: "Parent of Student",
        reviewerType: "Parent",
        reviewerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
        rating: 5,
        comment: "Our child has shown significant improvement in their study habits and confidence. The teacher is patient, knowledgeable, and genuinely cares about student success.",
        date: "April 15, 2023"
      },
      {
        id: "rev2",
        reviewer: "High School Student",
        reviewerType: "Student",
        reviewerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
        rating: 4,
        comment: "The classes are engaging and interactive. I've learned a lot of useful techniques that have helped me with my other subjects as well.",
        date: "March 3, 2023"
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
      }
    ],
    achievements: [
      {
        id: "ach1",
        title: "Educator Excellence Award",
        issuer: "School District",
        year: "2021"
      }
    ]
  };
};