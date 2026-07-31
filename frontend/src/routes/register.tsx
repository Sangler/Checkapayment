import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { AuthShell } from "../components/AuthShell";
import { Modal } from "../components/ui/Modal";
import { api } from "../lib/api";

type AccountType = "business" | "personal";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  volume: string;
  accountType: AccountType;
};

const initialFormData: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  volume: "< $250k",
  accountType: "business",
};

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Get started — CheckAPay" },
      {
        name: "description",
        content:
          "Start using CheckAPay to send simple bills, collect stablecoin, and cash out to CAD for your business.",
      },
      { property: "og:title", content: "Request access — CheckAPay Terminal" },
      {
        property: "og:description",
        content:
          "Provision your organization on the CheckAPay payment splitter. Stablecoin, ETH, and BTC settlement in minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>(initialFormData);
  const [step, setStep] = useState(1);
  const [feeModal, setFeeModal] = useState<AccountType | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  const handleChange = (field: keyof Omit<FormState, "accountType">) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAccountTypeSelect = (accountType: AccountType) => {
    setFormData((prev) => ({ ...prev, accountType, email: "", password: "", confirmPassword: "" }));
    setStep(2);
    setStatus({ type: "idle", message: "" });
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setStatus({ type: "error", message: "Please fill in your first and last name." });
      return false;
    }

    if (formData.accountType === "business") {
      const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailFormatRegex.test(formData.email)) {
        setStatus({ type: "error", message: "Please enter a valid email address." });
        return false;
      }

      const emailDomain = formData.email.split("@")[1]?.toLowerCase() ?? "";
      const freeEmailDomains = [
        "gmail.com",
        "googlemail.com",
        "hotmail.com",
        "outlook.com",
        "live.com",
        "msn.com",
        "yahoo.com",
        "ymail.com",
        "aol.com",
        "icloud.com",
        "me.com",
        "mac.com",
        "protonmail.com",
        "proton.me",
        "gmx.com",
        "zoho.com",
        "mail.com",
        "yandex.com",
      ];
      if (freeEmailDomains.includes(emailDomain)) {
        setStatus({ type: "error", message: "Business accounts must use a company email address, not a personal email provider." });
        return false;
      }
    }

    if (formData.password.length < 12) {
      setStatus({ type: "error", message: "Password must be at least 12 characters long." });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword: _confirmPassword, ...payload } = formData;
      const response = await api.post("/auth/register", payload);
      setStatus({ type: "success", message: response.data.message });
      navigate({ to: "/collect-info" });
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response
          ? (error.response as { data?: { error?: string } }).data?.error || "Unable to complete registration right now."
          : "Unable to complete registration right now.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <AuthShell
      badge="ONBOARDING // KYB TIER 1"
      title={
        <>
          Get started with <span className="text-primary">simple billing</span>.
        </>
      }
      subtitle="Create bills, send QR payments, and start collecting stablecoin for your business."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-sm font-medium text-foreground">Choose your account type</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick the experience that best fits your needs.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-primary/10">
                <button
                  type="button"
                  onClick={() => handleAccountTypeSelect("business")}
                  className="w-full text-left"
                >
                  <div className="font-semibold text-foreground">Create Business Account</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Get a better rate for bills, finances, and invoicing at work.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setFeeModal("business");
                  }}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="View business fee details"
                >
                  <Info className="h-3.5 w-3.5" />
                  Fee details
                </button>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-primary/10">
                <button
                  type="button"
                  onClick={() => handleAccountTypeSelect("personal")}
                  className="w-full text-left"
                >
                  <div className="font-semibold text-foreground">Create Personal Account</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    For individual use and personal payments.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setFeeModal("personal");
                  }}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="View personal fee details"
                >
                  <Info className="h-3.5 w-3.5" />
                  Fee details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card/50 px-3 py-2">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {formData.accountType === "business" ? "Business account" : "Personal account"}
                </div>
                <div className="text-sm font-medium text-foreground">Create your secure access</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setStatus({ type: "idle", message: "" });
                }}
                className="text-sm font-medium text-primary hover:underline"
              >
                Back
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                id="firstName"
                type="text"
                placeholder="Ada"
                value={formData.firstName}
                onChange={handleChange("firstName")}
              />
              <Field
                label="Last name"
                id="lastName"
                type="text"
                placeholder="Lovelace"
                value={formData.lastName}
                onChange={handleChange("lastName")}
              />
            </div>

            <Field
              label={formData.accountType === "business" ? "Enter work email" : "Enter your email"}
              id="email"
              type="email"
              placeholder={formData.accountType === "business" ? "treasury@abc.com" : "YourCoolEmail@gmail.com"}
              value={formData.email}
              onChange={handleChange("email")}
            />
            <Field
              label="Password"
              id="password"
              type="password"
              placeholder="Minimum 12 characters"
              value={formData.password}
              onChange={handleChange("password")}
            />
            <Field
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              placeholder="Minimum 12 characters"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
            />


            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary"
              />
              <span>
                I accept the{" "}
                <a className="text-primary hover:underline" href="#">
                  Master Services Agreement
                </a>{" "}
                and consent to KYB verification.
              </span>
            </label>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              Create Account
              <span className="font-mono transition-transform group-hover:translate-x-1">→</span>
            </button>
          </>
        )}

        {status.message ? (
          <p className={`text-sm ${status.type === "error" ? "text-red-500" : "text-primary"}`}>
            {status.message}
          </p>
        ) : null}

        <Modal
          isOpen={Boolean(feeModal)}
          onClose={() => setFeeModal(null)}
          title={feeModal === "business" ? "Business account fee details" : "Personal account fee details"}
          description="Transparent coverage for settlements across major assets."
          accountType={feeModal ?? undefined}
        />

        <p className="pt-2 text-center text-sm text-muted-foreground">
          Already had account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

function Field({
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
