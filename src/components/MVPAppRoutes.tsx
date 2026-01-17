/**
 * MVP App Routes
 *
 * This component wraps the original AppRoutes and filters out non-MVP routes
 * based on feature flags. This allows us to keep all code intact while hiding
 * features from the UI.
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { features } from "@/config/features";

// Core Pages
import Index from "../pages/Index";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import RecoveryPage from "../pages/auth/RecoveryPage";
import { VerificationPage } from "../pages/auth/VerificationPage";
import { OAuthCallbackPage } from "../pages/auth/OAuthCallbackPage";
import AuthCallback from "../pages/AuthCallback";
import NotFound from "../pages/NotFound";
import CompleteProfile from "../pages/CompleteProfile";

// Marketing Pages
import ForTeachers from "../pages/ForTeachers";
import ForParents from "../pages/ForParents";
import ForStudents from "../pages/ForStudents";
import HowItWorks from "../pages/HowItWorks";
import AboutUs from "../pages/AboutUs";
import Careers from "../pages/Careers";
import ContactUs from "../pages/ContactUs";

// Legal Pages
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";

// Blog & CMS (Kept for marketing)
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import { DynamicPage } from "../components/cms";
import UnsubscribePage from "../pages/Unsubscribe";

// Teacher Pages
import TeacherDashboard from "../pages/TeacherDashboard";
import SimplifiedTeacherDashboardPage from "../pages/SimplifiedTeacherDashboard"; // MVP: Simplified dashboard
import TeacherProfilesPage from "../pages/TeacherProfilesPage";
import TeacherProfilePage from "../pages/TeacherProfilePage";
import TeachersPricing from "../pages/TeachersPricing";
import TeacherProfileJourney from "../pages/TeacherProfileJourney";
import SimplifiedTeacherProfile from "../pages/SimplifiedTeacherProfile"; // MVP: Simplified profile form
import TeacherProfileResume from "../pages/TeacherProfileResume";
import TeacherClassSetupPage from "../pages/TeacherClassSetupPage";
import TeacherClassViewPage from "../pages/TeacherClassViewPage";
import TeacherEarningsPage from "../pages/TeacherEarningsPage";
import TeacherOfferingsPage from "../pages/TeacherOfferingsPage"; // MVP: Offerings management
import TeacherAvailabilityPage from "../pages/TeacherAvailabilityPage"; // MVP: Availability calendar
import TeacherResourcesPage from "../pages/TeacherResourcesPage"; // MVP: Resources
import TeacherStudentsPage from "../pages/TeacherStudentsPage"; // MVP: Students

// Parent Pages
import ParentsDashboard from "../pages/ParentsDashboard";
import SimplifiedParentsDashboardPage from "../pages/SimplifiedParentsDashboard"; // MVP: Simplified parent dashboard
import ParentsBilling from "../pages/parents/ParentsBilling";
import ParentsCourses from "../pages/parents/ParentsCourses";
import ChildDashboard from "../pages/parents/ChildDashboard";
import ParentProfile from "../pages/parents/ParentProfile"; // MVP: Parent profile
import ParentsChildren from "../pages/parents/ParentsChildren"; // MVP: My children page
import ParentsSchedule from "../pages/parents/ParentsSchedule"; // MVP: Schedule page

// Class/Offering Pages
import AllClasses from "../pages/AllClasses";
import ClassDetailsPage from "../pages/ClassDetailsPage";
import BookingPage from "../pages/BookingPage";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import TeachersManagement from "../pages/admin/TeachersManagement";
import TeacherApprovalPage from "../pages/admin/TeacherApprovalPage"; // MVP: Teacher approval
import ParentsManagement from "../pages/admin/ParentsManagement";
import StudentsManagement from "../pages/admin/StudentsManagement";
import ClassesManagement from "../pages/admin/ClassesManagement";
import UsersManagement from "../pages/admin/UsersManagement";
import BookingsManagement from "../pages/admin/BookingsManagement";
import TicketsManagement from "../pages/admin/TicketsManagement";
import AdminMessaging from "../pages/admin/AdminMessaging";

// Admin CMS & Content (Kept for marketing)
import PagesList from "../pages/admin/PagesList";
import PageEditor from "../pages/admin/PageEditor";
import VersionHistory from "../pages/admin/VersionHistory";
import MenusList from "../pages/admin/MenusList";
import MenuEditor from "../pages/admin/MenuEditor";
import SocialLinksManager from "../pages/admin/SocialLinksManager";
import BlogPostsList from "../pages/admin/BlogPostsList";
import BlogPostEditor from "../pages/admin/BlogPostEditor";
import BlogCategoriesList from "../pages/admin/BlogCategoriesList";
import BlogTagsList from "../pages/admin/BlogTagsList";
import InquiriesPage from "../pages/admin/InquiriesPage";
import NewsletterSubscribersPage from "../pages/admin/NewsletterSubscribersPage";
import BloggersList from "../pages/admin/BloggersList";
import TeachingConfigManagement from "../pages/admin/TeachingConfigManagement";

// Auth Guards
import ProtectedRoute from "./auth/ProtectedRoute";
import TeacherRoute from "./auth/TeacherRoute";
import AdminRoute from "./auth/AdminRoute";
import { RoleBasedDashboardRouter } from "./auth/RoleBasedDashboardRouter";

// Settings
import Settings from "../pages/Settings";
import OrySettingsPage from "../pages/OrySettingsPage";

// Payment Pages
import PaymentPage from "../pages/PaymentPage";
import PaymentCallbackPage from "../pages/PaymentCallbackPage";

const MVPAppRoutes = () => {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      {/* Auth Routes */}
      <Route path="/auth/recovery" element={<RecoveryPage />} />
      <Route path="/auth/verification" element={<VerificationPage />} />
      <Route path="/forgot-password" element={<RecoveryPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/oauth-callback" element={<OAuthCallbackPage />} />

      {/* Marketing Pages */}
      <Route path="/for-teachers" element={<ForTeachers />} />
      <Route path="/for-parents" element={<ForParents />} />
      <Route path="/for-students" element={<ForStudents />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/teacher-pricing" element={<TeachersPricing />} />

      {/* Company Pages */}
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact-us" element={<ContactUs />} />

      {/* Blog & Newsletter (KEPT for marketing) */}
      {features.marketing.blog && (
        <>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </>
      )}
      {features.marketing.newsletter && (
        <Route path="/unsubscribe/:token" element={<UnsubscribePage />} />
      )}

      {/* Legal Pages */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      {/* Browse Teachers & Classes (PUBLIC) */}
      <Route path="/teachers" element={<TeacherProfilesPage />} />
      <Route path="/teacher/:teacherId" element={<TeacherProfilePage />} />
      <Route path="/book/:teacherId" element={<BookingPage />} />
      <Route path="/all-classes" element={<AllClasses />} />
      <Route path="/class/:id" element={<ClassDetailsPage />} />

      {/* ===== PROTECTED ROUTES ===== */}

      {/* Dashboard Router (role-based redirect) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedDashboardRouter />
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/ory"
        element={
          <ProtectedRoute>
            <OrySettingsPage />
          </ProtectedRoute>
        }
      />

      {/* ===== TEACHER ROUTES ===== */}

      {/* Teacher Profile Setup (for new teachers) */}
      <Route
        path="/teacher-profile-setup"
        element={
          <TeacherRoute requireProfileComplete={false}>
            <SimplifiedTeacherProfile />
          </TeacherRoute>
        }
      />
      {/* Legacy profile journey (kept for reference) */}
      <Route
        path="/teacher-profile-setup/legacy"
        element={
          <TeacherRoute requireProfileComplete={false}>
            <TeacherProfileJourney />
          </TeacherRoute>
        }
      />

      {/* Teacher Dashboard & Main Pages - MVP uses simplified version */}
      <Route
        path="/teacher-dashboard"
        element={
          <TeacherRoute requireProfileComplete={true}>
            <SimplifiedTeacherDashboardPage />
          </TeacherRoute>
        }
      />

      {/* Teacher Profile & Resume */}
      <Route
        path="/teacher-profile"
        element={
          <TeacherRoute requireProfileComplete={true}>
            <TeacherProfileResume />
          </TeacherRoute>
        }
      />

      {/* Class Setup (Simplified for MVP) */}
      <Route
        path="/teacher-class-setup"
        element={
          <TeacherRoute requireProfileComplete={true}>
            <TeacherClassSetupPage />
          </TeacherRoute>
        }
      />
      <Route
        path="/teacher-class-setup/:classId"
        element={
          <TeacherRoute requireProfileComplete={true}>
            <TeacherClassSetupPage />
          </TeacherRoute>
        }
      />
      <Route
        path="/teacher-class/:classId"
        element={
          <TeacherRoute requireProfileComplete={true}>
            <TeacherClassViewPage />
          </TeacherRoute>
        }
      />

      {/* Teacher Earnings */}
      <Route
        path="/teacher-earnings"
        element={
          <TeacherRoute requireProfileComplete={true}>
            <TeacherEarningsPage />
          </TeacherRoute>
        }
      />

      {/* Teacher Offerings (MVP) */}
      <Route
        path="/teacher-offerings"
        element={
          <TeacherRoute requireProfileComplete={true}>
            <TeacherOfferingsPage />
          </TeacherRoute>
        }
      />

      {/* Teacher Availability (MVP) */}
      <Route
        path="/teacher-availability"
        element={
          <TeacherRoute requireProfileComplete={true}>
            <TeacherAvailabilityPage />
          </TeacherRoute>
        }
      />

      {/* Teacher Students (MVP) */}
      <Route
        path="/teacher-students"
        element={
          <TeacherRoute requireProfileComplete={true}>
            <TeacherStudentsPage />
          </TeacherRoute>
        }
      />

      {/* Teacher Resources (MVP) */}
      <Route
        path="/teacher-resources"
        element={
          <TeacherRoute requireProfileComplete={true}>
            <TeacherResourcesPage />
          </TeacherRoute>
        }
      />

      {/* ===== PARENT ROUTES - MVP uses simplified version ===== */}

      <Route
        path="/parents-dashboard"
        element={
          <ProtectedRoute>
            <SimplifiedParentsDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parents-dashboard/courses"
        element={
          <ProtectedRoute>
            <ParentsCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parents-dashboard/billing"
        element={
          <ProtectedRoute>
            <ParentsBilling />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parents-dashboard/child/:childId"
        element={
          <ProtectedRoute>
            <ChildDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parents-dashboard/children"
        element={
          <ProtectedRoute>
            <ParentsChildren />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parents-dashboard/schedule"
        element={
          <ProtectedRoute>
            <ParentsSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parents-dashboard/profile"
        element={
          <ProtectedRoute>
            <ParentProfile />
          </ProtectedRoute>
        }
      />

      {/* ===== PAYMENT ROUTES (MVP) ===== */}

      <Route
        path="/payment/:bookingId"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route path="/payment/callback" element={<PaymentCallbackPage />} />

      {/* ===== ADMIN ROUTES ===== */}

      {features.admin.enabled && (
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          {/* Dashboard - Index Route */}
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />

          {/* User Management */}
          <Route path="users" element={<UsersManagement />} />
          <Route path="teachers" element={<TeachersManagement />} />
          <Route path="teacher-approvals" element={<TeacherApprovalPage />} />
          <Route path="parents" element={<ParentsManagement />} />
          <Route path="students" element={<StudentsManagement />} />

          {/* Class/Booking Management */}
          <Route path="classes" element={<ClassesManagement />} />
          <Route path="bookings" element={<BookingsManagement />} />
          <Route path="tickets" element={<TicketsManagement />} />
          <Route path="messaging" element={<AdminMessaging />} />

          {/* CMS & Content (KEPT for marketing) */}
          {features.marketing.cms && (
            <>
              <Route path="pages" element={<PagesList />} />
              <Route path="pages/new" element={<PageEditor />} />
              <Route path="pages/:slug/edit" element={<PageEditor />} />
              <Route path="pages/:id/versions" element={<VersionHistory />} />
              <Route path="menus" element={<MenusList />} />
              <Route path="menus/new" element={<MenuEditor />} />
              <Route path="menus/:id/edit" element={<MenuEditor />} />
              <Route path="social-links" element={<SocialLinksManager />} />
            </>
          )}

          {/* Blog Management (KEPT for marketing) */}
          {features.marketing.blog && (
            <>
              <Route path="blog/posts" element={<BlogPostsList />} />
              <Route path="blog/posts/new" element={<BlogPostEditor />} />
              <Route path="blog/posts/:id/edit" element={<BlogPostEditor />} />
              <Route path="blog/categories" element={<BlogCategoriesList />} />
              <Route path="blog/tags" element={<BlogTagsList />} />
              <Route path="blog/authors" element={<BloggersList />} />
            </>
          )}

          {/* Newsletter (KEPT for marketing) */}
          {features.marketing.newsletter && (
            <Route path="newsletter-subscribers" element={<NewsletterSubscribersPage />} />
          )}

          {/* Inquiries */}
          <Route path="inquiries" element={<InquiriesPage />} />

          {/* Teaching Config */}
          <Route path="teaching-config" element={<TeachingConfigManagement />} />
        </Route>
      )}

      {/* ===== DYNAMIC CMS PAGES ===== */}
      {features.marketing.cms && (
        <Route path="/page/:slug" element={<DynamicPage />} />
      )}

      {/* ===== 404 NOT FOUND ===== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MVPAppRoutes;
