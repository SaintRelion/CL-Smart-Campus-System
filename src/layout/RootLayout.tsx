import Navbar from "@/components/Navbar";
import { API_URL } from "@/data-access-config";
import { logout, useAuth } from "@saintrelion/auth-lib";
import { useIsPathPublic } from "@saintrelion/routers";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { registerFingerprint } from "@/lib/fingerprint_registration";
import { authenticateFingerprint } from "@/lib/fingerprint_authentication";
import { Button } from "@/components/ui/button";
import { toast } from "@saintrelion/notifications";
import { apiRequest } from "@saintrelion/api-functions";

const RootLayout = () => {
  const { user } = useAuth();
  const isPathPublic = useIsPathPublic();

  const [checkingAccountSecurity, setCheckingAccountSecurity] = useState(true);
  const [accountSecured, setAccountSecured] = useState(false);

  const [deviceAuthenticated, setDeviceAuthenticated] = useState(false);
  const [deviceAuthenticationFailed, setDeviceAuthenticationFailed] =
    useState(false);

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpId, setOtpId] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSending, setOtpSending] = useState(false);

  useEffect(() => {
    if (isPathPublic != "") return;

    const checkAccountSecurity = async () => {
      try {
        const data = await apiRequest(
          `${API_URL}api/device/check/`,
          {
            username: user.id,
          },
          { auth: false },
        );

        setAccountSecured(data.registered);

        if (data.registered) authenticateDevice();
      } catch (err) {
        console.error("Device check failed:", err);
      } finally {
        setCheckingAccountSecurity(false);
      }
    };

    checkAccountSecurity();
  }, []);

  const authenticateDevice = async () => {
    try {
      const result = await authenticateFingerprint(user.id);
      setDeviceAuthenticated(result.status);
      setAccountSecured(true);
      setDeviceAuthenticationFailed(false);

      return true;
    } catch (err) {
      setDeviceAuthenticationFailed(true);
      console.error("Device authentication failed:", err);

      return false;
    }
  };

  const handleSendOTP = async () => {
    try {
      setOtpSending(true);
      console.log(user);

      const data = await apiRequest(
        `${API_URL}api/otp/send/`,
        {
          email: user.email,
          password: "default",
          otp_type: "email",
        },
        { auth: false },
      );

      if (data.otp_id) {
        alert("OTP sent. Verify to continue.");
        setOtpId(data.otp_id);
        setShowOtpInput(true);

        setOtpSending(false);
      }
    } catch (err) {
      console.error("OTP send failed:", err);

      setOtpSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    let data = null;
    try {
      setOtpSending(true);
      data = await apiRequest(
        `${API_URL}api/otp/verify/`,
        {
          otp_id: otpId,
          code: otpInput,
        },
        { auth: false },
      );
      console.log(data);
    } catch (err) {
      console.error("OTP verify failed:", err);
      setOtpSending(false);
    }

    try {
      if (data != null && data.success) {
        await registerFingerprint(user.id);
        logout(async () => {
          window.location.href = "/login";
        });
      }

      setOtpSending(false);
    } catch {
      toast.error("Failed to register fingerprint");
      setOtpSending(false);
    }
  };

  if (isPathPublic != "") {
    return <Outlet />;
  }

  if (checkingAccountSecurity) {
    return (
      <div className="flex min-h-lvh items-center justify-center">
        Checking device...
      </div>
    );
  }

  if (deviceAuthenticationFailed) {
    return (
      <div className="flex min-h-lvh flex-col items-center justify-center space-y-2">
        <div>Failed To Authenticate</div>

        <div className="flex gap-2">
          <Button
            onClick={() => authenticateDevice()}
            className="cursor-pointer rounded border px-3 text-xs"
          >
            Retry
          </Button>
          <Button
            onClick={() =>
              logout(() => {
                window.location.href = "/login";
              })
            }
            variant="ghost"
            className="cursor-pointer rounded border px-3 text-xs"
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  if (accountSecured && !deviceAuthenticated) {
    return (
      <div className="flex min-h-lvh items-center justify-center">
        Authenticating device...
      </div>
    );
  }

  if (!accountSecured) {
    return (
      <div className="flex min-h-lvh flex-col items-center justify-center gap-4">
        <div className="space-y-1">
          <h2 className="text-center text-xl font-semibold">
            No Security Method Registered
          </h2>
          <p>
            Please register a security method to secure your account and enable
            device login.
          </p>
        </div>

        {!showOtpInput ? (
          <>
            <Button
              onClick={() => handleSendOTP()}
              disabled={otpSending}
              className="cursor-pointer rounded bg-black px-4 py-2 text-white"
            >
              Secure This Account
            </Button>

            <Button
              onClick={() =>
                logout(() => {
                  window.location.href = "/login";
                })
              }
              disabled={otpSending}
              variant="ghost"
              className="text-red cursor-pointer rounded border px-3 text-xs"
            >
              Log Out
            </Button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="border p-2"
            />
            <Button onClick={() => handleVerifyOTP()} disabled={otpSending}>
              Verify OTP
            </Button>
          </>
        )}
      </div>
    );
  }

  // Device registered → normal app
  return (
    <div className="min-h-lvh bg-black/2">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default RootLayout;
