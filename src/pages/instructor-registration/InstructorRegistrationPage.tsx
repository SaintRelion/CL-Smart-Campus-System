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
import { Trash2 } from "lucide-react";

interface InstructorRow {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  isEnabled: boolean;
}

const InstructorRegistrationPage = () => {
  const columns: ColumnDef<InstructorRow>[] = [
    { header: "Employee ID", accessorKey: "employeeId" },
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Department", accessorKey: "department" },
    { header: "Role", accessorKey: "role" },

    {
      header: "Status",
      accessorKey: "isEnabled",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <span
            className={`rounded py-1 text-xs font-medium ${
              user.isEnabled ? "text-green-700" : "text-red-400"
            }`}
          >
            {user.isEnabled ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 text-xs"
              variant={user.isEnabled ? "secondary" : "default"}
              onClick={() => toggleInstructorStatus(user.id, user.isEnabled)}
            >
              {user.isEnabled ? "Disable" : "Enable"}
            </Button>

            <Trash2
              size={15}
              className="cursor-pointer text-red-700"
              onClick={() => deleteInstructor(user.id)}
            />
          </div>
        );
      },
    },
  ];

  const {
    useSelect: usersSelect,
    useUpdate: userUpdate,
    useDelete: userDelete,
  } = useDBOperationsLocked<User>("User");
  const { data: users = [] } = usersSelect({});
  const filteredUsers = users.filter((u) => u.role != "admin");

  const instructorRows: InstructorRow[] = filteredUsers.map((user) => ({
    id: user.id,
    employeeId: user.employeeId ?? "—",
    name: user.name ?? "—",
    email: user.email ?? "—",
    department: user.department ?? "—",
    role: UserRole[user.role],
    isEnabled: user.isEnabled ?? true,
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
        isEnabled: true,
      },
      password: data.employeeId,
      uniqueFields: ["employeeId"],
    });
  };

  const toggleInstructorStatus = (id: string, status: boolean) => {
    console.log("Toggle instructor status:", id);

    userUpdate.run({
      field: "id",
      value: id,
      updates: {
        isEnabled: !status,
      },
    });
  };

  const deleteInstructor = (id: string) => {
    console.log("Delete instructor:", id);

    userDelete.run(id);
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
            <RenderForm wrapperClassName="space-y-6">
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
