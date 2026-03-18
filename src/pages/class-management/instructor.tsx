import { useAuth } from "@saintrelion/auth-lib";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import type { ClassSubject } from "@/models/class-subject";
import { formatReadableTime } from "@saintrelion/time-functions";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RenderDataCore } from "@saintrelion/ui";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ScheduleGrid } from "@/components/class-management/ScheduleGrid";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const toMins = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const InstructorClassManagement = () => {
  const { user } = useAuth();

  // Classes Select, Insert, Update
  const {
    useSelect: classesSelect,
    useInsert: classesInsert,
    useDelete: classesDelete,
  } = useDBOperationsLocked<ClassSubject>("ClassSubject");

  const { data: allClasses = [] } = classesSelect();
  const myClasses = allClasses.filter((c) => c.employeeId === user.employeeId);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) =>
    String(currentYear - i),
  );

  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [selectedTimeIn, setSelectedTimeIn] = useState("08:00");
  const [selectedTimeOut, setSelectedTimeOut] = useState("09:00");

  const [conflict, setConflict] = useState(false);

  const filteredMyClasses = myClasses.filter((cls) => {
    const matchesSemester =
      selectedSemester === "all" || cls.semester === selectedSemester;

    const matchesYear = selectedYear === "all" || cls.year === selectedYear;

    return matchesSemester && matchesYear;
  });

  const allFilterClasses = allClasses.filter(
    (cls) =>
      (selectedSemester === "all" || cls.semester === selectedSemester) &&
      (selectedYear === "all" || cls.year === selectedYear),
  );

  const isTimeInvalid = toMins(selectedTimeIn) >= toMins(selectedTimeOut);
  // Conflict checker
  const hasConflict = (
    timeIn: string,
    timeOut: string,
    selectedDays: string[],
  ) => {
    if (!timeIn || !timeOut || selectedDays.length === 0) return false;

    const newStart = toMins(timeIn);
    const newEnd = toMins(timeOut);

    return allFilterClasses.some((cls) => {
      const dayOverlap = cls.days.some((d) => selectedDays.includes(d));
      if (!dayOverlap) return false;

      const existStart = toMins(cls.time_in);
      const existEnd = toMins(cls.time_out);

      // EXCLUSIVE RANGE CONFLICT:
      // Only conflicts if there is a real overlap.
      // If New Start (10:00) == Exist End (10:00), this returns FALSE.
      return newStart < existEnd && newEnd > existStart;
    });
  };

  const handleAddClass = (data: Record<string, string>) => {
    if (conflict) {
      alert("⚠️ Cannot create class: time conflict detected!");
      return;
    }

    const finalData = {
      ...data,
      time_in: selectedTimeIn,
      time_out: selectedTimeOut,
      employeeId: user.employeeId,
    };

    classesInsert.run(finalData);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header + Add Class */}
      <div className="flex items-center justify-between">
        <h1>Class Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Class</Button>
          </DialogTrigger>

          {/* WIDER DIALOG */}
          <DialogContent className="w-[95vw] max-w-7xl!">
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Fill in the details to create your class.
              </DialogDescription>
            </DialogHeader>

            <RenderForm>
              {/* MAIN LAYOUT: 30% Form / 70% Grid */}
              <div className="flex h-[70vh] gap-8 overflow-hidden">
                {/* LEFT SIDE — FORM (Fixed Width 30%) */}
                <div className="w-[30%] space-y-4 overflow-y-auto px-2 pr-2">
                  <div className="grid grid-cols-2 gap-3">
                    <RenderFormField
                      field={{
                        label: "Semester",
                        type: "select",
                        name: "semester",
                        options: ["1st", "2nd"],
                        onValueChange: (v) => setSelectedSemester(v as string),
                      }}
                    />
                    <RenderFormField
                      field={{
                        label: "Year",
                        type: "select",
                        name: "year",
                        options: yearOptions,
                        onValueChange: (v) => setSelectedYear(v as string),
                      }}
                    />
                  </div>

                  <RenderFormField
                    field={{
                      label: "Subject Title",
                      type: "text",
                      name: "title",
                    }}
                  />
                  <RenderFormField
                    field={{ label: "Room", type: "text", name: "room" }}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    {/* Time In Manual Field */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold uppercase">
                        Time In
                      </label>
                      <input
                        type="time"
                        list="time-steps"
                        step="1800"
                        value={selectedTimeIn}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedTimeIn(val);
                          setConflict(
                            hasConflict(val, selectedTimeOut, selectedDays),
                          );
                        }}
                        className="border-b border-black p-1 font-bold focus:outline-none"
                      />
                    </div>

                    {/* Time Out Manual Field */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold uppercase">
                        Time Out
                      </label>
                      <input
                        type="time"
                        list="time-steps"
                        step="1800"
                        value={selectedTimeOut}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedTimeOut(val);
                          setConflict(
                            hasConflict(selectedTimeIn, val, selectedDays),
                          );
                        }}
                        className="border-b border-black p-1 font-bold focus:outline-none"
                      />
                    </div>

                    {/* The Secret Sauce: Datalist forces the popup to show 30-min intervals */}
                    <datalist id="time-steps">
                      {Array.from({ length: 48 }).map((_, i) => {
                        const h = Math.floor(i / 2)
                          .toString()
                          .padStart(2, "0");
                        const m = i % 2 === 0 ? "00" : "30";
                        return <option key={i} value={`${h}:${m}`} />;
                      })}
                    </datalist>
                  </div>

                  <RenderFormField
                    field={{
                      label: "Days",
                      type: "multi-select",
                      name: "days",
                      options: days,
                      onValueChange: (v) => {
                        const selected = v as string[];
                        setSelectedDays(selected);
                        setConflict(
                          hasConflict(
                            selectedTimeIn,
                            selectedTimeOut,
                            selected,
                          ),
                        );
                      },
                    }}
                  />

                  <div className="pt-4">
                    {(conflict || isTimeInvalid) && (
                      <p className="mb-2 text-xs font-bold tracking-tight text-red-500 uppercase">
                        {isTimeInvalid
                          ? "⚠️ Time Out must be later than Time In"
                          : "⚠️ Conflict detected in schedule"}
                      </p>
                    )}

                    <RenderFormButton
                      buttonLabel="Create Class"
                      isDisabled={
                        classesInsert.isLocked || conflict || isTimeInvalid
                      }
                      onSubmit={handleAddClass}
                    />
                  </div>
                </div>

                {/* RIGHT SIDE — SCHEDULE GRID (Flexible 70%) */}
                <div className="flex-1 overflow-y-auto rounded-xl border bg-gray-50 p-4">
                  <ScheduleGrid
                    allClasses={allFilterClasses}
                    selectedDays={selectedDays}
                    // Pass selected range to show preview in grid
                    previewRange={{ in: selectedTimeIn, out: selectedTimeOut }}
                  />
                </div>
              </div>
            </RenderForm>
          </DialogContent>
        </Dialog>
      </div>

      {/* CLASS LIST */}
      <div className="">
        <div className="flex justify-between">
          <h1>My Classes</h1>
          <div className="mb-4 flex gap-4">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="rounded border px-3 py-1 text-sm"
            >
              <option value="all">All Semesters</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded border px-3 py-1 text-sm"
            >
              <option value="all">All Years</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        {filteredMyClasses.length == 0 ? (
          <div className="text-gray-500 italic">No classes</div>
        ) : (
          <RenderDataCore
            ui={{ content: { wrapperClassName: "flex flex-col space-y-4" } }}
            data={filteredMyClasses}
            renderItem={(item) => (
              <div className="flex items-center justify-between rounded-md p-4 shadow-xl">
                <div className="">
                  <div className="font-medium text-blue-600">{item.title}</div>

                  <p className="text-sm text-gray-600">
                    {formatReadableTime(item.time_in)} –{" "}
                    {formatReadableTime(item.time_out)} •{" "}
                    {item.room || "No Room"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {item.semester} Semester • {item.year}
                  </p>

                  <p className="text-xs text-gray-500">
                    Days: {item.days.join(", ")}
                  </p>
                </div>
                <Trash2
                  className="h-4 w-4 text-red-700"
                  onClick={() => {
                    if (!classesDelete.isLocked) classesDelete.run(item.id);
                  }}
                />
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};
export default InstructorClassManagement;
