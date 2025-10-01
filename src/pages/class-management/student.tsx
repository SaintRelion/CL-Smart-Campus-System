import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { BookIcon } from "lucide-react";

import { useAuth } from "@saintrelion/auth-lib";
import type { EnrolledClasses } from "@/models/enrolled-classes";
import { useDBOperations } from "@saintrelion/data-access-layer";
import type { Classes } from "@/models/classes";

const StudentClassManagement = () => {
  const { user } = useAuth();

  // DB Operations
  const { useSelect: enrolledSelect, useInsert: enrolledInsert } =
    useDBOperations<EnrolledClasses>("EnrolledClasses");
  const { useSelect: classesSelect } = useDBOperations<Classes>("Classes");

  // Queries
  const { data: enrolled = [] } = enrolledSelect({
    firebaseOptions: { filterField: "userID", value: user.id },
    mockOptions: { filterFn: (e) => e.userID === user.id },
  });

  const { data: allClasses = [] } = classesSelect();

  // Join Class handler
  const handleJoinClass = (code: string, closeDialog: () => void) => {
    const foundClass = allClasses.find((cls) => cls.code === code.trim());
    if (!foundClass) {
      alert("Class code not found.");
      return;
    }

    enrolledInsert.mutate({
      userID: user.id,
      classID: foundClass.id,
    });

    closeDialog();
  };

  return (
    <div className="space-y-6">
      {/* Enrolled Classes - placed below */}
      <Card className="border-muted rounded-2xl border transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <BookIcon className="text-primary h-5 w-5" />
            <CardTitle className="text-lg">Enrolled Classes</CardTitle>
          </div>
          <JoinClassButton onJoin={handleJoinClass} />
        </CardHeader>
        <CardContent>
          {enrolled.length > 0 ? (
            <ul className="text-md space-y-2">
              {enrolled.map((ecl) => {
                const classInfo = allClasses.find((c) => c.id === ecl.classID);

                return (
                  <li
                    key={ecl.id}
                    className="bg-muted/20 hover:bg-muted flex items-center justify-between rounded-md px-2 py-1 transition"
                  >
                    <span className="font-medium">{classInfo?.title}</span>
                    <span className="text-md text-black/80">
                      Code: {classInfo?.code}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">
              You are not enrolled in any classes.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default StudentClassManagement;

export function JoinClassButton({
  onJoin,
}: {
  onJoin: (code: string, closeDialog: () => void) => void;
}) {
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    if (!code.trim()) return;
    onJoin(code, () => {
      setCode("");
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Join Class +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Class</DialogTitle>
          <DialogDescription>
            Enter the class code provided by your instructor to join.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter class code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm}>Join</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
