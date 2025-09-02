import type { JSX } from "react";
import StudentDashboard from "./student";
import InstructorDashboardPage from "./instructor";
import { useAuth } from "@saintrelion/auth-lib";
import type { UserRole } from "@/models/userrole";

const DashboardPage = () => {
  const { user } = useAuth();

  const dashboardPages: Record<string, JSX.Element> = {
    admin: <StudentDashboard />,
    instructor: <InstructorDashboardPage />,
    student: <StudentDashboard />,
  };

  return <div className="p-6">{dashboardPages[user.role as UserRole]}</div>;
};
export default DashboardPage;
