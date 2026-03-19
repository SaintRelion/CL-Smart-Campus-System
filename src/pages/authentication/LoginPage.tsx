import { API_URL } from "@/data-access-config";
import { apiRequest } from "@saintrelion/api-functions";
import { useAuth, useLoginWithCredentials } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";
import { useState } from "react";
import { ShieldCheck, User } from "lucide-react";

const LoginPage = () => {
  const { setUser } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const loginWithCredentials = useLoginWithCredentials();

  const handleLogin = async (data: Record<string, string>) => {
    try {
      setIsLoggingIn(true);
      const login = await apiRequest(`${API_URL}api/auth/token/`, {
        username: data.employeeId,
        password: "default",
      });

      if (!login?.access) {
        toast.error("ACCESS DENIED: INVALID ID");
        setIsLoggingIn(false);
        return;
      }

      localStorage.setItem("access", login.access);

      await loginWithCredentials.run(
        "employeeId",
        data.employeeId,
        data.employeeId,
        setUser,
      );

      toast.success("IDENTITY VERIFIED");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("SYSTEM ERROR: AUTH FAILED");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F8F8F8] p-6 selection:bg-black selection:text-white">
      <div className="w-full max-w-[380px] space-y-4">
        {/* TOP BRANDING: SHARP & MINIMAL */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} strokeWidth={2.5} className="text-black" />
            <h1 className="text-lg font-black tracking-tighter text-black uppercase">
              SMART <span className="font-bold text-slate-400">CAMPUS</span>
            </h1>
          </div>
        </div>

        {/* LOGIN TERMINAL: PRECISION EDGES */}
        <div className="rounded-sm border border-slate-300 bg-white p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
          <RenderForm wrapperClassName="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black tracking-[0.3em] text-black uppercase">
                  Authorized Personnel ID
                </label>
              </div>

              <div className="group relative">
                {/* ICON: Precision Centering */}
                <div className="absolute top-1/2 left-4 z-20 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-black">
                  <User size={16} strokeWidth={2.5} />
                </div>

                <RenderFormField
                  field={{
                    type: "text",
                    name: "employeeId",
                    placeholder: "00-0000-00",
                  }}
                  inputClassName="w-full rounded-sm border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-black tracking-widest transition-all placeholder:text-slate-300 focus:border-black focus:bg-white focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <RenderFormButton
              buttonClassName="group relative flex w-full items-center justify-center overflow-hidden rounded-sm bg-black py-4 text-[10px] font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-slate-800 active:bg-black disabled:bg-slate-100 disabled:text-slate-300"
              isDisabled={isLoggingIn}
              onSubmit={handleLogin}
              buttonLabel={"Log In"}
            />
          </RenderForm>
        </div>

        {/* FOOTER: SYSTEM STATUS */}
        <div className="flex items-center justify-between px-1">
          <div className="flex gap-1">
            <div className="h-1 w-1 bg-black" />
            <div className="h-1 w-4 bg-emerald-500" />
          </div>
          <p className="text-[7px] font-black tracking-[0.5em] text-slate-300 uppercase">
            Awaiting Identity Verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
