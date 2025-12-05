import { useRegisterUser } from "@saintrelion/auth-lib";
import { Department } from "@/model-types/department";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/models/user";
import { UserRole } from "@/model-types/userrole";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { RenderTable } from "@saintrelion/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";

interface InstructorRow {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
}

const columns: ColumnDef<InstructorRow>[] = [
  { header: "Employee ID", accessorKey: "employeeId" },
  { header: "Name", accessorKey: "name" },
  { header: "Email", accessorKey: "email" },
  { header: "Department", accessorKey: "department" },
  { header: "Role", accessorKey: "role" },
];

const InstructorRegistrationPage = () => {
  const { useSelect: usersSelect } = useDBOperationsLocked<User>("User");
  const { data: users = [] } = usersSelect({
    firebaseOptions: {
      filterField: "role",
      value: "instructor",
      realtime: true,
    },
  });

  const instructorRows: InstructorRow[] = users.map((user) => ({
    id: user.id,
    employeeId: user.employeeId ?? "—",
    name: user.name ?? "—",
    email: user.email ?? "—",
    department: user.department ?? "—",
    role: user.role,
  }));

  const registerUser = useRegisterUser();

  const handleRegister = (data: Record<string, string>) => {
    registerUser.run({
      info: {
        email: data.email,
        employeeId: data.employeeId,
        name: data.name,
        department: data.department,
        role: data.role,
      },
      password: data.employeeID,
    });
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 p-8">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Instructor Management</h1>

        {/* Add Instructor Button (opens form dialog) */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Register Instructor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Account</DialogTitle>
              <DialogDescription>
                Fill out the form to register an instructor.
              </DialogDescription>
            </DialogHeader>
            <RenderForm wrapperClass="space-y-6">
              <RenderFormField
                field={{
                  label: "Employee ID",
                  type: "text",
                  name: "employeeId",
                  minLength: 6,
                }}
                wrapperClassName="flex flex-col"
                labelClassName="mb-1"
              />
              <RenderFormField
                field={{ label: "Full Name", type: "text", name: "name" }}
                wrapperClassName="flex flex-col"
                labelClassName="mb-1"
              />
              <RenderFormField
                field={{ label: "Email", type: "email", name: "email" }}
                wrapperClassName="flex flex-col"
                labelClassName="mb-1"
              />
              <RenderFormField
                field={{
                  label: "Department",
                  type: "select",
                  name: "department",
                  options: Department,
                }}
                wrapperClassName="flex flex-col"
                labelClassName="mb-1"
              />
              <RenderFormField
                field={{
                  label: "Role",
                  type: "select",
                  name: "role",
                  options: UserRole,
                }}
                wrapperClassName="flex flex-col"
                labelClassName="mb-1"
              />
              <RenderFormButton
                buttonLabel="Register"
                isDisabled={registerUser.isLocked}
                onSubmit={handleRegister}
              />
            </RenderForm>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table occupies full remaining space */}
      <RenderTable
        data={instructorRows}
        columns={columns}
        hiddenColumns={["id"]}
        filters={["name", "department"]}
      />
    </div>
  );
};

export default InstructorRegistrationPage;
