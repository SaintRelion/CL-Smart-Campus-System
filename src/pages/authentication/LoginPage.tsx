import { API_URL } from "@/data-access-config";
import { useAuth, useLoginWithCredentials } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";
import { useState } from "react";

const LoginPage = () => {
  const { setUser } = useAuth();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const loginWithCredentials = useLoginWithCredentials();

  const handleLogin = async (data: Record<string, string>) => {
    try {
      setIsLoggingIn(true);
      const login = await fetch(`${API_URL}api/auth/token/`, {
        method: "POST",
        body: JSON.stringify({
          username: data.employeeId,
          password: "default",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const loginRes = await login.json();
      if (!loginRes.access) {
        toast.warning("No id found");
        return;
      }

      localStorage.setItem("access", loginRes.access);

      await loginWithCredentials.run(
        "employeeId",
        data.employeeId,
        data.employeeId,
        setUser,
      );

      setIsLoggingIn(false);
    } catch {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="h-screen w-full bg-blue-100">
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <h1 className="text-center text-2xl font-bold">Login</h1>
        <RenderForm wrapperClassName="flex flex-col items-center space-y-2">
          <RenderFormField
            field={{
              type: "text",
              name: "employeeId",
              placeholder: "ID",
            }}
            inputClassName="rounded-md border border-gray-400 py-1 pl-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />

          <RenderFormButton
            buttonClassName="bg-blue-400 hover:bg-blue-500"
            buttonLabel="Login"
            isDisabled={isLoggingIn}
            onSubmit={handleLogin}
          />
        </RenderForm>
      </div>
    </div>
  );
};
export default LoginPage;
