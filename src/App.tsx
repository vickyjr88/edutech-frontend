
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthCallback from "./pages/AuthCallback";
import ForTeachers from "./pages/ForTeachers";
import ForParents from "./pages/ForParents";
import ForStudents from "./pages/ForStudents";
import HowItWorks from "./pages/HowItWorks";
import AllClasses from "./pages/AllClasses";
import ClassDetailsPage from "./pages/ClassDetailsPage";
import TeacherProfilePage from "./pages/TeacherProfilePage";
import TeacherProfilesPage from "./pages/TeacherProfilesPage";
import Messaging from "./pages/Messaging";
import LearningGoals from "./pages/LearningGoals";
import GroupWork from "./pages/GroupWork";
import Challenges from "./pages/Challenges";
import Schedule from "./pages/Schedule";
import Achievements from "./pages/Achievements";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/for-teachers" element={<ForTeachers />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/for-students" element={<ForStudents />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/all-classes" element={<AllClasses />} />
              <Route path="/teachers" element={<TeacherProfilesPage />} />
              <Route path="/class/:id" element={<ClassDetailsPage />} />
              <Route path="/teacher/:teacherId" element={<TeacherProfilePage />} />
              
              {/* Protected Routes */}
              <Route path="/student-dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <Navigate to="/student-dashboard" replace />
              } />
              <Route path="/teacher-dashboard" element={
                <ProtectedRoute>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/learning-progress" element={
                <ProtectedRoute>
                  <LearningGoals />
                </ProtectedRoute>
              } />
              <Route path="/group-work" element={
                <ProtectedRoute>
                  <GroupWork />
                </ProtectedRoute>
              } />
              <Route path="/challenges" element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              } />
              <Route path="/achievements" element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              } />
              <Route path="/messaging" element={
                <ProtectedRoute>
                  <Messaging />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
