import { useState } from "react";
import { API_URL } from "@/data-access-config";
import { Department } from "@/model-types/department";
import { apiRequest } from "@saintrelion/api-functions";
import { useRegisterUser } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";

/**
 * TEMPORARY FIRST-ADMIN BOOTSTRAP PAGE
 *
 * Use only for a fresh/restored SmartCampus installation with no administrator.
 * Remove this page and its public route after the first admin is created.
 *
 * This intentionally follows the same two-step registration flow already used by
 * InstructorRegistrationPage:
 *   1. Create the application User through the SaintRelion auth/data provider.
 *   2. Create the matching Django auth account using the returned user.id.
 *
 * Fingerprint/WebAuthn enrollment is NOT bypassed here. After creation, sign in
 * normally at /login. RootLayout will detect that the account has no registered
 * security method and will run the existing OTP -> fingerprint registration flow.
 */
export default function SetupAdmin() {
  const registerUser = useRegisterUser();
  const [message, setMessage] = useState<string | null>(null);
  const [createdEmployeeId, setCreatedEmployeeId] = useState<string | null>(
    null,
  );

  const handleRegister = async (data: Record<string, string>) => {
    setMessage(null);
    setCreatedEmployeeId(null);

    try {
      const user = await registerUser.run({
        info: {
          email: data.email,
          employeeId: data.employeeId,
          name: data.name,
          department: data.department,
          role: "admin",
          isEnabled: true,
        },
        password: data.employeeId,
        uniqueFields: ["employeeId"],
      });

      if (!user) {
        setMessage(
          "Admin creation failed before the Django account was created.",
        );
        return;
      }

      await apiRequest(`${API_URL}api/auth/register/`, {
        username: user.id,
        employeeId: data.employeeId,
        email: data.email,
        password: "default",
      });

      setCreatedEmployeeId(data.employeeId);
      setMessage(
        "Administrator created. Sign in with the Employee ID below, then complete the existing OTP and fingerprint security setup.",
      );
    } catch (error) {
      console.error("Admin bootstrap failed:", error);
      setMessage(
        error instanceof Error ? error.message : "Administrator creation failed.",
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F8F8] p-6">
      <div className="w-full max-w-lg rounded-sm border border-slate-300 bg-white p-8 shadow-sm">
        <div className="mb-8 border-b border-slate-200 pb-5">
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-amber-600">
            Temporary Setup Utility
          </p>
          <h1 className="text-2xl font-black tracking-tight">
            Create First Administrator
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Remove this page and its route after the first administrator has
            been created.
          </p>
        </div>

        <RenderForm wrapperClassName="space-y-5">
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

          {message && (
            <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              <p>{message}</p>
              {createdEmployeeId && (
                <p className="mt-2 font-bold">
                  Employee ID: {createdEmployeeId}
                </p>
              )}
            </div>
          )}

          <RenderFormButton
            buttonLabel="Create Administrator"
            isDisabled={registerUser.isLocked}
            onSubmit={handleRegister}
          />
        </RenderForm>

        {createdEmployeeId && (
          <a
            href="/login"
            className="mt-4 block text-center text-sm font-semibold underline"
          >
            Continue to Login
          </a>
        )}
      </div>
    </main>
  );
}
