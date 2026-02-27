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
        const res = await fetch(`${API_URL}api/device/check/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.id }),
        });

        const data = await res.json();
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

      const response = await fetch(`${API_URL}api/otp/send/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, type: "email" }),
      });

      const data = await response.json();
      if (data.otp_id) {
        alert("OTP sent. Verify to continue.");
        setOtpId(data.otp_id);
        setShowOtpInput(true);
      }
    } catch (err) {
      console.error("OTP send failed:", err);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await fetch(`${API_URL}api/otp/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp_id: otpId, code: otpInput }),
      });

      const data = await res.json();

      if (data.success) {
        await registerFingerprint(user.id);
        await authenticateDevice();
      }
    } catch (err) {
      console.error("OTP verify failed:", err);
      toast.error("OTP rejected");
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
            <Button onClick={() => handleVerifyOTP()}>Verify OTP</Button>
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
