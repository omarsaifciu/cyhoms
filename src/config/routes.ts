// تكوين المسارات للتطبيق
import { lazy } from "react";

// Lazy loading للصفحات
const Index = lazy(() => import("@/pages/Index"));
const Favorites = lazy(() => import("@/pages/Favorites"));
const Profile = lazy(() => import("@/pages/Profile"));
const PropertyDetails = lazy(() => import("@/pages/PropertyDetails"));
const Terms = lazy(() => import("@/pages/Terms"));
const SellerDashboard = lazy(() => import("@/pages/SellerDashboard"));
const SupportDashboard = lazy(() => import("@/pages/SupportDashboard"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));
const UserActivity = lazy(() => import("@/pages/UserActivity"));
const StudentHousing = lazy(() => import("@/pages/StudentHousing"));

// تكوين المسارات
export const routeConfig = {
  // المسارات العامة (بدون حماية)
  public: [
    {
      path: "/",
      element: Index,
    },
    {
      path: "/property/:id",
      element: PropertyDetails,
    },
    {
      path: "/about",
      element: About,
    },
    {
      path: "/contact",
      element: Contact,
    },
    {
      path: "/student-housing",
      element: StudentHousing,
    },
    {
      path: "/user/:username",
      element: UserProfile,
    },
  ],
  
  // المسارات المحمية (تتطلب تسجيل دخول)
  protected: [
    {
      path: "/favorites",
      element: Favorites,
    },
    {
      path: "/profile",
      element: Profile,
    },
    {
      path: "/dashboard",
      element: SellerDashboard,
    },
    {
      path: "/support-dashboard",
      element: SupportDashboard,
    },
    {
      path: "/user-activity/:userId",
      element: UserActivity,
    },
  ],
  
  // مسار 404
  notFound: {
    path: "*",
    element: NotFound,
  }
};

export default routeConfig;
