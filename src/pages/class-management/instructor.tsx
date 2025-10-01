import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatTime24To12 } from "@/lib/mydate";
import { useAuth } from "@saintrelion/auth-lib";
import { useDBOperations } from "@saintrelion/data-access-layer";
import type { Classes } from "@/models/classes";
import type { ClassesNotifications } from "@/models/classes-notifications";
import { generateCode } from "@/lib/utils";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const InstructorClassManagement = () => {
  const { user } = useAuth();

  const {
    useSelect: classesSelect,
    useInsert: classesInsert,
    useUpdate: classesUpdate,
  } = useDBOperations<Classes>("Classes");
  const { data: classes = [] } = classesSelect({
    firebaseOptions: { filterField: "userID", value: user.id },
    mockOptions: { filterFn: (c) => c.userID === user.id },
  });

  const { useSelect: notificationSelect, useInsert: notificationInsert } =
    useDBOperations<ClassesNotifications>("ClassesNotifications");

  // Fetch today's notifications for this instructor's classes
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const { data: todaysNotifications } = notificationSelect({
    firebaseOptions: { filterField: "date", value: today },
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Classes>();

  const [addClass, setAddClass] = useState(false);
  const [timeDialog, setTimeDialog] = useState<{
    open: boolean;
    classID: string | null;
  }>({ open: false, classID: null });
  const [newTime, setNewTime] = useState("");
  const [reasonDialog, setReasonDialog] = useState<{
    open: boolean;
    classID: string | null;
    type: ClassesNotifications["type"] | null;
  }>({ open: false, classID: null, type: null });
  const [reason, setReason] = useState("");

  // CREATE CLASS
  useEffect(() => {
    setValue("code", generateCode());
  }, [setValue]);

  const onSubmit = (data: Classes) => {
    const newClass: Classes = {
      ...data,
      userID: user.id,
    };

    classesInsert.mutate(newClass);
    reset();
    setAddClass(false);
  };

  // ACTIONS
  const handleOpenTimeDialog = (cls: Classes) => {
    setNewTime(cls.time);
    setTimeDialog({ open: true, classID: cls.id });
  };

  const handleConfirmTimeChange = () => {
    if (timeDialog.classID && newTime) {
      classesUpdate.mutate({
        id: timeDialog.classID,
        updates: { time: newTime },
      });

      notificationInsert.mutate({
        classID: timeDialog.classID,
        type: "time_change",
        message: `Class time updated to ${formatTime24To12(newTime)}`,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        time: new Date().toISOString().split("T")[1].split(".")[0], // HH:mm:ss
      });
    }
    setTimeDialog({ open: false, classID: null });
  };

  const handleChangeRoom = (cls: Classes) => {
    const newRoom = prompt("Enter new room:", cls.room || "");
    if (newRoom) {
      classesUpdate.mutate({ id: cls.id, updates: { room: newRoom } });

      notificationInsert.mutate({
        classID: cls.id,
        type: "room_change",
        message: `Room changed to ${newRoom}`,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        time: new Date().toISOString().split("T")[1].split(".")[0], // HH:mm:ss
      });
    }
  };

  const handleNoClass = (cls: Classes) => {
    setReasonDialog({ open: true, classID: cls.id, type: "cancellation" });
  };

  const confirmReason = () => {
    if (reasonDialog.classID && reasonDialog.type) {
      notificationInsert.mutate({
        classID: reasonDialog.classID,
        type: reasonDialog.type,
        message: reason,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        time: new Date().toISOString().split("T")[1].split(".")[0], // HH:mm:ss
      });
    }
    setReason("");
    setReasonDialog({ open: false, classID: null, type: null });
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Class Management</h1>

        {/* Dialog Trigger For Add Class */}
        <Dialog open={addClass} onOpenChange={setAddClass}>
          <DialogTrigger asChild>
            <Button>Add New Class</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Enter your class description
              </DialogDescription>
            </DialogHeader>

            {/* Error Loop */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-3 rounded bg-red-100 p-3 text-sm text-red-700">
                <ul className="list-inside list-disc">
                  {Object.entries(errors).map(([field, err]) => (
                    <li key={field}>
                      {err?.message || `${field} is required`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  {...register("title", { required: true })}
                  placeholder="Enter subject name"
                />
              </div>

              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  {...register("code", { required: true })}
                  placeholder="FILI-101"
                />
              </div>

              <div className="space-y-2">
                <Label>Room</Label>
                <Input {...register("room")} placeholder="Room 201" />
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" {...register("time", { required: true })} />
              </div>

              <div className="space-y-2">
                <Label>Days</Label>
                <div className="mt-1 flex flex-wrap gap-3">
                  {daysOfWeek.map((day) => (
                    <label
                      key={day}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        value={day}
                        {...register("days", { required: true })}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Class
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog Trigger for Change Time */}
      <Dialog
        open={timeDialog.open}
        onOpenChange={() => setTimeDialog({ open: false, classID: null })}
      >
        <DialogContent aria-describedby="Change Class Time">
          <DialogHeader>
            <DialogTitle>Change Class Time</DialogTitle>
            <DialogDescription>
              Update your class time, this will notify everyone enrolled in this
              class
            </DialogDescription>
          </DialogHeader>
          <Input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="mt-2"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTimeDialog({ open: false, classID: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmTimeChange}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Reason (No Class, Instructor Absence, etc.) */}
      <Dialog
        open={reasonDialog.open}
        onOpenChange={() =>
          setReasonDialog({ open: false, classID: null, type: null })
        }
      >
        <DialogContent aria-describedby="No Class">
          <DialogHeader>
            <DialogTitle>Provide Reason</DialogTitle>
            <DialogDescription>
              Mark today as No class. This will notify everyone enrolled on this
              class
            </DialogDescription>
          </DialogHeader>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain reason..."
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setReasonDialog({ open: false, classID: null, type: null })
              }
            >
              Cancel
            </Button>
            <Button onClick={confirmReason}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LIST OF CLASSES */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">My Classes</h2>
        {classes.length === 0 ? (
          <p className="text-gray-500">No classes created yet.</p>
        ) : (
          <ul className="space-y-3">
            {classes.map((cls) => {
              const latestCancellation = todaysNotifications
                ?.filter(
                  (n) => n.classID === cls.id && n.type === "cancellation",
                )
                .sort(
                  (a, b) =>
                    new Date(b.date + "T" + b.time).getTime() -
                    new Date(a.date + "T" + a.time).getTime(),
                )[0];

              return (
                <li
                  key={cls.id}
                  className="flex items-center justify-between rounded-lg border p-4 shadow"
                >
                  <div>
                    <p className="font-medium">{cls.title}</p>
                    <p className="text-sm text-gray-500">
                      {cls.code} • {cls.room || "No Room"} •{" "}
                      {formatTime24To12(cls.time)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Days: {cls.days.join(", ")}
                    </p>

                    {/* Cancellation notice */}
                    {latestCancellation && (
                      <p className="mt-1 text-sm font-medium text-red-600">
                        🚫 Cancelled: {latestCancellation.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleChangeRoom(cls)}
                    >
                      Change Room
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenTimeDialog(cls)}
                    >
                      Change Time
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={
                        !cls.days.includes(
                          new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                          }),
                        )
                      }
                      onClick={() => handleNoClass(cls)}
                    >
                      No Class
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
export default InstructorClassManagement;
