import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type AuthenticatorTransportFuture,
  type RegistrationResponseJSON,
  type WebAuthnCredential,
} from "@simplewebauthn/server";

/**
 * Thin wrapper around @simplewebauthn/server so authController-style route
 * handlers don't need to know the library's exact option shapes. Challenges
 * are stored/verified by the caller (webauthnController.ts) via the existing
 * authStore temp-value store - this module is pure crypto/verification logic.
 */

function getRpName() {
  return process.env.WEBAUTHN_RP_NAME || "CheckAPay";
}

function getRpId() {
  return process.env.WEBAUTHN_RP_ID || "localhost";
}

function getOrigin() {
  return process.env.WEBAUTHN_ORIGIN || "http://localhost:8080";
}

export function userIdToUserHandle(userId: number): Uint8Array<ArrayBuffer> {
  const encoded = new TextEncoder().encode(String(userId));
  const buffer = new ArrayBuffer(encoded.length);
  new Uint8Array(buffer).set(encoded);
  return new Uint8Array(buffer);
}

function parseTransports(transports: string | null | undefined): AuthenticatorTransportFuture[] | undefined {
  if (!transports) return undefined;
  return transports.split(",").filter(Boolean) as AuthenticatorTransportFuture[];
}

export async function buildRegistrationOptions(params: {
  userId: number;
  email: string;
  displayName: string;
  existingCredentials: { credentialId: string; transports: string | null }[];
}) {
  return generateRegistrationOptions({
    rpName: getRpName(),
    rpID: getRpId(),
    userName: params.email,
    userID: userIdToUserHandle(params.userId),
    userDisplayName: params.displayName,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
    excludeCredentials: params.existingCredentials.map((cred) => ({
      id: cred.credentialId,
      transports: parseTransports(cred.transports),
    })),
  });
}

export async function verifyRegistration(params: {
  response: RegistrationResponseJSON;
  expectedChallenge: string;
}) {
  return verifyRegistrationResponse({
    response: params.response,
    expectedChallenge: params.expectedChallenge,
    expectedOrigin: getOrigin(),
    expectedRPID: getRpId(),
  });
}

export async function buildAuthenticationOptions(params: {
  allowCredentials: { credentialId: string; transports: string | null }[];
}) {
  return generateAuthenticationOptions({
    rpID: getRpId(),
    userVerification: "preferred",
    allowCredentials:
      params.allowCredentials.length > 0
        ? params.allowCredentials.map((cred) => ({
            id: cred.credentialId,
            transports: parseTransports(cred.transports),
          }))
        : undefined,
  });
}

export async function verifyAuthentication(params: {
  response: AuthenticationResponseJSON;
  expectedChallenge: string;
  storedCredential: { credentialId: string; publicKey: string; counter: number; transports: string | null };
}) {
  const credential: WebAuthnCredential = {
    id: params.storedCredential.credentialId,
    publicKey: new Uint8Array(Buffer.from(params.storedCredential.publicKey, "base64url")),
    counter: params.storedCredential.counter,
    transports: parseTransports(params.storedCredential.transports),
  };

  return verifyAuthenticationResponse({
    response: params.response,
    expectedChallenge: params.expectedChallenge,
    expectedOrigin: getOrigin(),
    expectedRPID: getRpId(),
    credential,
  });
}
