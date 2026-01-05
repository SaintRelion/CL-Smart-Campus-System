import { logout, useAuth } from "@saintrelion/auth-lib";
// import UserMenu from "./UserMenu";
import { renderNavItems } from "@saintrelion/routers";

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, "+").replace(/_/g, "/");

  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < raw.length; i++) {
    view[i] = raw.charCodeAt(i);
  }

  return buffer;
}

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

const Navbar = () => {
  const { user } = useAuth();

  function prepareRegistrationOptions(options: any) {
    return {
      ...options,
      challenge: base64urlToBuffer(options.challenge),
      user: {
        ...options.user,
        id: base64urlToBuffer(options.user.id),
      },
      excludeCredentials: (options.excludeCredentials || []).map(
        (cred: any) => ({
          ...cred,
          id: base64urlToBuffer(cred.id),
        }),
      ),
    };
  }

  async function registerFingerprint(userId: string) {
    const beginRes = await fetch(
      "http://127.0.0.1:8000/api/device/register/begin/",
      {
        method: "POST",
        body: JSON.stringify({ username: userId }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );
    const options = await beginRes.json();
    console.log(options);

    const publicKey = prepareRegistrationOptions(options);
    const credential = (await navigator.credentials.create({
      publicKey: publicKey,
    })) as PublicKeyCredential;

    if (credential == null) return;

    const credentialRespose =
      credential.response as AuthenticatorAttestationResponse;

    const attestationResponse = {
      id: credential.id,
      rawId: bufferToBase64url(credential.rawId),
      type: credential.type,
      response: {
        attestationObject: bufferToBase64url(
          credentialRespose.attestationObject,
        ),
        clientDataJSON: bufferToBase64url(credentialRespose.clientDataJSON),
      },
    };

    console.log(attestationResponse);
    const finishRes = await fetch(
      "http://127.0.0.1:8000/api/device/register/finish/",
      {
        method: "POST",
        body: JSON.stringify({ ...attestationResponse, username: userId }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );

    return await finishRes.json();
  }

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3 shadow-sm">
      <div
        onClick={() => {
          registerFingerprint(user.id);
        }}
        className="text-primary text-xl font-semibold"
      >
        ClassTrack
      </div>
      <div className="flex items-center gap-4">
        {renderNavItems({
          role: user.role ?? "",
          baseClassName:
            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all text-muted-foreground hover:bg-blue-100 hover:text-primary",
          activeClassName:
            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all bg-blue-600 text-white pointer-events-none",
        })}
        {/* <UserMenu /> */}
        <button
          onClick={() => {
            logout(() => {
              window.location.href = "/login";
            });
          }}
          className="cursor-pointer items-center gap-2 bg-red-300 px-4 py-2 text-left text-sm hover:bg-red-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
