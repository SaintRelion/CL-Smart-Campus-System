import type { JSX } from "react";
import InstructorDashboardPage from "./instructor";
import { useAuth } from "@saintrelion/auth-lib";
import AdminDashboardPage from "./admin";

const DashboardPage = () => {
  const { user } = useAuth();

  const dashboardPages: Record<string, JSX.Element> = {
    admin: <AdminDashboardPage />,
    instructor: <InstructorDashboardPage />,
  };

  return <div className="p-6">{dashboardPages[user.role ?? ""]}</div>;
};
export default DashboardPage;
