import { cn } from "@/lib/utils";
import { type UserRole } from "@/models/userrole";
import { useAuth } from "@saintrelion/auth-lib";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";

const navItems: Record<UserRole, { label: string; path: string }[]> = {
  superadmin: [],
  departmentadmin: [],
  instructor: [
    { label: "Dashboard", path: "/" },
    { label: "Class Management", path: "/classmanagement" },
    { label: "Attendance Record", path: "/attendancerecord" },
  ],
  student: [
    { label: "Dashboard", path: "/" },
    { label: "Class Management", path: "/classmanagement" },
    { label: "Attendance Record", path: "/attendancerecord" },
  ],
};

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
      <Link to="/" className="text-primary text-xl font-semibold">
        ClassTrack
      </Link>
      <div className="flex items-center gap-4">
        {navItems[user.role as UserRole].map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "hover:text-primary text-sm font-medium transition-colors",
                isActive
                  ? "text-primary border-primary border-b-2 pb-1"
                  : "text-gray-600",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <UserMenu />
      </div>
    </nav>
  );
};
export default Navbar;
