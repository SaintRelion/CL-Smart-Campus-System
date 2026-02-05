import { API_URL } from "@/data-access-config";
import { registerFingerprint } from "@/lib/fingerprint_registration";
import { useAuth, useLoginWithCredentials } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const loginWithCredentials = useLoginWithCredentials();

  async function djangoAuth(userId: string) {
    await fetch(`${API_URL}api/auth/register/`, {
      method: "POST",
      body: JSON.stringify({ username: userId, password: "default" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const device = await fetch(`${API_URL}api/device/check/`, {
      method: "POST",
      body: JSON.stringify({ username: userId, password: "default" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const login = await fetch(`${API_URL}api/auth/token/`, {
      method: "POST",
      body: JSON.stringify({ username: userId, password: "default" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { access } = await login.json();
    localStorage.setItem("access", access);

    const { registered } = await device.json();
    if (!registered) registerFingerprint(userId);

    navigate("/");
  }

  const handleLogin = async (data: Record<string, string>) => {
    await loginWithCredentials.run(
      "employeeId",
      data.employeeId,
      data.employeeId,
      setUser,
      (user) => {
        djangoAuth(user.id);
      },
    );
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
            isDisabled={loginWithCredentials.isLocked}
            onSubmit={handleLogin}
          />
        </RenderForm>
      </div>
    </div>
  );
};
export default LoginPage;
