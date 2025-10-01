import RootLayout from "./layout/RootLayout";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ClassManagementPage from "./pages/class-management/ClassManagementPage";
// import AttendanceRecordPage from "./pages/attendance-record/AttendanceRecordPage";
import ProfilePage from "./pages/profile/ProfilePage";
import LoginPage from "./pages/authentication/LoginPage";
import RegistrationPage from "./pages/authentication/RegistrationPage";

import { ProtectedRoute } from "@saintrelion/auth-lib";
import {
  registerGroupAppRoutes,
  registerAppRoute,
  createAppRouter,
} from "@saintrelion/routers";

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
    {
      index: true,
      path: "/",
      element: <DashboardPage />,
      label: "Dashboard",
      allowedRoles: ["departmentadmin", "instructor", "student"], // adjust roles as needed
      invalidRolesRedirectPath: "/login",
    },
    {
      path: "/classmanagement",
      element: <ClassManagementPage />,
      label: "Class Management",
      allowedRoles: ["instructor", "student"],
    },
    // {
    //   path: "/attendancerecord",
    //   element: <AttendanceRecordPage />,
    //   label: "Attendance Record",
    //   allowedRoles: ["instructor", "student"],
    // },
    { path: "profile", element: <ProfilePage /> },
    {
      path: "/settings",
      element: <SettingsPage />,
      label: "Settings",
      allowedRoles: ["departmentadmin"],
    },
  ],
});

// ✅ Public routes
registerAppRoute({ path: "/login", element: <LoginPage /> });
registerAppRoute({ path: "/register", element: <RegistrationPage /> });

// ✅ Create router
export const router = createAppRouter();
