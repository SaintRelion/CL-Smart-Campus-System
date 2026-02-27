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

function prepareAuthenticationOptions(options: any) {
  return {
    ...options,
    challenge: base64urlToBuffer(options.challenge),
    allowCredentials: (options.allowCredentials || []).map((cred: any) => ({
      ...cred,
      id: base64urlToBuffer(cred.id),
    })),
  };
}

export async function authenticateFingerprint(userId: string) {
  const token = localStorage.getItem("access");

  const optionsRes = await fetch(`${API_URL}api/device/login/begin/`, {
    method: "POST",
    body: JSON.stringify({ username: userId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const options = await optionsRes.json();

  const publicKey = prepareAuthenticationOptions(options);
  const assertion = (await navigator.credentials.get({
    publicKey: publicKey,
  })) as PublicKeyCredential;

  const res = assertion.response as AuthenticatorAssertionResponse;

  const authResponse = {
    id: assertion.id,
    rawId: bufferToBase64url(assertion.rawId),
    type: assertion.type,
    response: {
      authenticatorData: bufferToBase64url(res.authenticatorData),
      clientDataJSON: bufferToBase64url(res.clientDataJSON),
      signature: bufferToBase64url(res.signature),
      userHandle: res.userHandle ? bufferToBase64url(res.userHandle) : null,
    },
  };

  console.log(authResponse);
  const verifyRes = await fetch(`${API_URL}api/device/login/finish/`, {
    method: "POST",
    body: JSON.stringify(authResponse),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await verifyRes.json();
}
