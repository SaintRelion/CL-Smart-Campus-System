import { allInstructorClasses } from "@/data/mock-classes-instructor";
import { formatTime } from "@/lib/mydate";
import type { ClassesProps } from "@/models/classes-instructor";
import { useAuth } from "@saintrelion/auth-lib";
import { useEffect, useState } from "react";

const InstructorDashboardPage = () => {
  const { user } = useAuth();

  const [todayClasses, setTodayClasses] = useState<ClassesProps[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const today = now.toLocaleDateString("en-US", { weekday: "long" }); // e.g. "Monday"

    // Filter classes by instructor and today's day
    const todays = allInstructorClasses
      .filter((cls) => cls.userId === user.id && cls.days.includes(today))
      .sort((a, b) => (a.time > b.time ? 1 : -1)); // sort by start time

    setTodayClasses(todays);

    // Check for alerts
    todays.forEach((cls) => {
      const [hour, minute] = cls.time.split(":").map(Number);
      const classTime = new Date();
      classTime.setHours(hour, minute, 0, 0);

      const diffMinutes = (classTime.getTime() - now.getTime()) / (1000 * 60);

      if (diffMinutes > 0 && diffMinutes <= 15) {
        setAlert(
          `Your ${formatTime(cls.time)} class "${cls.title}" starts in ${Math.round(diffMinutes)} minutes`,
        );
      }
    });
  }, [user.id]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>

      {/* Alerts */}
      {alert && (
        <div className="rounded-md border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700 shadow">
          <p>{alert}</p>
        </div>
      )}

      {/* My Classes Today */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">My Classes Today</h2>
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
                  <span className="text-gray-600">{formatTime(cls.time)}</span>
                </div>
                <p className="text-sm text-gray-500">{cls.code}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default InstructorDashboardPage;
