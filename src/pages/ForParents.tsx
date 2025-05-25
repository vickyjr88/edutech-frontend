
import { useState } from "react";
import { Check, Shield, Star, Clock, Users, BookOpen, GraduationCap, CreditCard, BookText, Award, PieChart, Medal, Brain, FileText, BarChart, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CurriculumGradeFilter from "@/components/courses/CurriculumGradeFilter";
import PackageDetailsDialog from "@/components/courses/PackageDetailsDialog";

const ForParents = () => {
  const benefits = [
    {
      title: "Quality Education",
      description: "Connect your child with verified, expert teachers who are passionate about education.",
      icon: GraduationCap,
    },
    {
      title: "Safe Learning Environment",
      description: "Our platform provides a secure, monitored online space designed specifically for children.",
      icon: Shield,
    },
    {
      title: "Personalized Attention",
      description: "One-on-one and small group sessions ensure your child receives the attention they need.",
      icon: Users,
    },
    {
      title: "Flexible Scheduling",
      description: "Book sessions that fit your family's busy schedule, with options across different time zones.",
      icon: Clock,
    }
  ];

  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const handleFilterChange = (curriculum: string, grade: string) => {
    setSelectedCurriculum(curriculum);
    setSelectedGrade(grade);
  };

  const openPackageDetails = (packageData: any) => {
    setSelectedPackage(packageData);
    setIsPackageDialogOpen(true);
  };

  const getFilteredPackages = () => {
    if (!selectedCurriculum && !selectedGrade) {
      return popularSubjects;
    }
    
    return popularSubjects.filter(subject => {
      const matchesCurriculum = !selectedCurriculum || subject.curriculum === selectedCurriculum;
      const matchesGrade = !selectedGrade || subject.grade === selectedGrade;
      return matchesCurriculum && matchesGrade;
    });
  };

  const packageDetailsData = {
    // IGCSE Curriculum Packages
    "igcse-1": {
      id: "igcse-1",
      name: "IGCSE Grade/Year 1 Package",
      curriculum: "IGCSE",
      grade: "1",
      subjects: [
        "Early Literacy", 
        "Early Numeracy", 
        "Science Discovery", 
        "Art and Design",
        "Physical Education",
        "Music",
        "Personal, Social and Emotional Development"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Establish a consistent reading routine with simple picture books",
        "Practice counting and number recognition through everyday activities",
        "Encourage curiosity by allowing exploration of natural environments",
        "Support fine motor skills development through drawing and craft activities",
        "Allow for plenty of physical activity to develop gross motor skills"
      ],
      description: "Foundation stage learning with focus on literacy, numeracy and social development"
    },
    "igcse-2": {
      id: "igcse-2",
      name: "IGCSE Grade/Year 2 Package",
      curriculum: "IGCSE",
      grade: "2",
      subjects: [
        "English", 
        "Mathematics", 
        "Science", 
        "History and Geography",
        "Art and Design",
        "Physical Education",
        "Music"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Read together daily, encouraging your child to read simple texts independently",
        "Practice addition and subtraction with numbers up to 20",
        "Explore simple science concepts through home experiments",
        "Discuss family history and local geography to build awareness",
        "Encourage creative expression through art and music"
      ],
      description: "Building on literacy and numeracy foundations with introduction to broader subjects"
    },
    "igcse-3": {
      id: "igcse-3",
      name: "IGCSE Grade/Year 3 Package",
      curriculum: "IGCSE",
      grade: "3",
      subjects: [
        "English", 
        "Mathematics", 
        "Science", 
        "Humanities",
        "Art and Design",
        "Physical Education",
        "Computing",
        "Modern Foreign Language Introduction"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Encourage independent reading with chapter books at appropriate levels",
        "Practice multiplication tables and division concepts",
        "Support scientific inquiry with structured experiments",
        "Begin discussions about different cultures and global awareness",
        "Introduce basic computer skills and digital literacy"
      ],
      description: "Developing independent learning skills with broader subject exposure"
    },
    "igcse-4": {
      id: "igcse-4",
      name: "IGCSE Grade/Year 4 Package",
      curriculum: "IGCSE",
      grade: "4",
      subjects: [
        "English", 
        "Mathematics", 
        "Science", 
        "Geography",
        "History",
        "Art and Design",
        "Computing",
        "Modern Foreign Language",
        "Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Focus on reading comprehension and interpretation",
        "Develop written expression with structured paragraphs",
        "Practice mathematical problem-solving with real-world examples",
        "Encourage independent research projects on topics of interest",
        "Build typing skills and responsible technology usage"
      ],
      description: "Advancing core skills with introduction to more specialized subjects"
    },
    "igcse-5": {
      id: "igcse-5",
      name: "IGCSE Grade/Year 5 Package",
      curriculum: "IGCSE",
      grade: "5",
      subjects: [
        "English Language", 
        "Mathematics", 
        "Science", 
        "Geography",
        "History",
        "Art and Design",
        "Computing",
        "Modern Foreign Language",
        "Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Focus on developing strong essay writing skills",
        "Practice mathematical reasoning and multi-step problems",
        "Begin preparation for Primary Checkpoint exams the following year",
        "Encourage critical thinking through debates and discussions",
        "Support increasing independence in study habits"
      ],
      description: "Pre-checkpoint year focused on solidifying primary knowledge"
    },
    "igcse-6": {
      id: "igcse-6",
      name: "IGCSE Grade/Year 6 Package",
      curriculum: "IGCSE",
      grade: "6",
      subjects: [
        "English Language", 
        "Mathematics", 
        "Science (Physics, Chemistry, Biology)", 
        "Geography",
        "History",
        "Computer Science",
        "Art and Design",
        "Modern Foreign Language"
      ],
      hasCheckpoint: true,
      developmentTips: [
        "Establish regular revision schedules in preparation for checkpoint exams",
        "Practice past checkpoint papers to build exam confidence",
        "Develop time management skills for exam situations",
        "Maintain a balance between checkpoint preparation and overall education",
        "Use mind maps and other visual tools to connect concepts across subjects"
      ],
      description: "Primary Checkpoint preparation year with comprehensive assessment focus"
    },
    "igcse-7": {
      id: "igcse-7",
      name: "IGCSE Grade/Year 7 Package",
      curriculum: "IGCSE",
      grade: "7",
      subjects: [
        "English Language", 
        "English Literature", 
        "Mathematics", 
        "Coordinated Sciences (Physics, Chemistry, Biology)",
        "Geography",
        "History",
        "Computer Science",
        "Modern Foreign Language",
        "Art and Design",
        "Music"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Begin developing more sophisticated analytical writing skills",
        "Strengthen algebraic understanding in mathematics",
        "Focus on the scientific method and laboratory skills",
        "Encourage wider reading beyond the curriculum",
        "Start connecting learning across different subject areas"
      ],
      description: "First year of lower secondary with deeper subject specialization"
    },
    "igcse-8": {
      id: "igcse-8",
      name: "IGCSE Grade/Year 8 Package",
      curriculum: "IGCSE",
      grade: "8",
      subjects: [
        "English Language", 
        "English Literature", 
        "Mathematics", 
        "Physics",
        "Chemistry",
        "Biology",
        "Geography",
        "History",
        "Computer Science",
        "Modern Foreign Language",
        "Art and Design"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Develop note-taking and organization skills for multiple subjects",
        "Practice longer-form writing with proper citations and research",
        "Build study skills to manage the increasing academic workload",
        "Begin discussions about IGCSE subject choices for Year 10",
        "Encourage extracurricular activities to develop well-rounded skills"
      ],
      description: "Building toward secondary checkpoint with subject specialization"
    },
    "igcse-9": {
      id: "igcse-9",
      name: "IGCSE Grade/Year 9 Package",
      curriculum: "IGCSE",
      grade: "9",
      subjects: [
        "English Language", 
        "English Literature", 
        "Mathematics", 
        "Physics",
        "Chemistry",
        "Biology",
        "Geography",
        "History",
        "Computer Science",
        "Modern Foreign Language",
        "Global Perspectives"
      ],
      hasCheckpoint: true,
      developmentTips: [
        "Focus on secondary checkpoint exam preparation",
        "Finalize IGCSE subject choices for Years 10-11",
        "Practice past checkpoint papers to identify strengths and weaknesses",
        "Develop effective revision techniques suited to learning style",
        "Begin thinking about longer-term academic and career goals"
      ],
      description: "Secondary Checkpoint year with IGCSE preparation focus"
    },
    
    // IB Curriculum Packages
    "ib-1": {
      id: "ib-1",
      name: "IB PYP Year 1 Package",
      curriculum: "IB",
      grade: "1",
      subjects: [
        "Language", 
        "Mathematics", 
        "Science", 
        "Social Studies",
        "Arts",
        "Personal, Social and Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support inquiry-based learning by asking open-ended questions",
        "Encourage reflection on learning experiences",
        "Help your child make connections between classroom learning and the world",
        "Foster international-mindedness through discussions about different cultures",
        "Support the development of the IB Learner Profile attributes at home"
      ],
      description: "IB Primary Years Programme foundation with transdisciplinary themes"
    },
    "ib-2": {
      id: "ib-2",
      name: "IB PYP Year 2 Package",
      curriculum: "IB",
      grade: "2",
      subjects: [
        "Language", 
        "Mathematics", 
        "Science", 
        "Social Studies",
        "Arts",
        "Personal, Social and Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support transdisciplinary learning by connecting subjects at home",
        "Encourage questions and curiosity about the world",
        "Practice reflection on both successes and challenges",
        "Support your child in taking action based on their learning",
        "Promote international-mindedness through exposure to diverse perspectives"
      ],
      description: "Building on PYP foundations with increased inquiry depth"
    },
    "ib-3": {
      id: "ib-3",
      name: "IB PYP Year 3 Package",
      curriculum: "IB",
      grade: "3",
      subjects: [
        "Language", 
        "Mathematics", 
        "Science", 
        "Social Studies",
        "Arts",
        "Personal, Social and Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support the development of research skills using various resources",
        "Encourage critical thinking by evaluating information",
        "Help your child connect global issues to local contexts",
        "Foster independence in learning and time management",
        "Support language development in mother tongue and other languages"
      ],
      description: "Developing deeper conceptual understanding through inquiry"
    },
    "ib-4": {
      id: "ib-4",
      name: "IB PYP Year 4 Package",
      curriculum: "IB",
      grade: "4",
      subjects: [
        "Language", 
        "Mathematics", 
        "Science", 
        "Social Studies",
        "Arts",
        "Personal, Social and Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support increasingly complex research projects",
        "Encourage critical analysis of multiple perspectives",
        "Help your child take meaningful action based on learning",
        "Promote self-management and organizational skills",
        "Support the development of communication skills across languages"
      ],
      description: "Advanced PYP with greater emphasis on global contexts"
    },
    "ib-5": {
      id: "ib-5",
      name: "IB PYP Year 5 Package",
      curriculum: "IB",
      grade: "5",
      subjects: [
        "Language", 
        "Mathematics", 
        "Science", 
        "Social Studies",
        "Arts",
        "Personal, Social and Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support preparation for the PYP Exhibition project",
        "Encourage deeper research with multiple sources",
        "Help develop presentation and communication skills",
        "Foster collaboration with peers on group projects",
        "Support the transition to the more subject-focused MYP"
      ],
      description: "Final PYP year with Exhibition preparation"
    },
    "ib-6": {
      id: "ib-6",
      name: "IB MYP Year 1 Package",
      curriculum: "IB",
      grade: "6",
      subjects: [
        "Language and Literature", 
        "Language Acquisition", 
        "Mathematics", 
        "Sciences",
        "Individuals and Societies",
        "Arts",
        "Design",
        "Physical and Health Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support the transition to subject-specific learning",
        "Help develop approaches to learning (ATL) skills",
        "Encourage connections between subjects through global contexts",
        "Support the development of conceptual understanding",
        "Foster service as action activities connected to learning"
      ],
      description: "First MYP year focusing on transition from PYP"
    },
    "ib-7": {
      id: "ib-7",
      name: "IB MYP Year 2 Package",
      curriculum: "IB",
      grade: "7",
      subjects: [
        "Language and Literature", 
        "Language Acquisition", 
        "Mathematics", 
        "Sciences",
        "Individuals and Societies",
        "Arts",
        "Design",
        "Physical and Health Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support increasing subject-specific rigor",
        "Encourage interdisciplinary thinking across subjects",
        "Help develop research skills using academic sources",
        "Support the development of critical and creative thinking",
        "Foster service as action initiatives based on personal interests"
      ],
      description: "Building MYP foundations with greater subject depth"
    },
    "ib-8": {
      id: "ib-8",
      name: "IB MYP Year 3 Package",
      curriculum: "IB",
      grade: "8",
      subjects: [
        "Language and Literature", 
        "Language Acquisition", 
        "Mathematics", 
        "Sciences",
        "Individuals and Societies",
        "Arts",
        "Design",
        "Physical and Health Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support more sophisticated analysis in all subjects",
        "Encourage evaluation of information and sources",
        "Help develop time management for longer projects",
        "Support the development of academic writing skills",
        "Foster critical engagement with global issues"
      ],
      description: "Advancing MYP skills with more complex inquiry"
    },
    
    // American Curriculum Packages
    "american-1": {
      id: "american-1",
      name: "American Curriculum Grade 1",
      curriculum: "American",
      grade: "1",
      subjects: [
        "English Language Arts", 
        "Mathematics", 
        "Science", 
        "Social Studies",
        "Art",
        "Music",
        "Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Practice foundational reading skills with phonics games",
        "Reinforce addition and subtraction with everyday examples",
        "Explore science through simple experiments at home",
        "Discuss community helpers and neighborhood geography",
        "Establish consistent homework routines"
      ],
      description: "Common Core aligned with foundational literacy and numeracy focus"
    },
    "american-2": {
      id: "american-2",
      name: "American Curriculum Grade 2",
      curriculum: "American",
      grade: "2",
      subjects: [
        "English Language Arts", 
        "Mathematics", 
        "Science", 
        "Social Studies",
        "Art",
        "Music",
        "Physical Education",
        "Computer Skills"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Focus on reading fluency and simple comprehension",
        "Practice addition and subtraction with regrouping",
        "Explore habitats and life cycles through observation",
        "Discuss historical figures and their contributions",
        "Develop independence in completing homework tasks"
      ],
      description: "Building literacy fluency with introduction to STEM concepts"
    },
    "american-3": {
      id: "american-3",
      name: "American Curriculum Grade 3",
      curriculum: "American",
      grade: "3",
      subjects: [
        "English Language Arts", 
        "Mathematics", 
        "Science", 
        "Social Studies",
        "Art",
        "Music",
        "Physical Education",
        "Computer Science"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Focus on reading comprehension with chapter books",
        "Practice multiplication and division concepts",
        "Develop scientific inquiry skills through structured experiments",
        "Explore community and state history",
        "Introduce keyboarding and basic digital skills"
      ],
      description: "Common Core with state standardized testing preparation"
    },
    "american-4": {
      id: "american-4",
      name: "American Curriculum Grade 4",
      curriculum: "American",
      grade: "4",
      subjects: [
        "English Language Arts", 
        "Mathematics", 
        "Science", 
        "Social Studies",
        "Art",
        "Music",
        "Physical Education",
        "Computer Science"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Develop essay writing with proper paragraph structure",
        "Master multiplication facts and introduce fractions",
        "Conduct experiments with variables and recording results",
        "Study state history and geography in depth",
        "Practice research skills using both digital and print resources"
      ],
      description: "Advanced elementary skills with state standards alignment"
    },
    "american-5": {
      id: "american-5",
      name: "American Curriculum Grade 5",
      curriculum: "American",
      grade: "5",
      subjects: [
        "English Language Arts", 
        "Mathematics", 
        "Science", 
        "Social Studies",
        "Art",
        "Music",
        "Physical Education",
        "Computer Science",
        "Health"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Focus on critical reading across fiction and nonfiction",
        "Master fractions, decimals, and early algebraic concepts",
        "Prepare for middle school transition with organizational skills",
        "Develop research projects with multiple sources",
        "Practice presentation skills across subjects"
      ],
      description: "Final elementary grade with middle school preparation"
    },
    "american-6": {
      id: "american-6",
      name: "American Curriculum Grade 6",
      curriculum: "American",
      grade: "6",
      subjects: [
        "English Language Arts", 
        "Mathematics", 
        "Earth Science", 
        "World History",
        "Physical Education",
        "Electives (Art, Music, Technology)"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Adapt to multiple teachers and subject transitions",
        "Develop organization systems for assignments across classes",
        "Practice note-taking strategies for different subjects",
        "Begin using planners or digital tools to track homework",
        "Build independence in study habits and time management"
      ],
      description: "Middle school transition with departmentalized instruction"
    },
    "american-7": {
      id: "american-7",
      name: "American Curriculum Grade 7",
      curriculum: "American",
      grade: "7",
      subjects: [
        "English Language Arts", 
        "Pre-Algebra/Mathematics", 
        "Life Science", 
        "U.S. History",
        "Physical Education",
        "Electives (Foreign Language, Art, Music, Technology)"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Focus on analytical reading of more complex texts",
        "Strengthen pre-algebra skills for high school preparation",
        "Develop laboratory skills in science",
        "Practice thesis-driven essay writing",
        "Build effective study strategies for tests and quizzes"
      ],
      description: "Core middle school curriculum with elective options"
    },
    "american-8": {
      id: "american-8",
      name: "American Curriculum Grade 8",
      curriculum: "American",
      grade: "8",
      subjects: [
        "English Language Arts", 
        "Algebra I/Mathematics", 
        "Physical Science", 
        "Civics/Government",
        "Physical Education",
        "Electives (Foreign Language, Art, Music, Technology)"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Prepare for high school transition through rigorous academics",
        "Master algebra concepts as foundation for high school math",
        "Develop stronger analytical writing skills",
        "Practice advanced research with proper citations",
        "Begin considering four-year high school planning"
      ],
      description: "Final middle school year with high school preparation"
    },
    
    // British Curriculum Packages
    "british-1": {
      id: "british-1",
      name: "British Year 1 Package",
      curriculum: "British",
      grade: "1",
      subjects: [
        "English", 
        "Mathematics", 
        "Science", 
        "History",
        "Geography",
        "Art and Design",
        "Music",
        "Computing",
        "Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Focus on phonics for reading development",
        "Practice counting, addition and subtraction to 20",
        "Explore the natural world through observation",
        "Discuss family history and familiar places",
        "Develop fine motor skills through varied activities"
      ],
      description: "Key Stage 1 foundation with phonics and early numeracy"
    },
    "british-2": {
      id: "british-2",
      name: "British Year 2 Package",
      curriculum: "British",
      grade: "2",
      subjects: [
        "English", 
        "Mathematics", 
        "Science", 
        "History",
        "Geography",
        "Art and Design",
        "Music",
        "Computing",
        "Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support reading fluency and comprehension",
        "Reinforce number bonds and place value",
        "Practice descriptive writing with interesting vocabulary",
        "Explore materials and their properties through experiments",
        "Prepare for Key Stage 1 SATs assessments"
      ],
      description: "Final Key Stage 1 year with SATs preparation"
    },
    "british-3": {
      id: "british-3",
      name: "British Year 3 Package",
      curriculum: "British",
      grade: "3",
      subjects: [
        "English", 
        "Mathematics", 
        "Science", 
        "History",
        "Geography",
        "Art and Design",
        "Music",
        "Computing",
        "Physical Education",
        "Modern Foreign Language"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Focus on reading comprehension with more complex texts",
        "Master times tables up to 12×12",
        "Develop cursive handwriting skills",
        "Support increasing independence in homework",
        "Encourage research using different sources"
      ],
      description: "Lower Key Stage 2 transition with broader subject focus"
    },
    "british-4": {
      id: "british-4",
      name: "British Year 4 Package",
      curriculum: "British",
      grade: "4",
      subjects: [
        "English", 
        "Mathematics", 
        "Science", 
        "History",
        "Geography",
        "Art and Design",
        "Music",
        "Computing",
        "Physical Education",
        "Modern Foreign Language"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Strengthen grammar and punctuation skills",
        "Develop mathematical reasoning and problem-solving",
        "Support scientific inquiry with predictions and conclusions",
        "Help organize multiday homework assignments",
        "Encourage wider reading across genres"
      ],
      description: "Building Key Stage 2 foundations with deeper subject knowledge"
    },
    "british-5": {
      id: "british-5",
      name: "British Year 5 Package",
      curriculum: "British",
      grade: "5",
      subjects: [
        "English", 
        "Mathematics", 
        "Science", 
        "History",
        "Geography",
        "Art and Design",
        "Music",
        "Computing",
        "Physical Education",
        "Modern Foreign Language"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Develop more sophisticated writing across different genres",
        "Master fractions, decimals and percentages",
        "Begin preparing for Year 6 SATs with regular practice",
        "Encourage critical evaluation of information sources",
        "Support independent project work and research"
      ],
      description: "Upper Key Stage 2 with pre-SATs preparation"
    },
    "british-6": {
      id: "british-6",
      name: "British Year 6 Package",
      curriculum: "British",
      grade: "6",
      subjects: [
        "English", 
        "Mathematics", 
        "Science", 
        "History",
        "Geography",
        "Art and Design",
        "Music",
        "Computing",
        "Physical Education",
        "Modern Foreign Language"
      ],
      hasCheckpoint: true,
      developmentTips: [
        "Focus on SATs preparation with practice tests",
        "Master key grammar, punctuation and spelling rules",
        "Develop mathematical reasoning and problem-solving",
        "Prepare for secondary school transition",
        "Build confidence in test-taking strategies"
      ],
      description: "Final Key Stage 2 year with SATs examination focus"
    },
    "british-7": {
      id: "british-7",
      name: "British Year 7 Package",
      curriculum: "British",
      grade: "7",
      subjects: [
        "English", 
        "Mathematics", 
        "Science", 
        "History",
        "Geography",
        "Modern Foreign Languages",
        "Design and Technology",
        "Art and Design",
        "Music",
        "Computing",
        "Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support transition to multiple teachers and subjects",
        "Develop organizational skills for different classes",
        "Help establish homework routines with planner",
        "Encourage wider reading to support English development",
        "Build independence in preparation and revision"
      ],
      description: "Key Stage 3 transition year with broader subject range"
    },
    "british-8": {
      id: "british-8",
      name: "British Year 8 Package",
      curriculum: "British",
      grade: "8",
      subjects: [
        "English", 
        "Mathematics", 
        "Science (Physics, Chemistry, Biology)", 
        "History",
        "Geography",
        "Modern Foreign Languages",
        "Design and Technology",
        "Art and Design",
        "Music",
        "Computing",
        "Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Focus on developing analytical writing skills",
        "Support algebraic thinking and mathematical problem-solving",
        "Help organize revision schedules for end-of-year exams",
        "Encourage critical engagement with different perspectives",
        "Begin discussing GCSE options for Year 10"
      ],
      description: "Middle Key Stage 3 with deeper subject specialization"
    },
    "british-9": {
      id: "british-9",
      name: "British Year 9 Package",
      curriculum: "British",
      grade: "9",
      subjects: [
        "English", 
        "Mathematics", 
        "Science (Physics, Chemistry, Biology)", 
        "History",
        "Geography",
        "Modern Foreign Languages",
        "Design and Technology",
        "Art and Design",
        "Music",
        "Computing",
        "Physical Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support GCSE subject selection process",
        "Focus on developing study skills for GCSE preparation",
        "Encourage deeper research skills with academic sources",
        "Help establish effective revision techniques",
        "Build independence in academic organization and planning"
      ],
      description: "Final Key Stage 3 year with GCSE preparation focus"
    },
    
    // Kenyan Curriculum Packages
    "kenyan-1": {
      id: "kenyan-1",
      name: "Kenyan Curriculum Grade 1",
      curriculum: "Kenyan",
      grade: "1",
      subjects: [
        "English", 
        "Kiswahili", 
        "Mathematics", 
        "Environmental Activities",
        "Hygiene and Nutrition",
        "Religious Education",
        "Movement and Creative Activities"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support bilingual development in English and Kiswahili",
        "Use local materials to reinforce numeracy concepts",
        "Explore the immediate environment through guided observation",
        "Incorporate indigenous knowledge in learning activities",
        "Encourage creative expression through art and movement"
      ],
      description: "CBC foundation with integrated learning approach"
    },
    "kenyan-2": {
      id: "kenyan-2",
      name: "Kenyan Curriculum Grade 2",
      curriculum: "Kenyan",
      grade: "2",
      subjects: [
        "English", 
        "Kiswahili", 
        "Mathematics", 
        "Environmental Activities",
        "Hygiene and Nutrition",
        "Religious Education",
        "Movement and Creative Activities"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Continue bilingual literacy development with reading practice",
        "Reinforce mathematical operations with everyday examples",
        "Support environmental exploration beyond the immediate surroundings",
        "Practice hygiene habits consistently at home",
        "Encourage storytelling in both English and Kiswahili"
      ],
      description: "Building on CBC foundations with practical skills focus"
    },
    "kenyan-3": {
      id: "kenyan-3",
      name: "Kenyan Curriculum Grade 3",
      curriculum: "Kenyan",
      grade: "3",
      subjects: [
        "English", 
        "Kiswahili", 
        "Mathematics", 
        "Environmental Activities",
        "Hygiene and Nutrition",
        "Religious Education",
        "Movement and Creative Activities",
        "Indigenous Language"
      ],
      hasCheckpoint: true,
      developmentTips: [
        "Prepare for the Grade 3 national assessment",
        "Support the development of reading fluency in multiple languages",
        "Practice mathematical problem-solving with local contexts",
        "Involve your child in community activities to connect learning",
        "Reinforce value-based education at home"
      ],
      description: "First CBC assessment stage with holistic development focus"
    },
    "kenyan-4": {
      id: "kenyan-4",
      name: "Kenyan Curriculum Grade 4",
      curriculum: "Kenyan",
      grade: "4",
      subjects: [
        "English", 
        "Kiswahili", 
        "Mathematics", 
        "Science and Technology", 
        "Social Studies",
        "Creative Arts",
        "Religious Education",
        "Agriculture",
        "Physical and Health Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support transition to the upper primary curriculum structure",
        "Encourage practical application of science concepts at home",
        "Develop agricultural awareness through home gardening projects",
        "Reinforce reading comprehension with varied texts",
        "Support digital literacy with appropriate technology exposure"
      ],
      description: "Upper primary transition with subject specialization"
    },
    "kenyan-5": {
      id: "kenyan-5",
      name: "Kenyan Curriculum Grade 5",
      curriculum: "Kenyan",
      grade: "5",
      subjects: [
        "English", 
        "Kiswahili", 
        "Mathematics", 
        "Science and Technology", 
        "Social Studies",
        "Creative Arts",
        "Religious Education",
        "Agriculture",
        "Physical and Health Education",
        "Home Science"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support intermediate skills in core subjects",
        "Encourage critical thinking about social and environmental issues",
        "Develop entrepreneurial mindset through practical projects",
        "Support community service and values development",
        "Practice time management with increasing workload"
      ],
      description: "Intermediate upper primary with practical skills integration"
    },
    "kenyan-6": {
      id: "kenyan-6",
      name: "Kenyan Curriculum Grade 6",
      curriculum: "Kenyan",
      grade: "6",
      subjects: [
        "English", 
        "Kiswahili", 
        "Mathematics", 
        "Science and Technology", 
        "Social Studies",
        "Creative Arts",
        "Religious Education",
        "Agriculture",
        "Physical and Health Education",
        "Home Science"
      ],
      hasCheckpoint: true,
      developmentTips: [
        "Prepare for the Grade 6 national assessment",
        "Support exam preparation with regular practice",
        "Develop strong study habits for junior secondary preparation",
        "Encourage critical thinking and problem-solving skills",
        "Support career exploration based on strengths and interests"
      ],
      description: "Final upper primary year with national assessment focus"
    },
    "kenyan-7": {
      id: "kenyan-7",
      name: "Kenyan Curriculum Grade 7",
      curriculum: "Kenyan",
      grade: "7",
      subjects: [
        "English", 
        "Kiswahili", 
        "Mathematics", 
        "Integrated Science", 
        "Health Education",
        "Social Studies",
        "Pre-Technical and Pre-Career Education",
        "Creative Arts",
        "Religious Education",
        "Agriculture",
        "Business Studies"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support transition to junior secondary school structure",
        "Help identify areas of strength for future specialization",
        "Develop digital literacy skills for modern learning",
        "Encourage participation in clubs and societies",
        "Support the development of independent study habits"
      ],
      description: "First junior secondary year with career exploration focus"
    },
    "kenyan-8": {
      id: "kenyan-8",
      name: "Kenyan Curriculum Grade 8",
      curriculum: "Kenyan",
      grade: "8",
      subjects: [
        "English", 
        "Kiswahili", 
        "Mathematics", 
        "Integrated Science", 
        "Health Education",
        "Social Studies",
        "Pre-Technical and Pre-Career Education",
        "Business Studies",
        "Religious Education",
        "Agriculture",
        "Optional Subjects"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Support exploration of career pathways through subject choices",
        "Develop stronger research and analytical skills",
        "Encourage community service aligned with interests",
        "Support time management with increasing academic demands",
        "Help identify strengths for Senior School pathway selection"
      ],
      description: "Second junior secondary year with pathway preparation"
    }
  };

  const getCurriculumIcon = (curriculum: string) => {
    switch(curriculum) {
      case "igcse": return BookOpenCheck;
      case "ib": return GraduationCap;
      case "american": return FileText;
      case "british": return BookOpen;
      case "kenyan": return BookText;
      default: return BookText;
    }
  };

  const getSubjectCount = (id: string) => {
    if (packageDetailsData[id]) {
      return packageDetailsData[id].subjects.length;
    }
    return 5; // Default number if not found in the detailed data
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case "Primary": return "text-green-700";
      case "Secondary": return "text-blue-700";
      default: return "text-gray-700";
    }
  };

  const popularSubjects = [
    { 
      name: "IGCSE Grade 6 Package", 
      level: "Primary", 
      popularity: "Most Popular",
      curriculum: "igcse",
      grade: "6",
      id: "igcse-6",
      description: "Complete foundation with checkpoint exam preparation"
    },
    { 
      name: "IB MYP Year 7 Package", 
      level: "Secondary", 
      popularity: "Popular",
      curriculum: "ib",
      grade: "7",
      id: "ib-7",
      description: "Holistic education with inquiry-based learning"
    },
    { 
      name: "American Curriculum Grade 5", 
      level: "Primary", 
      popularity: "Popular",
      curriculum: "american",
      grade: "5",
      id: "american-5",
      description: "Common Core aligned with project-based learning"
    },
    { 
      name: "British Year 9 Package", 
      level: "Secondary", 
      popularity: "Trending",
      curriculum: "british",
      grade: "9",
      id: "british-9",
      description: "Key Stage 3 with comprehensive assessment"
    },
    { 
      name: "Kenyan Curriculum Grade 4", 
      level: "Primary", 
      popularity: "Growing",
      curriculum: "kenyan",
      grade: "4",
      id: "kenyan-4",
      description: "Competency-based curriculum with bilingual focus"
    },
    { 
      name: "IGCSE Grade 8 Package", 
      level: "Secondary", 
      popularity: "Essential",
      curriculum: "igcse",
      grade: "8",
      id: "igcse-8",
      description: "Advanced preparation for future IGCSE exams"
    },
    { 
      name: "American Curriculum Grade 3", 
      level: "Primary", 
      popularity: "Recommended",
      curriculum: "american",
      grade: "3",
      id: "american-3",
      description: "Common Core with state standardized testing preparation"
    },
    { 
      name: "British Year 6 Package", 
      level: "Primary", 
      popularity: "Important",
      curriculum: "british",
      grade: "6",
      id: "british-6",
      description: "Final Key Stage 2 with SATs examination focus"
    },
    { 
      name: "Kenyan Curriculum Grade 7", 
      level: "Secondary", 
      popularity: "New",
      curriculum: "kenyan",
      grade: "7",
      id: "kenyan-7",
      description: "First junior secondary year with career exploration"
    },
  ];

  const testimonials = [
    {
      name: "Amina Khalid",
      location: "Nairobi, Kenya",
      testimonial: "Kidato has transformed my daughter's attitude toward math. Her confidence has soared, and she's now top of her class!",
      avatar: "https://randomuser.me/api/portraits/women/54.jpg",
      childAge: "Daughter, 12"
    },
    {
      name: "Nadia Mensah",
      location: "Accra, Ghana",
      testimonial: "As a working mother, I struggled to find quality tutoring that would fit our schedule. Kidato solved this problem with their flexible timing and excellent teachers.",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      childAge: "Son, 9"
    },
    {
      name: "Fatou Diallo",
      location: "Dakar, Senegal",
      testimonial: "The personalized attention my son receives has made all the difference. His teacher truly understands his learning style and challenges him appropriately.",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
      childAge: "Son, 14"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="bg-gradient-to-r from-kidato-orange to-orange-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Unlock Your Child's Potential with Personalized Learning</h1>
              <p className="text-xl mb-8">Trusted by thousands of parents across Africa to provide quality, accessible education that fits your family's needs.</p>
              <div className="space-x-4">
                <Button size="lg" className="bg-white text-kidato-orange hover:bg-gray-100">
                  <Link to="/find-tutors">Find a Tutor</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/explore-classes">Explore Classes</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Why Parents Choose Kidato</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                We partner with you to support your child's educational journey in a safe, engaging environment.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-kidato-orange" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How Kidato Works for Your Family</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Getting started is simple - we'll guide you through every step.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Find the Perfect Match",
                  description: "Browse our qualified teachers or let us recommend the best match for your child's needs."
                },
                {
                  step: "2",
                  title: "Schedule Sessions",
                  description: "Book one-on-one tutoring or small group classes at times that work for your family."
                },
                {
                  step: "3",
                  title: "Watch Them Grow",
                  description: "Track your child's progress with detailed reports and regular check-ins with their teacher."
                }
              ].map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center">
                  <div className="bg-kidato-orange text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" className="bg-kidato-orange hover:bg-orange-600 text-white">
                <Link to="/parent-signup">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Popular Learning Packages</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Find the perfect full home learning package for your child based on their curriculum and grade level.
              </p>
            </div>
            
            <CurriculumGradeFilter onFilterChange={handleFilterChange} />
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredPackages().map((subject, index) => {
                const CurriculumIcon = getCurriculumIcon(subject.curriculum);
                const subjectCount = getSubjectCount(subject.id);
                const levelClass = getLevelColor(subject.level);
                
                return (
                  <Card 
                    key={index} 
                    className="border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative">
                      <div className={`absolute top-0 right-0 z-10 ${
                        subject.popularity === "Most Popular" ? "bg-kidato-orange" :
                        subject.popularity === "Trending" ? "bg-pink-500" :
                        subject.popularity === "Essential" ? "bg-amber-500" :
                        subject.popularity === "Growing" ? "bg-green-500" :
                        subject.popularity === "Recommended" ? "bg-purple-500" :
                        subject.popularity === "Important" ? "bg-indigo-500" :
                        subject.popularity === "New" ? "bg-teal-500" :
                        "bg-blue-500"
                      } text-white py-1 px-3 rounded-bl-lg text-xs font-medium`}>
                        {subject.popularity}
                      </div>
                      <div className={`h-1.5 w-full ${
                        subject.curriculum === "igcse" ? "bg-indigo-500" :
                        subject.curriculum === "ib" ? "bg-sky-500" :
                        subject.curriculum === "american" ? "bg-rose-500" :
                        subject.curriculum === "british" ? "bg-emerald-500" :
                        "bg-amber-500"
                      }`}></div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className={`rounded-full p-2 mr-3 ${
                              subject.curriculum === "igcse" ? "bg-indigo-100 text-indigo-600" :
                              subject.curriculum === "ib" ? "bg-sky-100 text-sky-600" :
                              subject.curriculum === "american" ? "bg-rose-100 text-rose-600" :
                              subject.curriculum === "british" ? "bg-emerald-100 text-emerald-600" :
                              "bg-amber-100 text-amber-600"
                            }`}>
                              <CurriculumIcon className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{subject.name}</h3>
                          </div>
                          <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${levelClass} flex items-center`}>
                              {subject.level === "Primary" ? (
                                <BookOpen className={`h-4 w-4 mr-1 ${levelClass}`} />
                              ) : (
                                <GraduationCap className={`h-4 w-4 mr-1 ${levelClass}`} />
                              )}
                              {subject.level}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-600 flex items-center">
                              <BookText className="h-4 w-4 mr-1 text-gray-500" />
                              {subjectCount} Subjects
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-6">{subject.description}</p>
                      
                      <div className="mt-2 flex flex-col space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Curriculum-aligned content</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Regular assessments</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Learning materials included</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full mt-6 bg-white border-2 border-kidato-orange text-kidato-orange hover:bg-orange-50 group-hover:bg-kidato-orange group-hover:text-white transition-colors"
                        onClick={() => openPackageDetails(packageDetailsData[subject.id] || {
                          id: subject.id,
                          name: subject.name,
                          curriculum: subject.curriculum,
                          grade: subject.grade,
                          subjects: ["Mathematics", "English", "Science", "Social Studies", "Arts"],
                          hasCheckpoint: subject.grade === "6" || subject.grade === "9" || subject.grade === "3",
                          developmentTips: [
                            "Establish consistent homework routines",
                            "Encourage reading for at least 30 minutes daily",
                            "Practice concepts through real-world applications",
                            "Balance screen time with physical activities",
                            "Maintain regular communication with teachers"
                          ],
                          description: `Complete package for ${subject.curriculum.toUpperCase()} curriculum Grade ${subject.grade}`
                        })}
                      >
                        <span>View Details</span>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-kidato-light-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What Parents Are Saying</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Join families who have seen real academic growth and increased confidence in their children.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="h-14 w-14 rounded-full mr-4" 
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                        <p className="text-xs text-kidato-purple">{testimonial.childAge}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.testimonial}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Affordable Learning Options</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Quality education that fits your budget with transparent, flexible pricing.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "One-on-One Tuition Classes",
                  price: "$15-35",
                  unit: "per hour",
                  icon: Users,
                  features: [
                    "Personalized attention",
                    "Curriculum-aligned instruction",
                    "Flexible scheduling",
                    "Regular progress reports"
                  ],
                  description: "Personalized instruction tailored to individual student needs.",
                  cta: "Find a Tutor",
                  link: "/find-tutors"
                },
                {
                  title: "Learning Packages",
                  price: "$250-500",
                  unit: "per package",
                  icon: BookText,
                  features: [
                    "8-12 sessions bundled",
                    "Comprehensive subject coverage",
                    "End of term assessments",
                    "Discounted rates"
                  ],
                  description: "Complete learning solutions for students seeking full online education.",
                  cta: "View Packages",
                  link: "/learning-packages",
                  highlighted: true
                },
                {
                  title: "Exam-Prep",
                  price: "$25-60",
                  unit: "per hour",
                  icon: GraduationCap,
                  features: [
                    "Targeted test strategies",
                    "Practice exams",
                    "Personalized feedback",
                    "Confidence building"
                  ],
                  description: "Specialized sessions focused on test preparation and exam strategies.",
                  cta: "Prep for Exams",
                  link: "/exam-prep"
                }
              ].map((plan, index) => (
                <Card key={index} className={`border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden relative ${plan.highlighted ? 'border-kidato-orange border-2' : ''}`}>
                  {plan.highlighted && (
                    <div className="bg-kidato-orange text-white text-center py-1.5 text-sm font-medium">
                      Recommended
                    </div>
                  )}
                  <CardHeader className={`text-center pb-0 ${plan.highlighted ? 'pt-6' : 'pt-8'}`}>
                    <div className={`rounded-full mx-auto w-14 h-14 flex items-center justify-center mb-4 ${plan.highlighted ? 'bg-orange-100' : 'bg-blue-100'}`}>
                      <plan.icon className={`h-7 w-7 ${plan.highlighted ? 'text-kidato-orange' : 'text-kidato-purple'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                    <div className="mt-2">
                      <span className={`text-3xl font-bold ${plan.highlighted ? 'text-kidato-orange' : 'text-kidato-purple'}`}>{plan.price}</span>
                      <span className="text-gray-600"> {plan.unit}</span>
                    </div>
                    <p className="mt-2 text-gray-600 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className={`h-5 w-5 ${plan.highlighted ? 'text-kidato-orange' : 'text-green-500'} mr-2 flex-shrink-0`} />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.highlighted ? 'bg-kidato-orange hover:bg-orange-600' : 'bg-kidato-purple hover:bg-kidato-dark-blue'} text-white`}
                    >
                      <Link to={plan.link}>{plan.cta}</Link>
                    </Button>
                  </CardContent>
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-kidato-orange text-white py-1 px-3 rounded-bl-lg text-xs font-medium">
                        Best Value
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8 text-gray-600">
              <p>All prices are in USD. Payment plans available for larger packages.</p>
              <div className="flex items-center justify-center mt-4 space-x-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <span>Secure payments via credit card, mobile money, or bank transfer</span>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions from parents like you.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {[
                {
                  question: "How are Kidato teachers vetted?",
                  answer: "All teachers undergo a rigorous selection process including background checks, credential verification, teaching demonstrations, and ongoing performance evaluations."
                },
                {
                  question: "What ages/grades do you support?",
                  answer: "We offer tutoring and classes for students ages 5-18, covering primary and secondary education levels across all major African curricula."
                },
                {
                  question: "How do online sessions work?",
                  answer: "Sessions take place on our secure, child-friendly video platform with interactive tools. All you need is a device (computer, tablet, or smartphone) and an internet connection."
                },
                {
                  question: "What if we're not satisfied with a teacher?",
                  answer: "Your satisfaction is guaranteed. If you're not happy with your first session with a new teacher, we'll offer a replacement session with a different teacher at no additional cost."
                },
                {
                  question: "How do I track my child's progress?",
                  answer: "You'll receive detailed progress reports after each session, plus monthly comprehensive assessments. You can also schedule parent-teacher conferences at any time."
                }
              ].map((faq, index) => (
                <div key={index} className="py-6">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">Still have questions? We're here to help.</p>
              <Button variant="outline" className="border-kidato-orange text-kidato-orange hover:bg-orange-50">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-kidato-orange text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6">Give Your Child the Learning Support They Deserve</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of parents who trust Kidato to nurture their children's educational journey.
            </p>
            <Button size="lg" className="bg-white text-kidato-orange hover:bg-gray-100">
              <Link to="/parent-signup">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <PackageDetailsDialog 
        open={isPackageDialogOpen} 
        onOpenChange={setIsPackageDialogOpen}
        packageDetail={selectedPackage}
      />
    </div>
  );
};

export default ForParents;
