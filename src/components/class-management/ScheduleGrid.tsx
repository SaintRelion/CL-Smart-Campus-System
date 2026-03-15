import type { ClassSubject } from "@/models/class-subject";
import React from "react";

export const ScheduleGrid = ({
  otherClasses,
  selectedDays,
}: {
  otherClasses: ClassSubject[];
  selectedDays: string[];
}) => {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // dynamic times from classes
  const timeSlots = Array.from(
    new Set(otherClasses.map((cls) => cls.time)),
  ).sort((a, b) => {
    const [ha, ma] = a.split(":").map(Number);
    const [hb, mb] = b.split(":").map(Number);
    return ha - hb || ma - mb;
  });

  const formatTime = (time24: string) => {
    const [hour, minute] = time24.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="space-y-4">
      {/* GRID */}
      <div className="grid grid-cols-[90px_repeat(7,1fr)] gap-1 text-xs">
        <div></div>
        {weekDays.map((day) => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}

        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className="text-md my-2 flex items-center justify-center pr-2 font-medium">
              {formatTime(time)}
            </div>

            {weekDays.map((day) => {
              const occupiedClasses = otherClasses.filter(
                (cls) => cls.time === time && cls.days.includes(day),
              );
              const isSelected = selectedDays.includes(day);

              return (
                <div
                  key={day + time}
                  className={`flex h-16 flex-col items-center justify-center rounded border px-1 text-sm text-white ${
                    occupiedClasses.length
                      ? "bg-red-400"
                      : isSelected
                        ? "bg-green-400"
                        : "bg-green-200"
                  }`}
                  title={occupiedClasses.map((cls) => cls.title).join(", ")}
                >
                  {occupiedClasses.map((cls) => (
                    <div key={cls.id} className="w-full truncate text-center">
                      {cls.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* LEGEND */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border bg-red-400" />
          Occupied
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border bg-green-200" />
          Available
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border bg-green-400" />
          Selected Day
        </div>
      </div>
    </div>
  );
};
