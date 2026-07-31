import { o as __toESM } from "../_runtime.mjs";
import { t as getFeeItems } from "./fees-d1YMgDb8.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as require_react_dom, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AuthShell } from "./AuthShell-CNh4elTZ.mjs";
import { d as Info, t as X } from "../_libs/lucide-react.mjs";
import { t as api } from "./api-B-_3N63s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-Cu5Hg0gc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
function Modal({ isOpen, onClose, title, description, accountType, children }) {
	(0, import_react.useEffect)(() => {
		if (!isOpen || typeof document === "undefined") return;
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const handleKeyDown = (event) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = originalOverflow;
		};
	}, [isOpen, onClose]);
	if (!isOpen || typeof document === "undefined") return null;
	const feeItems = getFeeItems(accountType);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[60] flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl",
			onClick: (event) => event.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
						children: "Fee overview"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-semibold text-foreground",
						children: title
					}),
					description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-sm text-muted-foreground",
						children: description
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary",
					"aria-label": "Close fee details",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded-xl border border-border bg-background/70 p-4 text-sm text-muted-foreground",
				children: children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: feeItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", item] }, item))
				})
			})]
		})
	}), document.body);
}
var initialFormData = {
	firstName: "",
	lastName: "",
	entity: "",
	email: "",
	password: "",
	confirmPassword: "",
	volume: "< $250k",
	accountType: "business"
};
function RegisterPage() {
	const [formData, setFormData] = (0, import_react.useState)(initialFormData);
	const [step, setStep] = (0, import_react.useState)(1);
	const [feeModal, setFeeModal] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)({
		type: "idle",
		message: ""
	});
	const handleChange = (field) => (event) => {
		setFormData((prev) => ({
			...prev,
			[field]: event.target.value
		}));
	};
	const handleAccountTypeSelect = (accountType) => {
		setFormData((prev) => ({
			...prev,
			accountType,
			email: "",
			password: "",
			confirmPassword: ""
		}));
		setStep(2);
		setStatus({
			type: "idle",
			message: ""
		});
	};
	const validateForm = () => {
		if (formData.accountType === "business") {
			if (!/^[^\s@]+@abc\.com$/i.test(formData.email)) {
				setStatus({
					type: "error",
					message: "Business accounts must use an email ending in @abc.com."
				});
				return false;
			}
		}
		if (formData.password.length < 12) {
			setStatus({
				type: "error",
				message: "Password must be at least 12 characters long."
			});
			return false;
		}
		if (formData.password !== formData.confirmPassword) {
			setStatus({
				type: "error",
				message: "Passwords do not match."
			});
			return false;
		}
		return true;
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setStatus({
			type: "idle",
			message: ""
		});
		if (!validateForm()) return;
		try {
			const { confirmPassword: _confirmPassword, ...payload } = formData;
			const response = await api.post("/auth/register", payload);
			setStatus({
				type: "success",
				message: response.data.message
			});
		} catch (error) {
			const message = error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response ? error.response.data?.error || "Unable to complete registration right now." : "Unable to complete registration right now.";
			setStatus({
				type: "error",
				message
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		badge: "ONBOARDING // KYB TIER 1",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Get started with ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary",
				children: "simple billing"
			}),
			"."
		] }),
		subtitle: "Create bills, send QR payments, and start collecting stablecoin for your business.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-5",
			onSubmit: handleSubmit,
			children: [
				step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card/50 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: "Choose your account type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Pick the experience that best fits your needs."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-primary/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleAccountTypeSelect("business"),
								className: "w-full text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: "Create Business Account"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Get a better rate for bills, finances, and invoicing at work."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (event) => {
									event.stopPropagation();
									setFeeModal("business");
								},
								className: "mt-3 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary",
								"aria-label": "View business fee details",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" }), "Fee details"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-primary/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleAccountTypeSelect("personal"),
								className: "w-full text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: "Create Personal Account"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "For individual use and personal payments."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (event) => {
									event.stopPropagation();
									setFeeModal("personal");
								},
								className: "mt-3 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary",
								"aria-label": "View personal fee details",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" }), "Fee details"]
							})]
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg border border-border bg-card/50 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
							children: formData.accountType === "business" ? "Business account" : "Personal account"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium text-foreground",
							children: "Create your secure access"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setStep(1);
								setStatus({
									type: "idle",
									message: ""
								});
							},
							className: "text-sm font-medium text-primary hover:underline",
							children: "Back"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: formData.accountType === "business" ? "Enter work email" : "Enter your email",
						id: "email",
						type: "email",
						placeholder: formData.accountType === "business" ? "treasury@abc.com" : "YourCoolEmail@gmail.com",
						value: formData.email,
						onChange: handleChange("email")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Password",
						id: "password",
						type: "password",
						placeholder: "Minimum 12 characters",
						value: formData.password,
						onChange: handleChange("password")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Confirm Password",
						id: "confirmPassword",
						type: "password",
						placeholder: "Minimum 12 characters",
						value: formData.confirmPassword,
						onChange: handleChange("confirmPassword")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
						children: "Monthly invoice volume"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							"< $250k",
							"$250k–2M",
							"$2M+"
						].map((volume) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFormData((prev) => ({
								...prev,
								volume
							})),
							className: `rounded-md border px-3 py-2.5 font-mono text-xs transition-colors ${formData.volume === volume ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary"}`,
							children: volume
						}, volume))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "mt-0.5 h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"I accept the",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-primary hover:underline",
								href: "#",
								children: "Master Services Agreement"
							}),
							" ",
							"and consent to KYB verification."
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						className: "group flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90",
						children: ["Create Account", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono transition-transform group-hover:translate-x-1",
							children: "→"
						})]
					})
				] }),
				status.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `text-sm ${status.type === "error" ? "text-red-500" : "text-primary"}`,
					children: status.message
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
					isOpen: Boolean(feeModal),
					onClose: () => setFeeModal(null),
					title: feeModal === "business" ? "Business account fee details" : "Personal account fee details",
					description: "Transparent coverage for settlements across major assets.",
					accountType: feeModal ?? void 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "pt-2 text-center text-sm text-muted-foreground",
					children: [
						"Already had account?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "font-medium text-primary hover:underline",
							children: "Sign in"
						})
					]
				})
			]
		})
	});
}
function Field({ label, id, type, placeholder, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor: id,
		className: "mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		id,
		type,
		placeholder,
		value,
		onChange,
		className: "w-full rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
	})] });
}
//#endregion
export { RegisterPage as component };
