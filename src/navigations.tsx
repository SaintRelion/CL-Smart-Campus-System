import RootLayout from "./layout/RootLayout";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ClassManagementPage from "./pages/class-management/ClassManagementPage";
import LoginPage from "./pages/authentication/LoginPage";
import InstructorRegistrationPage from "./pages/instructor-registration/InstructorRegistrationPage";

import { ProtectedRoute } from "@saintrelion/auth-lib";
import { registerGroupAppRoutes, createAppRouter } from "@saintrelion/routers";
// ✅ Register protected routes (with layout)
registerGroupAppRoutes({
  layout: (
    <ProtectedRoute>
      <RootLayout />
    </ProtectedRoute>
  ),
  path: "/",
  errorElement: <NotFound />,
  children: [
    // PUBLIC
    { path: "/login", public: true, element: <LoginPage /> },
    // RESTRICTED
    {
      index: true,
      path: "/",
      element: <DashboardPage />,
      label: "Dashboard",
      allowedRoles: ["admin", "instructor", "parttime"],
    },
    {
      path: "/classmanagement",
      element: <ClassManagementPage />,
      label: "Class Management",
      allowedRoles: ["instructor", "parttime"],
    },
    {
      path: "/instructorregistration",
      element: <InstructorRegistrationPage />,
      label: "Instructor Registration",
      allowedRoles: ["admin"],
    },
  ],
});

// ✅ Create router
export const router = createAppRouter();
