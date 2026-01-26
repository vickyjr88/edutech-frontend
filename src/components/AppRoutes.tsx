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
import AdminRoute from "./auth/AdminRoute";
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
import Settings from "../pages/Settings";
import NotificationSettings from "../pages/NotificationSettings";
import ParentsDashboard from "../pages/ParentsDashboard";
import ParentsSchedule from "../pages/parents/ParentsSchedule";
import ParentsCourses from "../pages/parents/ParentsCourses";
import ParentsTeachers from "../pages/parents/ParentsTeachers";
import ParentsMessages from "../pages/parents/ParentsMessages";
import ParentsMessagingPage from "../pages/parents/ParentsMessagingPage";
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
import OrySettingsPage from "../pages/OrySettingsPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PagesList from "../pages/admin/PagesList";
import PageEditor from "../pages/admin/PageEditor";
import VersionHistory from "../pages/admin/VersionHistory";
import MenusList from "../pages/admin/MenusList";
import MenuEditor from "../pages/admin/MenuEditor";
import SocialLinksManager from "../pages/admin/SocialLinksManager";
import AboutUs from "../pages/AboutUs";
import Careers from "../pages/Careers";
import ContactUs from "../pages/ContactUs";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import { DynamicPage } from "../components/cms";
import BlogPostsList from "../pages/admin/BlogPostsList";
import BlogPostEditor from "../pages/admin/BlogPostEditor";
import BlogCategoriesList from "../pages/admin/BlogCategoriesList";
import BlogTagsList from "../pages/admin/BlogTagsList";
import InquiriesPage from "../pages/admin/InquiriesPage";
import NewsletterSubscribersPage from "../pages/admin/NewsletterSubscribersPage";
import UnsubscribePage from "../pages/Unsubscribe";
import BloggersList from "../pages/admin/BloggersList";
import TeachersManagement from "../pages/admin/TeachersManagement";
import StudentsManagement from "../pages/admin/StudentsManagement";
import ParentsManagement from "../pages/admin/ParentsManagement";
import TicketsManagement from "../pages/admin/TicketsManagement";
import TeachingConfigManagement from "../pages/admin/TeachingConfigManagement";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import ClassesManagement from "../pages/admin/ClassesManagement";
import AdminMessaging from "../pages/admin/AdminMessaging";
import UsersManagement from "../pages/admin/UsersManagement";
import UserDetailsPage from "../pages/admin/UserDetailsPage";
import AdminParentStudentAssociations from "../pages/admin/AdminParentStudentAssociations";
import RatingsManagement from "../pages/admin/RatingsManagement";
import TeacherRatingsPage from "../pages/teacher/TeacherRatingsPage";
import CompleteProfile from "../pages/CompleteProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
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
      <Route path="/unsubscribe/:token" element={<UnsubscribePage />} />

      {/* Company Pages */}
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

      {/* Legal Pages */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

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
      <Route path="/settings/ory" element={
        <ProtectedRoute>
          <OrySettingsPage />
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
      <Route path="/teacher-dashboard/messaging" element={
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
      <Route path="/teacher-dashboard/content" element={
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
      <Route path="/teacher-ratings" element={
        <TeacherRoute requireProfileComplete={true}>
          <TeacherRatingsPage />
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
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <NotificationSettings />
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
      <Route path="/parents-messaging" element={
        <ProtectedRoute>
          <ParentsMessagingPage />
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

      {/* Admin CMS Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="pages" element={<PagesList />} />
        <Route path="pages/new" element={<PageEditor />} />
        <Route path="pages/:slug/edit" element={<PageEditor />} />
        <Route path="pages/:slug/versions" element={<VersionHistory />} />
        <Route path="menus" element={<MenusList />} />
        <Route path="menus/new" element={<MenuEditor />} />
        <Route path="menus/:identifier/edit" element={<MenuEditor />} />
        <Route path="social-links" element={<SocialLinksManager />} />
        <Route path="blog/posts" element={<BlogPostsList />} />
        <Route path="blog/posts/new" element={<BlogPostEditor />} />
        <Route path="blog/posts/:postId/edit" element={<BlogPostEditor />} />
        <Route path="blog/categories" element={<BlogCategoriesList />} />
        <Route path="blog/tags" element={<BlogTagsList />} />
        <Route path="blog/authors" element={<BloggersList />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="newsletter-subscribers" element={<NewsletterSubscribersPage />} />
        <Route path="teachers" element={<TeachersManagement />} />
        <Route path="classes" element={<ClassesManagement />} />
        <Route path="students" element={<StudentsManagement />} />
        <Route path="parents" element={<ParentsManagement />} />
        <Route path="tickets" element={<TicketsManagement />} />
        <Route path="messaging" element={<AdminMessaging />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="users/:userId" element={<UserDetailsPage />} />
        <Route path="teaching-config" element={<TeachingConfigManagement />} />
        <Route path="associations" element={<AdminParentStudentAssociations />} />
        <Route path="ratings" element={<RatingsManagement />} />
      </Route>

      {/* Document Viewers - Public (uses signed URL for security) */}
      <Route path="/document-viewer" element={<DocumentViewer />} />
      <Route path="/document-proxy" element={<DocumentProxy />} />

      {/* Dynamic CMS Pages - Catch-all for any page created in CMS */}
      <Route path="/page/:slug" element={<DynamicPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;