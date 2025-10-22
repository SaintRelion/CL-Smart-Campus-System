import type { ClassSubject } from "@/models/class-subject";
import { useAuth } from "@saintrelion/auth-lib";
import { useDBOperations } from "@saintrelion/data-access-layer";
import { useEffect, useState } from "react";
import InstructorAttendance from "../attendance/InstructorAttendance";
import { formatReadableTime } from "@saintrelion/time-functions";

import { RenderCard } from "@saintrelion/ui";

const InstructorDashboardPage = () => {
  const { user } = useAuth();
  const { useSelect: classesSelect } =
    useDBOperations<ClassSubject>("ClassSubject");

  const { data: instructorClasses = [] } = classesSelect({
    firebaseOptions: { filterField: "employeeID", value: user.employeeID },
    mockOptions: { filterFn: (cls) => cls.employeeID === user.employeeID },
  });

  const [todayClasses, setTodayClasses] = useState<ClassSubject[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  // filter today's classes
  useEffect(() => {
    if (!instructorClasses.length) return;

    const now = new Date();
    const today = now.toLocaleDateString("en-US", { weekday: "long" });

    const todays = instructorClasses
      .filter((cls) => cls.days.includes(today))
      .sort((a, b) => (a.time > b.time ? 1 : -1));

    setTodayClasses(todays);

    // check for soon classes
    todays.forEach((cls) => {
      const [hour, minute] = cls.time.split(":").map(Number);
      const classTime = new Date();
      classTime.setHours(hour, minute, 0, 0);

      const diffMinutes = (classTime.getTime() - now.getTime()) / (1000 * 60);
      if (diffMinutes > 0 && diffMinutes <= 15) {
        setAlert(
          `Your ${formatReadableTime(cls.time)} class "${cls.title}" starts in ${Math.round(diffMinutes)} minutes`,
        );
      }
    });
  }, [instructorClasses]);

  return (
    <div className="flex flex-col gap-6 p-6 md:flex-row">
      {/* LEFT COLUMN – Map + Attendance */}
      <div className="space-y-4 md:w-1/2">
        <RenderCard headerTitle="Attendance Tracker">
          <InstructorAttendance />
        </RenderCard>
      </div>

      {/* RIGHT: Classes and Alerts */}
      <div className="space-y-6 md:w-1/2">
        <RenderCard headerTitle="Instructor Dashboard">
          {alert && (
            <div className="mb-4 rounded-md border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700 shadow">
              <p>{alert}</p>
            </div>
          )}

          <h2 className="mb-4 text-lg font-semibold">My Classes Today</h2>

          {todayClasses.length === 0 ? (
            <p className="text-gray-500">No classes scheduled today.</p>
          ) : (
            <ul className="space-y-3">
              {todayClasses.map((cls) => (
                <li
                  key={cls.id}
                  className="rounded-lg border p-4 shadow-sm transition hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cls.title}</span>
                    <span className="text-gray-600">
                      {formatReadableTime(cls.time)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </RenderCard>
      </div>
    </div>
  );
};
export default InstructorDashboardPage;
