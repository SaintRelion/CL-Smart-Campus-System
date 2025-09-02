import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const StudentProfilePage = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Student Profile</h2>
          <p className="text-muted-foreground text-sm">
            Update your personal details
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Juan Dela Cruz" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input id="studentId" placeholder="2025-12345" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload">Upload School ID</Label>
            <Input id="upload" type="file" />
          </div>
          <Button className="w-full">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default StudentProfilePage;
