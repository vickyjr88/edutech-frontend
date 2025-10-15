import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import RecoveryPage from "../pages/auth/RecoveryPage";
import { VerificationPage } from "../pages/auth/VerificationPage";
import { OAuthCallbackPage } from "../pages/auth/OAuthCallbackPage";
import { RoleBasedDashboardRouter } from "./auth/RoleBasedDashboardRouter";
import Dashboard from "../pages/Dashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./auth/ProtectedRoute";
import TeacherRoute from "./auth/TeacherRoute";
import AuthCallback from "../pages/AuthCallback";
import ZoomAuthCallback from "../pages/ZoomAuthCallback";
import GoogleCalendarAuthCallback from "../pages/GoogleCalendarAuthCallback";
import ForTeachers from "../pages/ForTeachers";
import ForParents from "../pages/ForParents";
import ForStudents from "../pages/ForStudents";
import HowItWorks from "../pages/HowItWorks";
import AllClasses from "../pages/AllClasses";
import ClassDetailsPage from "../pages/ClassDetailsPage";
import TeacherProfilePage from "../pages/TeacherProfilePage";
import TeacherProfilesPage from "../pages/TeacherProfilesPage";
import Messaging from "../pages/Messaging";
import GroupWork from "../pages/GroupWork";
import Challenges from "../pages/Challenges";
import Schedule from "../pages/Schedule";
import Achievements from "../pages/Achievements";
import Courses from "../pages/Courses";
import CourseProgress from "../pages/CourseProgress";
import Profile from "../pages/Profile";
import ParentsDashboard from "../pages/ParentsDashboard";
import ParentsSchedule from "../pages/parents/ParentsSchedule";
import ParentsCourses from "../pages/parents/ParentsCourses";
import ParentsTeachers from "../pages/parents/ParentsTeachers";
import ParentsMessages from "../pages/parents/ParentsMessages";
import ParentsReports from "../pages/parents/ParentsReports";
import ParentsProgress from "../pages/parents/ParentsProgress";
import ParentsBilling from "../pages/parents/ParentsBilling";
import ChildDashboard from "../pages/parents/ChildDashboard";
import TeachersPricing from "../pages/TeachersPricing";
import TeacherZoomPage from "../pages/TeacherZoomPage";
import TeacherGoogleCalendarPage from "../pages/TeacherGoogleCalendarPage";
import TeacherProfileJourney from "../pages/TeacherProfileJourney";
import TeacherProfileResume from "../pages/TeacherProfileResume";
import TeacherClassSetupPage from "../pages/TeacherClassSetupPage";
import EnhancedAcademicClassSetup from "./teacher/class-setup/EnhancedAcademicClassSetup";
import TeacherClassViewPage from "../pages/TeacherClassViewPage";
import TeacherEarningsPage from "../pages/TeacherEarningsPage";
import DocumentViewer from "../pages/DocumentViewer";
import DocumentProxy from "../pages/DocumentProxy";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/recovery" element={<RecoveryPage />} />
      <Route path="/auth/verification" element={<VerificationPage />} />
      <Route path="/forgot-password" element={<RecoveryPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/oauth-callback" element={<OAuthCallbackPage />} />
      <Route path="/zoom/callback" element={<ZoomAuthCallback />} />
      <Route path="/google-calendar/callback" element={<GoogleCalendarAuthCallback />} />
      <Route path="/for-teachers" element={<ForTeachers />} />
      <Route path="/for-parents" element={<ForParents />} />
      <Route path="/for-students" element={<ForStudents />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/all-classes" element={<AllClasses />} />
      <Route path="/teachers" element={<TeacherProfilesPage />} />
      <Route path="/class/:id" element={<ClassDetailsPage />} />
      <Route path="/teacher/:teacherId" element={<TeacherProfilePage />} />
      <Route path="/teacher-pricing" element={<TeachersPricing />} />
      
      {/* Legal Pages */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      
      {/* Protected Routes */}
      <Route path="/student-dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <RoleBasedDashboardRouter />
        </ProtectedRoute>
      } />
      
      {/* Teacher Dashboard Routes */}
      <Route path="/teacher-dashboard" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherDashboard />
        </TeacherRoute>
      } />
      <Route path="/teacher-dashboard/classes" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherDashboard />
        </TeacherRoute>
      } />
      <Route path="/teacher-dashboard/students" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherDashboard />
        </TeacherRoute>
      } />
      <Route path="/teacher-dashboard/schedule" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherDashboard />
        </TeacherRoute>
      } />
      <Route path="/teacher-dashboard/settings" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherDashboard />
        </TeacherRoute>
      } />
      
      <Route path="/teacher-dashboard/zoom" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherZoomPage />
        </TeacherRoute>
      } />
      <Route path="/teacher-dashboard/calendar" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherDashboard />
        </TeacherRoute>
      } />
      <Route path="/teacher-profile-setup" element={
        <TeacherRoute requireProfileComplete={false}>
          <TeacherProfileJourney />
        </TeacherRoute>
      } />
      <Route path="/teacher-profile" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherProfileResume />
        </TeacherRoute>
      } />
      <Route path="/teacher-class-setup" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherClassSetupPage />
        </TeacherRoute>
      } />
      <Route path="/teacher-class-setup/academic" element={
        <TeacherRoute requireProfileComplete={true}>
          <EnhancedAcademicClassSetup />
        </TeacherRoute>
      } />
      <Route path="/teacher-class-setup/academic/:classId" element={
        <TeacherRoute requireProfileComplete={true}>
          <EnhancedAcademicClassSetup />
        </TeacherRoute>
      } />
      <Route path="/teacher-class-setup/:classId" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherClassSetupPage />
        </TeacherRoute>
      } />
      <Route path="/teacher-class/:classId" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherClassViewPage />
        </TeacherRoute>
      } />
      <Route path="/teacher-earnings" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherEarningsPage />
        </TeacherRoute>
      } />
      <Route path="/parents-dashboard" element={
        <ProtectedRoute>
          <ParentsDashboard />
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
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/messaging" element={
        <ProtectedRoute>
          <Messaging />
        </ProtectedRoute>
      } />
      <Route path="/courses" element={
        <ProtectedRoute>
          <Courses />
        </ProtectedRoute>
      } />
      <Route path="/course-progress/:courseId" element={
        <ProtectedRoute>
          <CourseProgress />
        </ProtectedRoute>
      } />
      
      {/* Parent Routes */}
      <Route path="/parents-schedule" element={
        <ProtectedRoute>
          <ParentsSchedule />
        </ProtectedRoute>
      } />
      <Route path="/parents-courses" element={
        <ProtectedRoute>
          <ParentsCourses />
        </ProtectedRoute>
      } />
      <Route path="/parents-teachers" element={
        <ProtectedRoute>
          <ParentsTeachers />
        </ProtectedRoute>
      } />
      <Route path="/parents-messages" element={
        <ProtectedRoute>
          <ParentsMessages />
        </ProtectedRoute>
      } />
      <Route path="/parents-reports" element={
        <ProtectedRoute>
          <ParentsReports />
        </ProtectedRoute>
      } />
      <Route path="/parents-progress" element={
        <ProtectedRoute>
          <ParentsProgress />
        </ProtectedRoute>
      } />
      <Route path="/parents-billing" element={
        <ProtectedRoute>
          <ParentsBilling />
        </ProtectedRoute>
      } />
      <Route path="/child-dashboard/:childId" element={
        <ProtectedRoute>
          <ChildDashboard />
        </ProtectedRoute>
      } />
      
      {/* Document Viewers - Public (uses signed URL for security) */}
      <Route path="/document-viewer" element={<DocumentViewer />} />
      <Route path="/document-proxy" element={<DocumentProxy />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;