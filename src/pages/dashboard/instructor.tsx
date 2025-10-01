import { formatTime24To12 } from "@/lib/mydate";
import type { Classes } from "@/models/classes";
import { useAuth } from "@saintrelion/auth-lib";
import { useDBOperations } from "@saintrelion/data-access-layer";
import { useEffect, useState } from "react";

const InstructorDashboardPage = () => {
  const { user } = useAuth();

  // hook from repository
  const { useSelect: classesSelect } = useDBOperations<Classes>("Classes");

  // fetch all classes for this instructor
  const { data: instructorClasses = [] } = classesSelect({
    firebaseOptions: { filterField: "userID", value: user.id },
    mockOptions: { filterFn: (cls) => cls.userID === user.id },
    apiOptions: { params: { userId: user.id } },
  });

  const [todayClasses, setTodayClasses] = useState<Classes[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    if (!instructorClasses.length) return;

    const now = new Date();
    const today = now.toLocaleDateString("en-US", { weekday: "long" }); // e.g. "Monday"

    // Filter classes by instructor and today's day
    const todays = instructorClasses
      .filter((cls) => cls.days.includes(today))
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
          `Your ${formatTime24To12(cls.time)} class "${cls.title}" starts in ${Math.round(diffMinutes)} minutes`,
        );
      }
    });
  }, [instructorClasses]);

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
                  <span className="text-gray-600">
                    {formatTime24To12(cls.time)}
                  </span>
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
