import { useState, useRef, useEffect } from "react";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import type { AttendanceLog } from "@/models/attendance";
import { useAuth } from "@saintrelion/auth-lib";

import {
  formatReadableDate,
  formatReadableDateTime,
  getCurrentDateTimeString,
  isSameDay,
} from "@saintrelion/time-functions";

import {
  appendPath,
  encodePath,
} from "../../pages/to-be-library/geo/lib/parser";
import { GeoViewer } from "../../pages/to-be-library/geo/GeoViewer";
import { useGeoStore } from "@/pages/to-be-library/geo/useGeoStore";

export default function InstructorAttendance() {
  const { user } = useAuth();

  const initTracking = useGeoStore((s) => s.initTracking);

  useEffect(() => {
    initTracking();
  }, [initTracking]);

  const pathMovement = useGeoStore((s) => s.path);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Attendance Select, Update, Insert
  const {
    useSelect: attendanceSelect,
    useInsert: attendanceInsert,
    useUpdate: attendanceUpdate,
  } = useDBOperationsLocked<AttendanceLog>("AttendanceLog");
  const { data: attendanceLogs = [] } = attendanceSelect({
    firebaseOptions: {
      filterField: "employeeId",
      value: user.employeeId,
    },
    mockOptions: {
      filterFn: (a) => a.employeeId === user.employeeId,
    },
  });

  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const todayAttendance = attendanceLogs.find((log) => {
    const today = getCurrentDateTimeString();
    // console.log("TODAY--");
    // console.log(formatReadableDate(today));
    // console.log(formatReadableDate(log.createdAt));

    if (isSameDay(formatReadableDate(log.createdAt), formatReadableDate(today)))
      return log;
  });

  useEffect(() => {
    setIsCheckedIn(todayAttendance != undefined);
  }, [todayAttendance]);

  const handleAttendanceToggle = async () => {
    const logId = todayAttendance?.id;
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
      const now = getCurrentDateTimeString();
      setIsCheckedIn(false);

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
          className={`cursor-pointer rounded px-4 py-2 text-white ${
            isCheckedIn ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>
      </div>

      <GeoViewer
        uiParameters={{
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
        {/* <p>
          <strong>Path Points Recorded:</strong> {pathMovement.length}
        </p> */}
      </div>
    </div>
  );
}
