import { useState, useRef } from "react";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import type { AttendanceLog } from "@/models/attendance";
import { useAuth } from "@saintrelion/auth-lib";

import {
  formatReadableDate,
  formatReadableDateTime,
  getCurrentDateTimeString,
  isSameDay,
} from "@saintrelion/time-functions";

import { appendPath, encodePath } from "../to-be-library/geo/lib/parser";
import { GeoViewer } from "../to-be-library/geo/geo-viewer";
import type { Coords } from "../to-be-library/geo/models/use-geo-model";

export default function InstructorAttendance() {
  const { user } = useAuth();

  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const [currentCoords, setCurrentCoords] = useState<Coords>();
  const [pathMovement, setPathMovement] = useState<Coords[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Attendance Select, Update, Insert
  const {
    useSelect: attendanceSelect,
    useInsert: attendanceInsert,
    useUpdate: attendanceUpdate,
  } = useDBOperationsLocked<AttendanceLog>("AttendanceLog");
  const { data: attendanceLogs = [] } = attendanceSelect({
    firebaseOptions: {
      filterField: "employeeID",
      value: user.employeeID,
    },
    mockOptions: {
      filterFn: (a) => a.employeeId === user.employeeId,
    },
  });

  const todayAttendance = attendanceLogs.find((log) => {
    const today = getCurrentDateTimeString();
    console.log("TODAY--");
    console.log(formatReadableDate(today));
    console.log(formatReadableDate(log.createdAt));

    if (isSameDay(formatReadableDate(log.createdAt), formatReadableDate(today)))
      return log;
  });

  // useEffect(() => {
  //   if (todayAttendance?.timeIn && !todayAttendance?.timeOut) {
  //     console.log("Tracking Position");
  //     setIsCheckedIn(true);

  //     // clear any previous interval before setting a new one
  //     if (intervalRef.current) clearInterval(intervalRef.current);

  //     intervalRef.current = setInterval(
  //       () => {
  //         setPathMovement((prevPath) => {
  //           if (path.length === 0) return prevPath;

  //           const last = path[path.length - 1];
  //           const newPath = [...prevPath, [last.lat, last.lng]];

  //           attendanceUpdate.mutate({
  //             field: "id",
  //             value: todayAttendance?.id,
  //             updates: {
  //               pathMovement: appendPath(todayAttendance?.pathMovement, last),
  //             },
  //           });

  //           return newPath;
  //         });
  //       },
  //       5 * 60 * 1000,
  //     ); // every 5 minutes

  //     // Cleanup on unmount or when attendance changes
  //     return () => {
  //       if (intervalRef.current) clearInterval(intervalRef.current);
  //     };
  //   } else {
  //     // not checked in, ensure no interval is running
  //     if (intervalRef.current) clearInterval(intervalRef.current);
  //   }
  //   if (intervalRef.current) clearInterval(intervalRef.current);
  // }, [
  //   todayAttendance?.id,
  //   todayAttendance?.timeIn,
  //   todayAttendance?.timeOut,
  //   attendanceUpdate,
  //   todayAttendance?.pathMovement,
  //   path,
  // ]);

  // 🟢 Toggle Attendance
  const handleAttendanceToggle = () => {
    const logId = todayAttendance?.id;
    console.log(isCheckedIn);
    if (!isCheckedIn) {
      // ---- CHECK IN ----
      const now = getCurrentDateTimeString();
      setIsCheckedIn(true);

      // if no record for today, create one
      if (!logId) {
        attendanceInsert.run({
          employeeId: user.employeeId,
          timeIn: now,
          pathMovement: encodePath(pathMovement),
        });
      }

      // Start periodic path capture every 5 minutes
      // intervalRef.current = setInterval(
      //   () => {
      //     if (pathMovement.length > 0) {
      //       const last = pathMovement[pathMovement.length - 1];

      //       attendanceUpdate.mutate({
      //         field: "id",
      //         value: logId!,
      //         updates: {
      //           pathMovement: appendPath(todayAttendance?.pathMovement, last),
      //         },
      //       });
      //     }
      //   },
      //   5 * 60 * 1000,
      // ); // 5 minutes
    } else {
      // ---- CHECK OUT ----
      setIsCheckedIn(false);

      const now = getCurrentDateTimeString();

      // Stop tracking timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Save final position
      if (pathMovement.length > 0) {
        const last = pathMovement[pathMovement.length - 1];

        attendanceUpdate.run({
          field: "id",
          value: logId!,
          updates: {
            timeOut: now,
            pathMovement: appendPath(todayAttendance?.pathMovement, last),
          },
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Attendance Tracker ({isCheckedIn ? "Checked In" : "Checked Out"})
        </h2>
        <button
          onClick={handleAttendanceToggle}
          className={`rounded px-4 py-2 text-white ${
            isCheckedIn ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>
      </div>

      <GeoViewer
        serviceParameters={{
          mode: "tracking",
          highAccuracy: true,
          minDistance: 3,
          autoStopAfterMs: 5000,
        }}
        serviceCallbacks={{
          onCoords: (c) => setCurrentCoords(c),
          onPath: (p) => setPathMovement(p),
          onStart: () => console.log("Started tracking"),
          onStop: () => console.log("Stopped"),
          onError: (err) => console.log("Error: ", err),
        }}
        uiParameters={{
          autoStart: true,
          showDefaultControls: false,
          showDefaultData: true,
          showMap: true,
        }}
      />

      <div className="rounded border bg-gray-50 p-4">
        <p>
          <strong>Time In:</strong>{" "}
          {todayAttendance?.timeIn
            ? formatReadableDateTime(todayAttendance.timeIn)
            : "—"}
        </p>
        <p>
          <strong>Time Out:</strong>{" "}
          {todayAttendance?.timeOut
            ? formatReadableDateTime(todayAttendance.timeOut)
            : "—"}
        </p>
        <p>
          <strong>Path Points Recorded:</strong> {pathMovement.length}
        </p>
      </div>
    </div>
  );
}
