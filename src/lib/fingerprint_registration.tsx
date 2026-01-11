import { API_URL } from "@/data-access-config";

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

function prepareRegistrationOptions(options: any) {
  return {
    ...options,
    challenge: base64urlToBuffer(options.challenge),
    user: {
      ...options.user,
      id: base64urlToBuffer(options.user.id),
    },
    excludeCredentials: (options.excludeCredentials || []).map((cred: any) => ({
      ...cred,
      id: base64urlToBuffer(cred.id),
    })),
  };
}

export async function registerFingerprint(userId: string) {
  const token = localStorage.getItem("access");
  const beginRes = await fetch(`${API_URL}api/device/register/begin/`, {
    method: "POST",
    body: JSON.stringify({ username: userId }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
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
      attestationObject: bufferToBase64url(credentialRespose.attestationObject),
      clientDataJSON: bufferToBase64url(credentialRespose.clientDataJSON),
    },
  };

  console.log(attestationResponse);
  const finishRes = await fetch(`${API_URL}api/device/register/finish/`, {
    method: "POST",
    body: JSON.stringify({ ...attestationResponse, username: userId }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await finishRes.json();
}
