import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function InstructorProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Instructor Profile</h2>
          <p className="text-muted-foreground text-sm">
            Update your contact & availability
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Prof. Maria Santos" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Info</Label>
            <Input id="contact" placeholder="prof.santos@univ.edu" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Office Hours</Label>
            <Input id="hours" placeholder="MWF 10:00AM - 12:00NN" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Profile Photo</Label>
            <Input id="photo" type="file" />
          </div>
          <Button className="w-full">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
