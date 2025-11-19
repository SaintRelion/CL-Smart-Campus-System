import { registerUser } from "@saintrelion/auth-lib";
import { Department } from "@/model-types/department";
import type { ColumnDef } from "@tanstack/react-table";
import { useDBOperations } from "@saintrelion/data-access-layer";
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

interface InstructorRow {
  id: string;
  employeeID: string;
  name: string;
  email: string;
  department: string;
}

const columns: ColumnDef<InstructorRow>[] = [
  { header: "Employee ID", accessorKey: "employeeID" },
  { header: "Name", accessorKey: "name" },
  { header: "Email", accessorKey: "email" },
  { header: "Department", accessorKey: "department" },
  { header: "Role", accessorKey: "role" },
];

const InstructorRegistrationPage = () => {
  const { useSelect: usersSelect } = useDBOperations<User>("User");
  const { data: users = [] } = usersSelect({
    firebaseOptions: {
      filterField: "role",
      value: "instructor",
      realtime: true,
    },
  });

  const instructorRows: InstructorRow[] = users.map((user) => ({
    id: user.id,
    employeeID: user.employeeID ?? "—",
    name: user.name ?? "—",
    email: user.email ?? "—",
    department: user.department ?? "—",
    role: user.role,
  }));

  const handleRegister = (data: Record<string, string>) => {
    registerUser(data.email, data.employeeID, {
      employeeID: data.employeeID,
      name: data.name,
      department: data.department,
      role: data.role,
    });
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 p-8">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Instructor Management</h1>

        {/* Add Instructor Button (opens form dialog) */}
        <Dialog>
          <DialogTrigger>Register Instructor</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Account</DialogTitle>
              <DialogDescription>
                Fill out the form to register an instructor.
              </DialogDescription>
            </DialogHeader>
            <RenderForm wrapperClass="space-y-6" onSubmit={handleRegister}>
              <RenderFormField
                field={{
                  label: "Employee ID",
                  type: "text",
                  name: "employee_id",
                  minLength: 6,
                }}
              />
              <RenderFormField
                field={{ label: "Full Name", type: "text", name: "name" }}
              />
              <RenderFormField
                field={{ label: "Email", type: "email", name: "email" }}
              />
              <RenderFormField
                field={{
                  label: "Department",
                  type: "select",
                  name: "department",
                  options: Department,
                }}
              />
              <RenderFormField
                field={{
                  label: "Role",
                  type: "select",
                  name: "role",
                  options: UserRole,
                }}
              />
              <RenderFormButton buttonLabel="Register" />
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
