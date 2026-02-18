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
  const { useSelect: classesSelect, useInsert: classesInsert } =
    useDBOperationsLocked<ClassSubject>("ClassSubject");
  const { data: classes = [] } = classesSelect({
    firebaseOptions: { filterField: "employeeId", value: user.employeeId },
    mockOptions: { filterFn: (c) => c.employeeId === user.employeeId },
  });

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from({ length: 5 }, (_, i) =>
    String(currentYear - i),
  );

  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const filteredClasses = classes.filter((cls) => {
    const matchesSemester =
      selectedSemester === "all" || cls.semester === selectedSemester;

    const matchesYear = selectedYear === "all" || cls.year === selectedYear;

    return matchesSemester && matchesYear;
  });

  const handleAddClass = (data: Record<string, string>) => {
    console.log(data);
    classesInsert.run({
      ...data,
      employeeId: user.employeeId,
    });
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Fill in the details to create your class.
              </DialogDescription>
            </DialogHeader>
            <RenderForm wrapperClassName="space-y-5">
              <div className="flex justify-around">
                <RenderFormField
                  field={{
                    label: "Semester",
                    type: "select",
                    name: "semester",
                    options: ["1st", "2nd"],
                  }}
                />{" "}
                <RenderFormField
                  field={{
                    label: "Year",
                    type: "select",
                    name: "year",
                    options: yearOptions,
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
                field={{ label: "Time", type: "time", name: "time" }}
              />
              <RenderFormField
                field={{ label: "Room", type: "text", name: "room" }}
              />
              <RenderFormField
                field={{
                  label: "Days",
                  type: "multi-select",
                  name: "days",
                  options: days,
                }}
              />
              <RenderFormButton
                buttonLabel="Create Class"
                isDisabled={classesInsert.isLocked}
                onSubmit={handleAddClass}
              />
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
        {filteredClasses.length == 0 ? (
          <div className="text-gray-500 italic">No classes</div>
        ) : (
          <RenderDataCore
            ui={{ content: { wrapperClassName: "flex flex-col space-y-4" } }}
            data={filteredClasses}
            renderItem={(item) => (
              <div className="rounded-md p-4 shadow-xl">
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
            )}
          />
        )}
      </div>
    </div>
  );
};
export default InstructorClassManagement;
