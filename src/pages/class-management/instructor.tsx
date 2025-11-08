import { useState } from "react";

import { useAuth } from "@saintrelion/auth-lib";
import { useDBOperations } from "@saintrelion/data-access-layer";
import type { ClassSubject } from "@/models/class-subject";
import { buildFieldsFromModel } from "../to-be-library/forms/lib/helper";
import RenderForm from "../to-be-library/forms/render-form";
import { RenderFormFields } from "../to-be-library/forms/render-form-fields";
import { RenderFormButton } from "../to-be-library/forms/render-form-button";
import { formatReadableTime } from "@saintrelion/time-functions";
import { RenderCard, RenderDialog, RenderDataCore } from "@saintrelion/ui";

// TODO: CONTINUE WORKING ON FRAMEWORK EXTRACTION AND CLOSE THESE, OH MY GOD, HOW LONG WILL YOU KEEP
// HOVERING ON THIS FRAMEWORK CREATION???????? YOU STILL HAVE OTHER THINGS TO DO my god

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const classFields = buildFieldsFromModel({
  title: { type: "text", label: "Subject Title" },
  time: { type: "time", label: "Time" },
  date: { type: "date", label: "Date" },
  room: { type: "text", label: "Room" },
  days: { type: "checkbox", options: daysOfWeek, label: "Days" },
});

const addStudentFields = buildFieldsFromModel({
  studentName: { type: "text", label: "Student Name" },
});

const InstructorClassManagement = () => {
  const { user } = useAuth();

  const {
    useSelect: classesSelect,
    useInsert: classesInsert,
    useUpdate: classesUpdate,
  } = useDBOperations<ClassSubject>("ClassSubject");
  const { data: classes = [] } = classesSelect({
    firebaseOptions: { filterField: "employeeID", value: user.employeeID },
    mockOptions: { filterFn: (c) => c.employeeID === user.employeeID },
  });

  const [selectedClass, setSelectedClass] = useState<ClassSubject | null>(null);

  const handleAddClass = (data: Record<string, string>) => {
    console.log(data);
    classesInsert.mutate({
      ...data,
      employeeID: user.employeeID,
      students: [],
    });
  };

  const handleAddStudent = (
    data: Record<string, string>,
    cls: ClassSubject,
  ) => {
    if (!data.studentName.trim()) return;
    classesUpdate.mutate({
      field: "id",
      value: cls.id,
      updates: { students: [...(cls.students || []), data.studentName] },
    });
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header + Add Class */}
      <RenderCard
        headerTitle="Class Management"
        ui={{ wrapperClass: "flex justify-between items-center" }}
      >
        <RenderDialog
          triggerLabel="Add New Class"
          headerTitle="Create New Class"
          description="Fill in the details to create your class."
        >
          <RenderForm wrapperClass="space-y-5">
            <RenderFormFields fields={classFields} />
            <RenderFormButton
              buttonLabel="Create Class"
              onSubmit={handleAddClass}
            />
          </RenderForm>
        </RenderDialog>
      </RenderCard>

      {/* CLASS LIST */}
      <RenderCard headerTitle="My Classes">
        <RenderDataCore
          data={classes}
          renderItem={(item) => (
            <>
              <button
                className="text-left font-medium text-blue-600 hover:underline"
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
                <RenderDialog
                  triggerLabel="Add Student"
                  headerTitle={`Add Student to ${item.title}`}
                >
                  <div className="space-y-3">
                    <RenderForm>
                      <RenderFormFields
                        wrapperClass="w-full mb-4"
                        fields={addStudentFields}
                      />
                      <RenderFormButton
                        buttonLabel="Add Student"
                        onSubmit={(data) => handleAddStudent(data, item)}
                      />
                    </RenderForm>
                  </div>
                </RenderDialog>
              </div>
            </>
          )}
        />
      </RenderCard>

      {/* STUDENT LIST DIALOG */}
      {selectedClass && (
        <RenderDialog
          open={!!selectedClass}
          onOpenChange={(open) => !open && setSelectedClass(null)}
          headerTitle={selectedClass.title}
          description={`Students enrolled in this class.`}
        >
          <RenderDataCore
            data={selectedClass.students}
            renderItem={(item) => (
              <>
                <p>{item}</p>
              </>
            )}
          />
        </RenderDialog>
      )}
    </div>
  );
};
export default InstructorClassManagement;
