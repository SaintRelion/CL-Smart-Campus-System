import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { allInstructorClasses } from "@/data/mock-classes-instructor";
import type { ClassesProps } from "@/models/classes-instructor";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatTime } from "@/lib/mydate";
import { useAuth } from "@saintrelion/auth-lib";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const InstructorClassManagement = () => {
  const { user } = useAuth();
  const initialClasses = useMemo(
    () => allInstructorClasses.filter((c) => c.userId == user.id),
    [allInstructorClasses],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassesProps>();
  const [classes, setClasses] = useState<ClassesProps[]>(initialClasses);
  const [addClass, setAddClass] = useState(false);

  const [timeDialog, setTimeDialog] = useState<{
    open: boolean;
    classId: number | null;
  }>({
    open: false,
    classId: null,
  });
  const [newTime, setNewTime] = useState("");

  const onSubmit = (data: ClassesProps) => {
    const newClass: ClassesProps = {
      ...data,
      id: classes.length + 1,
      userId: user.id, // TODO: replace with logged-in instructor
    };
    setClasses((prev) => [...prev, newClass]);
    reset();
    setAddClass(false);
  };

  // ACTIONS

  const handleOpenTimeDialog = (cls: ClassesProps) => {
    setNewTime(cls.time); // preload existing time
    setTimeDialog({ open: true, classId: cls.id });
  };

  const handleConfirmTimeChange = () => {
    if (timeDialog.classId && newTime) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === timeDialog.classId ? { ...c, time: newTime } : c,
        ),
      );
      alert(`Class time updated to ${newTime}. Students notified instantly.`);
    }
    setTimeDialog({ open: false, classId: null });
  };

  const handleChangeRoom = (cls: ClassesProps) => {
    const newRoom = prompt("Enter new room:", cls.room || "");

    if (newRoom) {
      setClasses((prev) =>
        prev.map((c) => (c.id === cls.id ? { ...c, room: newRoom } : c)),
      );
      alert(`Room changed to ${newRoom}. Students notified instantly.`);
    }
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
        onOpenChange={() => setTimeDialog({ open: false, classId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Class Time</DialogTitle>
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
              onClick={() => setTimeDialog({ open: false, classId: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmTimeChange}>Save</Button>
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
            {classes.map((cls) => (
              <li
                key={cls.id}
                className="flex items-center justify-between rounded-lg border p-4 shadow"
              >
                <div>
                  <p className="font-medium">{cls.title}</p>
                  <p className="text-sm text-gray-500">
                    {cls.code} • {cls.room || "No Room"} •{" "}
                    {formatTime(cls.time)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Days: {cls.days.join(", ")}
                  </p>
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default InstructorClassManagement;
