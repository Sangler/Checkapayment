import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AuthShell } from "./AuthShell-CNh4elTZ.mjs";
import { c as Mail, h as CircleCheck, o as Phone, r as ShieldCheck, v as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collect-info-Bmi1HrCN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initialFormData = {
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
		country: "Canada"
	}
};
var steps = [
	"Business profile",
	"Personal details",
	"Address & verification"
];
var employmentStatuses = [
	"Full-time",
	"Part-time",
	"Casual",
	"Retired",
	"Unemployed",
	"Self-employed",
	"Contractor",
	"Student",
	"Temporary",
	"Other"
];
var businessTypes = [
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
	"Other"
];
var countries = [
	"Canada",
	"United States",
	"United Kingdom",
	"Australia",
	"Nigeria",
	"Other"
];
function CollectInfoPage() {
	const [step, setStep] = (0, import_react.useState)(1);
	const [formData, setFormData] = (0, import_react.useState)(initialFormData);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const progress = (0, import_react.useMemo)(() => Math.round(step / 3 * 100), [step]);
	const updateField = (field, value) => {
		setFormData((current) => ({
			...current,
			[field]: value
		}));
	};
	const updateAddressField = (field, value) => {
		setFormData((current) => ({
			...current,
			address: {
				...current.address,
				[field]: value
			}
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
				formData.address.country
			].filter(Boolean).join(", ")
		};
		window.localStorage.setItem("checkapay_collect_info_draft", JSON.stringify(payload));
		console.info("Collect-info payload", payload);
		setSubmitted(true);
	};
	const addressPreview = [
		formData.address.street,
		formData.address.city,
		formData.address.province,
		formData.address.country
	].filter(Boolean).join(", ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		badge: "PROFILE SETUP",
		title: submitted ? "Profile ready" : "Complete your profile",
		subtitle: submitted ? "Your details have been saved locally for this session and are ready for the next backend integration step." : "We’ll gather the basics in three quick steps so your account is ready for invoicing and payments.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6",
			children: !submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card/40 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-widest text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Step ",
								step,
								" of 3"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [progress, "%"] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-full rounded-full bg-background",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 rounded-full bg-primary transition-all",
								style: { width: `${progress}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: steps.map((label, index) => {
								const active = step === index + 1;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-widest ${step > index + 1 ? "bg-primary/15 text-primary" : active ? "bg-accent text-foreground" : "bg-background text-muted-foreground"}`,
									children: label
								}, label);
							})
						})
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: error
				}) : null,
				step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "Employment status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: formData.employmentStatus,
								onChange: (event) => updateField("employmentStatus", event.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select one"
								}), employmentStatuses.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item,
									children: item
								}, item))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "Job title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formData.jobTitle,
								onChange: (event) => updateField("jobTitle", event.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								placeholder: "e.g. Founder"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "Business name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formData.businessName,
								onChange: (event) => updateField("businessName", event.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								placeholder: "Your company or shop"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "Business type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: formData.businessType,
								onChange: (event) => updateField("businessType", event.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select one"
								}), businessTypes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item,
									children: item
								}, item))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "Tax ID number (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formData.taxIdNumber,
								onChange: (event) => updateField("taxIdNumber", event.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								placeholder: "CRA / tax number"
							})]
						})
					]
				}) : null,
				step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "First name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formData.firstName,
								onChange: (event) => updateField("firstName", event.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								placeholder: "John"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "Last name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formData.lastName,
								onChange: (event) => updateField("lastName", event.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								placeholder: "Doe"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "Preferred name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formData.preferredName,
								onChange: (event) => updateField("preferredName", event.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								placeholder: "Optional"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "Date of birth"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: formData.dateOfBirth,
								onChange: (event) => updateField("dateOfBirth", event.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium text-foreground",
									children: "Email address"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										value: formData.email,
										onChange: (event) => updateField("email", event.target.value),
										className: "w-full bg-transparent text-sm outline-none",
										placeholder: "you@example.com"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: formData.emailOtp,
										onChange: (event) => updateField("emailOtp", event.target.value),
										className: "w-full bg-transparent text-sm outline-none",
										placeholder: "Enter email OTP"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium text-foreground",
									children: "Phone number"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: formData.phoneCountryCode,
											onChange: (event) => updateField("phoneCountryCode", event.target.value),
											className: "w-20 bg-transparent text-sm outline-none",
											placeholder: "+1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: formData.phoneNumber,
											onChange: (event) => updateField("phoneNumber", event.target.value),
											className: "flex-1 bg-transparent text-sm outline-none",
											placeholder: "123 456 7890"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: formData.phoneOtp,
										onChange: (event) => updateField("phoneOtp", event.target.value),
										className: "w-full bg-transparent text-sm outline-none",
										placeholder: "Enter phone OTP"
									})]
								})
							]
						})
					]
				}) : null,
				step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card/40 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-sm font-medium text-foreground",
								children: "Address details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Google Maps autocomplete will be wired here later. For now the street field remains editable and the city/postal/province fields are prepared for auto-fill."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "Country"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: formData.address.country,
								onChange: (event) => updateAddressField("country", event.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								children: countries.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item,
									children: item
								}, item))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 md:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium text-foreground",
										children: "Street address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: formData.address.street,
										onChange: (event) => updateAddressField("street", event.target.value),
										className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
										placeholder: "123 Main St"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 md:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium text-foreground",
										children: "Address line 2"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: formData.address.addressLine2,
										onChange: (event) => updateAddressField("addressLine2", event.target.value),
										className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
										placeholder: "Suite, unit, floor, etc."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium text-foreground",
										children: "Postal code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: formData.address.postalCode,
										onChange: (event) => updateAddressField("postalCode", event.target.value),
										className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground outline-none",
										placeholder: "Auto-filled later",
										disabled: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium text-foreground",
										children: "City"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: formData.address.city,
										onChange: (event) => updateAddressField("city", event.target.value),
										className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground outline-none",
										placeholder: "Auto-filled later",
										disabled: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium text-foreground",
										children: "Province"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: formData.address.province,
										onChange: (event) => updateAddressField("province", event.target.value),
										className: "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground outline-none",
										placeholder: "Auto-filled later",
										disabled: true
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: "Address preview"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-muted-foreground",
								children: addressPreview || "Add your street address to preview it here."
							})]
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-t border-border pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleBack,
						disabled: step === 1,
						className: "rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50",
						children: "Back"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: step === 3 ? handleSubmit : handleNext,
						className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
						children: [step === 3 ? "Complete profile" : "Continue", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 rounded-xl border border-primary/20 bg-primary/10 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-foreground",
							children: "Profile completed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Your details are stored in the current session and are ready for the backend integration step."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-background/70 p-3 text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: "Summary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-1 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									formData.firstName,
									" ",
									formData.lastName
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formData.businessName }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: addressPreview || "Address pending" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
							children: "Go to dashboard"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setSubmitted(false);
								setStep(1);
								setFormData(initialFormData);
								setError(null);
							},
							className: "rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
							children: "Start again"
						})]
					})
				]
			})
		})
	});
}
//#endregion
export { CollectInfoPage as component };
