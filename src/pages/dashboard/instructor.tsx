import { useAuth } from "@saintrelion/auth-lib";
import InstructorAttendance from "../../components/attendance/InstructorAttendance";

const InstructorDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between rounded-xl border border-b border-gray-100 bg-white p-6 pb-6 shadow-sm md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Welcome, {user.name || "Instructor"}!
          </h1>
          <p className="font-medium text-gray-500">
            Department:{" "}
            <span className="text-blue-600">
              {user.department || "General Education"}
            </span>
          </p>
        </div>
        <div className="mt-4 text-right md:mt-0">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            Employee ID
          </p>
          <p className="font-mono text-lg font-bold text-gray-700">
            {user.employeeId}
          </p>
        </div>
      </div>

      {/* FULL WIDTH ATTENDANCE SYSTEM */}
      <div className="w-full">
        <InstructorAttendance />
      </div>
    </div>
  );
};

export default InstructorDashboardPage;
