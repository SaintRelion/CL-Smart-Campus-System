import type { JSX } from "react";
import StudentClassManagement from "./student";
import InstructorClassManagement from "./instructor";
import { useAuth } from "@saintrelion/auth-lib";
import type { UserRole } from "@/models/userrole";

const ClassManagementPage = () => {
  const { user } = useAuth();

  const classManagementPages: Record<string, JSX.Element> = {
    admin: <StudentClassManagement />,
    instructor: <InstructorClassManagement />,
    student: <StudentClassManagement />,
  };

  return (
    <div className="p-6">{classManagementPages[user.role as UserRole]}</div>
  );
};
export default ClassManagementPage;
