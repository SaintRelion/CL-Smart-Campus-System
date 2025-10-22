import { firebaseLoginWithOtherInfo, useAuth } from "@saintrelion/auth-lib";
import { useNavigate } from "react-router-dom";
import { buildFieldsFromModel } from "../to-be-library/forms/lib/helper";
import RenderForm from "../to-be-library/forms/render-form";
import { RenderFormFields } from "../to-be-library/forms/render-form-fields";
import { RenderFormButton } from "../to-be-library/forms/render-form-button";
import { RenderCard } from "@saintrelion/ui";

const authenticateFields = buildFieldsFromModel({
  employeeID: { type: "text", label: "ID" },
});

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
    <div className="flex h-screen w-full items-center justify-center bg-blue-100">
      <RenderCard
        headerTitle="Login"
        headerClass="text-center text-2xl font-bold"
        wrapperClass=" w-full max-w-md "
        flat={true}
      >
        <RenderForm wrapperClass="space-y-5 flex flex-col items-center">
          <RenderFormFields
            fields={authenticateFields}
            wrapperClass="flex flex-col gap-1"
          />

          <RenderFormButton
            buttonLabel="Login"
            buttonClass="bg-blue-400 hover:bg-blue-500"
            onSubmit={handleLogin}
          />
        </RenderForm>
      </RenderCard>
    </div>
  );
};
export default LoginPage;
