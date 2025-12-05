import { useState } from "react";

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
    useUpdate: classesUpdate,
  } = useDBOperationsLocked<ClassSubject>("ClassSubject");
  const { data: classes = [] } = classesSelect({
    firebaseOptions: { filterField: "employeeId", value: user.employeeId },
    mockOptions: { filterFn: (c) => c.employeeId === user.employeeId },
  });

  const [selectedClass, setSelectedClass] = useState<ClassSubject | null>(null);

  const handleAddClass = (data: Record<string, string>) => {
    console.log(data);
    classesInsert.run({
      ...data,
      employeeId: user.employeeId,
      students: [],
    });
  };

  const handleAddStudent = (data: Record<string, string>) => {
    if (!data.studentName.trim() || selectedClass == null) return;
    classesUpdate.run({
      field: "id",
      value: selectedClass.id,
      updates: {
        students: [...(selectedClass.students || []), data.studentName],
      },
    });
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header + Add Class */}
      <div className="flex items-center justify-between">
        <h1>Class Management</h1>
        <Dialog>
          <DialogTrigger>
            <Button>Add New Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Fill in the details to create your class.
              </DialogDescription>
            </DialogHeader>
            <RenderForm wrapperClass="space-y-5">
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
                onSubmit={handleAddClass}
              />
            </RenderForm>
          </DialogContent>
        </Dialog>
      </div>

      {/* CLASS LIST */}
      <div className="">
        <h1>My Classes</h1>
        <RenderDataCore
          ui={{ content: { wrapperClassName: "flex flex-col space-y-4" } }}
          data={classes}
          renderItem={(item) => (
            <div className="rounded-md p-4 shadow-xl">
              <button
                className="bg-transparent font-medium text-blue-600 hover:bg-transparent hover:underline"
                onClick={() => setSelectedClass(item)}
              >
                {item.title}
              </button>
              <p className="text-sm text-gray-600">
                {formatReadableTime(item.time)} • {item.room || "No Room"}
              </p>
              <p className="text-xs text-gray-500">
                Days: {item.days.join(", ")}
              </p>
              <div className="mt-3">
                <Dialog
                  onOpenChange={(open) => !open && setSelectedClass(null)}
                >
                  <DialogTrigger>
                    <Button
                      className="bg-black/80 px-3 text-xs"
                      onClick={() => setSelectedClass(item)}
                    >
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Student to ${item.title}</DialogTitle>
                      <DialogDescription>Desc</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <RenderForm wrapperClass="space-y-2">
                        <RenderFormField
                          field={{
                            label: "Student Name",
                            type: "text",
                            name: "studentName",
                          }}
                        />
                        <RenderFormButton
                          buttonLabel="Add Student"
                          onSubmit={handleAddStudent}
                        />
                      </RenderForm>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        />
      </div>

      {/* STUDENT LIST DIALOG */}
      {selectedClass && (
        <Dialog
          open={!!selectedClass}
          onOpenChange={(open) => !open && setSelectedClass(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedClass.title}</DialogTitle>
              <DialogDescription>
                Students enrolled in this class.
              </DialogDescription>
            </DialogHeader>
            <RenderDataCore
              data={selectedClass.students}
              renderItem={(item) => (
                <>
                  <p>{item}</p>
                </>
              )}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
export default InstructorClassManagement;
