import { registerUser } from "@saintrelion/auth-lib";
import RenderForm from "../to-be-library/forms/render-form";
import { RenderFormButton } from "../to-be-library/forms/render-form-button";
import { RenderFormFields } from "../to-be-library/forms/render-form-fields";
import { buildFieldsFromModel } from "../to-be-library/forms/lib/helper";
import { Department } from "@/model-types/department";
import type { ColumnDef } from "@tanstack/react-table";
import { useDBOperations } from "@saintrelion/data-access-layer";
import type { User } from "@/models/user";
import { UserRole } from "@/model-types/userrole";
import { RenderCard, RenderDialog, RenderTable } from "@saintrelion/ui";

// --- build your fields dynamically ---
const personalInfoFields = buildFieldsFromModel({
  employeeID: { type: "text", label: "Employee ID", minLength: 6 },
  name: { type: "text", label: "Full Name" },
  email: { type: "email", label: "Email" },
  department: { type: "select", options: Department, label: "Department" },
  role: { type: "select", options: UserRole, label: "Role" },
});

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
        <RenderDialog
          triggerLabel="Register Instructor"
          headerTitle="Create Account"
          description="Fill out the form to register an instructor."
        >
          <RenderForm wrapperClass="space-y-6">
            <RenderFormFields fields={personalInfoFields} />
            <RenderFormButton
              buttonLabel="Register"
              onSubmit={handleRegister}
            />
          </RenderForm>
        </RenderDialog>
      </div>

      {/* Table occupies full remaining space */}
      <RenderCard>
        <RenderTable
          data={instructorRows}
          columns={columns}
          hiddenColumns={["id"]}
          filters={["name", "department"]}
        />
      </RenderCard>
    </div>
  );
};

export default InstructorRegistrationPage;
