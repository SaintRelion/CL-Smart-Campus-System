import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime24To12, formatYYYYMMDDTime } from "@/lib/mydate";
import type { AttendanceLogs } from "@/models/attendance";
import type { Classes } from "@/models/classes";
import type { ClassesNotifications } from "@/models/classes-notifications";
import type { EnrolledClasses } from "@/models/enrolled-classes";
import { useAuth } from "@saintrelion/auth-lib";
import { useDBOperations } from "@saintrelion/data-access-layer";
import { BanIcon, CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();

  // hook up repos
  const { useSelect: classesSelect } = useDBOperations<Classes>("Classes");
  const { useSelect: enrolledSelect } =
    useDBOperations<EnrolledClasses>("EnrolledClasses");
  const { useSelect: attendanceSelect } =
    useDBOperations<AttendanceLogs>("AttendanceLogs");
  const { useSelect: notificationSelect } =
    useDBOperations<ClassesNotifications>("ClassesNotifications");

  // get data
  const { data: allClasses = [] } = classesSelect();
  const { data: enrolledClasses = [] } = enrolledSelect({
    firebaseOptions: { filterField: "userID", value: user.id },
  });
  const { data: attendanceLogs = [] } = attendanceSelect({
    firebaseOptions: { filterField: "userID", value: user.id },
  });

  const todayAsString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
  const todayISODate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data: notifications = [] } = notificationSelect();

  // map enrolled classes -> full details
  const myClasses = enrolledClasses
    .map((e) => allClasses.find((c) => c.id === e.classID))
    .filter(
      (c): c is Classes => c != undefined && c.days.includes(todayAsString),
    ) as Classes[];

  // filter missed logs
  const missedLogs = attendanceLogs.filter((a) => a.status === "missed");

  return (
    <div className="space-y-6">
      {/* Top Grid: Next + Missed */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Next Class */}
        <Card className="rounded-2xl border-2 border-black/20 transition-all hover:border-black/40">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <CalendarIcon className="text-primary h-5 w-5" />
            <CardTitle className="text-lg">Next Class</CardTitle>
          </CardHeader>
          <CardContent>
            {myClasses && myClasses.length > 0 ? (
              [...myClasses]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((c, idx) => {
                  const sortedNotifications = notifications
                    ?.filter((n) => n.classID === c.id)
                    .sort(
                      (a, b) =>
                        new Date(b.date + "T" + b.time).getTime() -
                        new Date(a.date + "T" + a.time).getTime(),
                    );

                  const latestCancellation = sortedNotifications.filter(
                    (n) => n.type === "cancellation" && n.date === todayISODate,
                  )[0];

                  const otherNotifications = sortedNotifications.filter(
                    (n) => n.type !== "cancellation",
                  );

                  return (
                    <div key={c.id} className="mb-3">
                      <p
                        className={`leading-relaxed ${
                          idx === 0
                            ? "p-1 text-xl font-semibold"
                            : "text-sm opacity-50"
                        }`}
                      >
                        <span className="text-primary font-medium">
                          {c.title}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {formatTime24To12(c.time)}
                        </span>
                      </p>
                      <ul className="ml-4 space-y-1">
                        {latestCancellation ? (
                          <li
                            key={latestCancellation.id}
                            className={`font-semibold text-red-600/60 italic ${
                              idx === 0 ? "text-lg" : "text-sm"
                            }`}
                          >
                            • {latestCancellation.message}
                          </li>
                        ) : null}

                        {otherNotifications.length > 0 ? (
                          otherNotifications.map((note) => (
                            <li
                              key={note.id}
                              className={`italic ${
                                idx === 0
                                  ? "text-lg text-black/60"
                                  : "text-muted-foreground text-sm"
                              }`}
                            >
                              • {note.message}
                            </li>
                          ))
                        ) : latestCancellation ? (
                          <li
                            className={`italic ${
                              idx === 0
                                ? "text-lg text-black/80"
                                : "text-muted-foreground text-sm"
                            }`}
                          >
                            • No changes
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  );
                })
            ) : (
              <p className="text-muted-foreground text-sm">
                No classes found for this day.{" "}
                <Link to="/classmanagement" className="text-primary underline">
                  Enroll now →
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Missed Classes */}
        <Card className="rounded-2xl border-2 border-black/20 transition-all hover:border-black/40">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BanIcon className="text-destructive h-5 w-5" />
            <CardTitle className="text-lg">Missed Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {missedLogs.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {missedLogs
                  .sort(
                    (a, b) =>
                      new Date(b.time).getTime() - new Date(a.time).getTime(),
                  )
                  .map((attendance, idx) => {
                    const classInfo = allClasses.find(
                      (c) => c.id === attendance.classID,
                    );
                    return (
                      <li
                        key={idx}
                        className="flex items-center justify-between rounded-md bg-red-400/40 px-2 py-1 transition hover:bg-red-100"
                      >
                        <span>
                          {classInfo ? classInfo.title : "Unknown Class"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatYYYYMMDDTime(attendance.time)}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No missed classes 🎉
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
