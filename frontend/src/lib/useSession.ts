import { useEffect, useState } from "react";
import { api } from "./api";

export interface SessionUser {
  id?: number | string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: { countryCode?: string; phoneNumber?: string } | string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  KYCStatus?: string;
  referralCode?: string;
  points?: number;
  createdAt?: string;
  dateOfBirth?: string | null;
  isBusinessAccount?: boolean;
  employmentStatus?: string | null;
  jobTitle?: string | null;
  businessName?: string | null;
  businessType?: string | null;
  address?: {
    street?: string | null;
    addressLine2?: string | null;
    postalCode?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
  };
}

export type SessionState = "loading" | "authenticated" | "guest" | "error";

const REQUIRED_ADDRESS_FIELDS = ["street", "postalCode", "city", "province", "country"] as const;

/**
 * Mirrors the backend's collect-info requirements: email/phone verification
 * and date of birth are always required, then business vs. personal accounts
 * each need their own set of profile + address fields.
 */
export function isProfileComplete(user: SessionUser | null): boolean {
  if (!user) return false;

  if (!user.emailVerified || !user.phoneVerified || !user.dateOfBirth) {
    return false;
  }

  const address = user.address ?? {};
  const hasAddress = REQUIRED_ADDRESS_FIELDS.every((field) => Boolean(address[field]));

  if (user.isBusinessAccount) {
    return Boolean(user.jobTitle && user.businessName && user.businessType) && hasAddress;
  }

  return Boolean(user.employmentStatus && user.jobTitle) && hasAddress;
}

/**
 * Loads the current session from `/auth/me`.
 *
 * NOTE: There is no route-level auth middleware yet, so an unauthenticated
 * response is treated as a "guest" state instead of a hard redirect — pages
 * using this hook must render sensibly for both signed-in users and guests.
 */
export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [state, setState] = useState<SessionState>("loading");

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await api.get("/auth/me");
        if (!active) return;
        setUser(response.data?.user ?? response.data ?? {});
        setState("authenticated");
      } catch (error: unknown) {
        if (!active) return;
        const status =
          error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object"
            ? (error.response as { status?: number }).status
            : undefined;

        setUser(null);
        setState(status === 401 || status === 403 ? "guest" : "error");
      }
    }

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  return { user, state };
}
