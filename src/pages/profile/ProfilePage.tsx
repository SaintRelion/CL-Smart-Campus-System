import type { JSX } from "react";
import StudentProfilePage from "./student";
import InstructorProfilePage from "./instructor";
import { useAuth } from "@saintrelion/auth-lib";
import type { UserRole } from "@/models/userrole";

const ProfilePage = () => {
  const { user } = useAuth();
  const profilePages: Record<string, JSX.Element> = {
    admin: <StudentProfilePage />,
    instructor: <InstructorProfilePage />,
    student: <StudentProfilePage />,
  };

  return <div className="p-6">{profilePages[user.role as UserRole]}</div>;
};
export default ProfilePage;
