import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./main.css";
import RootLayout from "./layout/RootLayout";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ClassManagementPage from "./pages/class-management/ClassManagementPage";
import AttendanceRecordPage from "./pages/attendance-record/AttendanceRecordPage";
import ProfilePage from "./pages/profile/ProfilePage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, ProtectedRoute } from "@saintrelion/auth-lib";
import LoginPage from "./pages/authentication/LoginPage";
import RegistrationPage from "./pages/authentication/RegistrationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "classmanagement",
        element: <ClassManagementPage />,
      },
      {
        path: "attendancerecord",
        element: <AttendanceRecordPage />,
      },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegistrationPage /> },
]);

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <AuthProvider
    initialUser={{
      id: 4,
      email: "fake",
      role: "instructor",
      department: "IT",
    }}
  >
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </AuthProvider>,
);
