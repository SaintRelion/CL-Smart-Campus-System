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
const InstructorClassManagement = () => {
  const { user } = useAuth();

  // Classes Select, Insert, Update
  const {
    useSelect: classesSelect,
    useInsert: classesInsert,
    useDelete: classesDelete,
  } = useDBOperationsLocked<ClassSubject>("ClassSubject");

  const { data: classes = [] } = classesSelect();
  const myClasses = classes.filter((c) => c.employeeId === user.employeeId);
  const otherClasses = classes.filter((c) => c.employeeId !== user.employeeId);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) =>
    String(currentYear - i),
  );

  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [conflict, setConflict] = useState(false);

  const filteredMyClasses = myClasses.filter((cls) => {
    const matchesSemester =
      selectedSemester === "all" || cls.semester === selectedSemester;

    const matchesYear = selectedYear === "all" || cls.year === selectedYear;

    return matchesSemester && matchesYear;
  });

  const filteredOtherClasses = otherClasses.filter(
    (cls) =>
      (selectedSemester === "all" || cls.semester === selectedSemester) &&
      (selectedYear === "all" || cls.year === selectedYear),
  );

  // Conflict checker
  const hasConflict = (time: string, days: string[]) => {
    return filteredOtherClasses.some(
      (cls) => cls.time === time && cls.days.some((d) => days.includes(d)),
    );
  };

  const handleAddClass = (data: Record<string, string>) => {
    if (conflict) {
      alert("⚠️ Cannot create class: time conflict detected!");
      return;
    }
    classesInsert.run({ ...data, employeeId: user.employeeId });
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
          <DialogContent className="max-w-6xl!">
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Fill in the details to create your class.
              </DialogDescription>
            </DialogHeader>

            <RenderForm>
              {/* MAIN LAYOUT */}
              <div className="flex gap-10">
                {/* LEFT SIDE — FORM */}
                <div className="flex-1 space-y-5">
                  <div className="flex gap-4">
                    <RenderFormField
                      field={{
                        label: "Semester",
                        type: "select",
                        name: "semester",
                        options: ["1st", "2nd"],
                        onValueChange: (value) => {
                          setSelectedSemester(value as string);
                        },
                      }}
                    />

                    <RenderFormField
                      field={{
                        label: "Year",
                        type: "select",
                        name: "year",
                        options: yearOptions,
                        onValueChange: (value) => {
                          setSelectedYear(value as string);
                        },
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
                    field={{
                      label: "Room",
                      type: "text",
                      name: "room",
                    }}
                  />

                  <RenderFormField
                    field={{
                      label: "Days",
                      type: "multi-select",
                      name: "days",
                      options: days,
                      onValueChange: (value) => {
                        const selected = value as string[];
                        setSelectedDays(selected);
                        setConflict(hasConflict(selectedTime, selected));
                      },
                    }}
                  />

                  <RenderFormField
                    field={{
                      label: "Time",
                      type: "time",
                      name: "time",
                      onValueChange: (value) => {
                        const time = value as string;
                        setSelectedTime(time);
                        setConflict(hasConflict(time, selectedDays));
                        if (hasConflict(time, selectedDays)) {
                          alert(
                            "⚠️ Conflict detected! One or more selected days already have a class at this time.",
                          );
                        }
                      },
                    }}
                  />

                  <RenderFormButton
                    buttonLabel="Create Class"
                    isDisabled={classesInsert.isLocked || conflict}
                    onSubmit={handleAddClass}
                  />
                </div>

                {/* RIGHT SIDE — SCHEDULE GRID */}
                <div className="w-[500px] overflow-auto">
                  <ScheduleGrid
                    otherClasses={filteredOtherClasses}
                    selectedDays={selectedDays}
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
                    {formatReadableTime(item.time)} • {item.room || "No Room"}
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
