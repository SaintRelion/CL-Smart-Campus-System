import { firebaseLoginWithOtherInfo, useAuth } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: Record<string, string>) => {
    // Normally you'd call API here, then save returned user
    console.log("Raw submission:", data);

    await firebaseLoginWithOtherInfo(
      "employeeID",
      data.employeeID,
      data.employeeID,
      setUser,
      (loggedInUser) => {
        navigate("/");

        console.log(loggedInUser.createdAt);
      },
    );
  };

  return (
    <div className="h-screen w-full bg-blue-100">
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <h1 className="text-center text-2xl font-bold">Login</h1>
        <RenderForm
          wrapperClass="flex flex-col items-center space-y-2"
          onSubmit={handleLogin}
        >
          <RenderFormField
            field={{
              type: "text",
              name: "employeeID",
              placeholder: "ID",
            }}
            inputClassName="rounded-md border border-gray-400 py-1 pl-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />

          <RenderFormButton
            buttonClass="bg-blue-400 hover:bg-blue-500"
            buttonLabel="Login"
          />
        </RenderForm>
      </div>
    </div>
  );
};
export default LoginPage;
