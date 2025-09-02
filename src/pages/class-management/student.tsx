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

import { enrolledClasses } from "@/data/mock-student-data";
import { allInstructorClasses } from "@/data/mock-classes-instructor";
import { useAuth } from "@saintrelion/auth-lib";

const StudentClassManagement = () => {
  const { user } = useAuth();
  const myClassesEnrolled = enrolledClasses.filter(
    (ecl) => ecl.userId == user.id,
  );

  return (
    <div className="space-y-6">
      {/* Enrolled Classes - placed below */}
      <Card className="border-muted rounded-2xl border transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <BookIcon className="text-primary h-5 w-5" />
            <CardTitle className="text-lg">Enrolled Classes</CardTitle>
          </div>
          <JoinClassButton />
        </CardHeader>
        <CardContent>
          {myClassesEnrolled.length > 0 ? (
            <ul className="text-md space-y-2">
              {myClassesEnrolled.map((ecl, idx) => {
                const classInfo = allInstructorClasses.find(
                  (c) => c.id == ecl.classId,
                );

                return (
                  <li
                    key={idx}
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

export function JoinClassButton() {
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);

  const handleJoin = () => {
    if (!code.trim()) return;
    alert("Joining class with code:" + code);
    // TODO: Call API here
    setCode("");
    setOpen(false);
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
          <Button onClick={handleJoin}>Join</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
