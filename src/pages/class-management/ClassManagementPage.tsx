import type { JSX } from "react";
import InstructorClassManagement from "./instructor";
import { useAuth } from "@saintrelion/auth-lib";

const ClassManagementPage = () => {
  const { user } = useAuth();

  const classManagementPages: Record<string, JSX.Element> = {
    instructor: <InstructorClassManagement />,
  };

  return <div className="p-6">{classManagementPages[user.role ?? ""]}</div>;
};
export default ClassManagementPage;
