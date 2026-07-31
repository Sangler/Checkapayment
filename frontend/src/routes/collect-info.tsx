import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { api } from "../lib/api";

interface FormData {
  employmentStatus: string;
  jobTitle: string;
  businessName: string;
  businessType: string;
  taxIdNumber: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  dateOfBirth: string;
  email: string;
  emailOtp: string;
  phoneCountryCode: string;
  phoneNumber: string;
  phoneOtp: string;
  address: {
    street: string;
    addressLine2: string;
    postalCode: string;
    city: string;
    province: string;
    country: string;
  };
}

const initialFormData: FormData = {
  employmentStatus: "",
  jobTitle: "",
  businessName: "",
  businessType: "",
  taxIdNumber: "",
  firstName: "",
  lastName: "",
  preferredName: "",
  dateOfBirth: "",
  email: "",
  emailOtp: "",
  phoneCountryCode: "+1",
  phoneNumber: "",
  phoneOtp: "",
  address: {
    street: "",
    addressLine2: "",
    postalCode: "",
    city: "",
    province: "",
    country: "Canada",
  },
};

const steps = [
  "Business profile",
  "Personal details",
  "Address & verification",
] as const;

const employmentStatuses = [
  "Full-time",
  "Part-time",
  "Casual",
  "Retired",
  "Unemployed",
  "Self-employed",
  "Contractor",
  "Student",
  "Temporary",
  "Other",
];

const businessTypes = [
  "F&B Restaurant or Coffee Shop",
  "Service Provider Shop",
  "Technical Industry",
  "Retail Store",
  "E-commerce Business",
  "Consulting / Professional Services",
  "Healthcare / Wellness",
  "Education / Training",
  "Real Estate / Property",
  "Logistics / Transport",
  "Construction / Trades",
  "Creative / Media",
  "Non-profit / Community",
  "Government / Public Sector",
  "Other",
];
const countries = ["Canada", "United States", "United Kingdom", "Australia", "Nigeria", "Other"];

export const Route = createFileRoute("/collect-info")({
  head: () => ({
    meta: [{ title: "Collect your info — CheckAPay" }],
  }),
  // Client-side guard: SPA navigations to /collect-info are blocked here
  // before the page renders. Direct/hard navigations are caught by the
  // effect in CollectInfoPage, since beforeLoad can't read the browser's
  // HTTP-only cookie during server rendering.
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    try {
      await api.get("/auth/me");
    } catch {
      throw redirect({ to: "/register" });
    }
  },
  component: CollectInfoPage,
});

function CollectInfoPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

  // Fallback guard for the initial hard navigation (server-rendered HTML),
  // since /auth/me can only be checked once we're in the browser.
  useEffect(() => {
    let active = true;

    api
      .get("/auth/me")
      .then(() => {
        if (active) setAuthorized(true);
      })
      .catch(() => {
        if (active) navigate({ to: "/register" });
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const progress = useMemo(() => Math.round((step / 3) * 100), [step]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateAddressField = (field: keyof FormData["address"], value: string) => {
    setFormData((current) => ({
      ...current,
      address: { ...current.address, [field]: value },
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.employmentStatus || !formData.jobTitle || !formData.businessName || !formData.businessType) {
        setError("Please complete all business profile fields before continuing.");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError("First name, last name, and email are required.");
        return false;
      }

      if (!formData.emailOtp || !formData.phoneOtp) {
        setError("Please enter the email and phone verification codes to continue.");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(3, current + 1));
  };

  const handleBack = () => {
    setStep((current) => Math.max(1, current - 1));
    setError(null);
  };

  const handleSubmit = () => {
    if (!validateStep()) return;

    const payload = {
      ...formData,
      addressPreview: [
        formData.address.street,
        formData.address.city,
        formData.address.province,
        formData.address.country,
      ]
        .filter(Boolean)
        .join(", "),
    };

    window.localStorage.setItem("checkapay_collect_info_draft", JSON.stringify(payload));
    console.info("Collect-info payload", payload);
    setSubmitted(true);
  };

  const addressPreview = [
    formData.address.street,
    formData.address.city,
    formData.address.province,
    formData.address.country,
  ]
    .filter(Boolean)
    .join(", ");

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Checking your session…
        </div>
      </div>
    );
  }

  return (
    <AuthShell
      badge="PROFILE SETUP"
      title={submitted ? "Profile ready" : "Complete your profile"}
      subtitle={
        submitted
          ? "Your details have been saved locally for this session and are ready for the next backend integration step."
          : "We’ll gather the basics in three quick steps so your account is ready for invoicing and payments."
      }
    >
      <div className="space-y-6">
        {!submitted ? (
          <>
            <div className="rounded-xl border border-border bg-card/40 p-3">
              <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-widest text-muted-foreground">
                <span>Step {step} of 3</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-background">
                <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {steps.map((label, index) => {
                  const active = step === index + 1;
                  const complete = step > index + 1;
                  return (
                    <div
                      key={label}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-widest ${
                        complete ? "bg-primary/15 text-primary" : active ? "bg-accent text-foreground" : "bg-background text-muted-foreground"
                      }`}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>

            {error ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Employment status</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(event) => updateField("employmentStatus", event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Select one</option>
                    {employmentStatuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Job title</label>
                  <input
                    value={formData.jobTitle}
                    onChange={(event) => updateField("jobTitle", event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="e.g. Founder"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Business name</label>
                  <input
                    value={formData.businessName}
                    onChange={(event) => updateField("businessName", event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="Your company or shop"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Business type</label>
                  <select
                    value={formData.businessType}
                    onChange={(event) => updateField("businessType", event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Select one</option>
                    {businessTypes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tax ID number (optional)</label>
                  <input
                    value={formData.taxIdNumber}
                    onChange={(event) => updateField("taxIdNumber", event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="CRA / tax number"
                  />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First name</label>
                  <input
                    value={formData.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="John"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Last name</label>
                  <input
                    value={formData.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Preferred name</label>
                  <input
                    value={formData.preferredName}
                    onChange={(event) => updateField("preferredName", event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date of birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(event) => updateField("dateOfBirth", event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Email address</label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className="w-full bg-transparent text-sm outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={formData.emailOtp}
                      onChange={(event) => updateField("emailOtp", event.target.value)}
                      className="w-full bg-transparent text-sm outline-none"
                      placeholder="Enter email OTP"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Phone number</label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={formData.phoneCountryCode}
                      onChange={(event) => updateField("phoneCountryCode", event.target.value)}
                      className="w-20 bg-transparent text-sm outline-none"
                      placeholder="+1"
                    />
                    <input
                      value={formData.phoneNumber}
                      onChange={(event) => updateField("phoneNumber", event.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none"
                      placeholder="123 456 7890"
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={formData.phoneOtp}
                      onChange={(event) => updateField("phoneOtp", event.target.value)}
                      className="w-full bg-transparent text-sm outline-none"
                      placeholder="Enter phone OTP"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <p className="mb-2 text-sm font-medium text-foreground">Address details</p>
                  <p className="text-sm text-muted-foreground">
                    Google Maps autocomplete will be wired here later. For now the street field remains editable and the city/postal/province fields are prepared for auto-fill.
                  </p>
                </div>
                
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Country</label>
                    <select
                      value={formData.address.country}
                      onChange={(event) => updateAddressField("country", event.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    >
                      {countries.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Street address</label>
                    <input
                      value={formData.address.street}
                      onChange={(event) => updateAddressField("street", event.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Address line 2</label>
                    <input
                      value={formData.address.addressLine2}
                      onChange={(event) => updateAddressField("addressLine2", event.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      placeholder="Suite, unit, floor, etc."
                    />
                  </div>

 

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Postal code</label>
                    <input
                      value={formData.address.postalCode}
                      onChange={(event) => updateAddressField("postalCode", event.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground outline-none"
                      placeholder="Auto-filled later"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">City</label>
                    <input
                      value={formData.address.city}
                      onChange={(event) => updateAddressField("city", event.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground outline-none"
                      placeholder="Auto-filled later"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Province</label>
                    <input
                      value={formData.address.province}
                      onChange={(event) => updateAddressField("province", event.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground outline-none"
                      placeholder="Auto-filled later"
                      disabled
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-foreground">
                  <div className="font-medium">Address preview</div>
                  <div className="mt-1 text-muted-foreground">{addressPreview || "Add your street address to preview it here."}</div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={step === 3 ? handleSubmit : handleNext}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {step === 3 ? "Complete profile" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/10 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold text-foreground">Profile completed</div>
                <p className="text-sm text-muted-foreground">
                  Your details are stored in the current session and are ready for the backend integration step.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background/70 p-3 text-sm text-foreground">
              <div className="font-medium">Summary</div>
              <div className="mt-2 space-y-1 text-muted-foreground">
                <div>{formData.firstName} {formData.lastName}</div>
                <div>{formData.businessName}</div>
                <div>{addressPreview || "Address pending"}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Go to dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setFormData(initialFormData);
                  setError(null);
                }}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Start again
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
