import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Search, i as Settings, l as LogOut, n as User, p as FilePlusCorner, s as Menu, y as ArrowLeftRight } from "../_libs/lucide-react.mjs";
import { t as api } from "./api-B-_3N63s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useSession-B9W-PxqQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV_ITEMS = [
	{
		label: "Create Invoice/Bill",
		to: "/create-invoice",
		icon: FilePlusCorner
	},
	{
		label: "Manage your transactions",
		to: "/transactions",
		icon: ArrowLeftRight
	},
	{
		label: "Setting",
		to: "/settings",
		icon: Settings
	}
];
var MENU_LINKS = [
	{
		label: "About",
		to: "/about",
		hash: void 0
	},
	{
		label: "How to use",
		to: "/about",
		hash: "how-to-use"
	},
	{
		label: "Fees",
		to: "/about",
		hash: "fees"
	}
];
function AppShell({ user, guest = false, searchValue, onSearchChange, children }) {
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background font-sans text-foreground selection:bg-primary/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
				collapsed,
				onToggleCollapse: () => setCollapsed((value) => !value),
				user,
				guest
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
					searchValue,
					onSearchChange
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8",
					children
				})]
			})]
		})
	});
}
function Sidebar({ collapsed, onToggleCollapse, user, guest }) {
	const navigate = useNavigate();
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const profileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const handleLogout = async () => {
		setSigningOut(true);
		try {
			await api.post("/auth/logout");
		} catch {} finally {
			navigate({ to: "/login" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: `sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-card/40 transition-[width] duration-200 ${collapsed ? "w-[76px]" : "w-[76px] md:w-64"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 border-b border-border px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "font-display text-lg font-extrabold tracking-tighter",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: collapsed ? "hidden" : "hidden md:inline",
						children: ["CheckAPay", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: collapsed ? "inline" : "inline md:hidden",
						children: ["C", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onToggleCollapse,
					"aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
					className: "hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground md:flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative border-b border-border px-4 py-4",
				ref: profileRef,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setProfileOpen((value) => !value),
					className: `flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent/50 ${collapsed ? "justify-center" : "justify-center md:justify-start"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-sm font-semibold text-foreground",
						children: guest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-muted-foreground" }) : initials(user?.firstName, user?.lastName)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `min-w-0 ${collapsed ? "hidden" : "hidden md:block"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-semibold",
							children: guest ? "Guest" : user?.firstName?.trim() || "Profile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-mono text-[11px] text-muted-foreground",
							children: guest ? "Not signed in" : user?.email || ""
						})]
					})]
				}), profileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-4 right-4 top-full z-20 mt-2 overflow-hidden rounded-md border border-border bg-popover shadow-lg",
					children: guest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "block px-3 py-2 text-sm hover:bg-accent/60",
						onClick: () => setProfileOpen(false),
						children: "Log in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/register",
						className: "block px-3 py-2 text-sm hover:bg-accent/60",
						onClick: () => setProfileOpen(false),
						children: "Create account"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "block px-3 py-2 text-sm hover:bg-accent/60",
						onClick: () => setProfileOpen(false),
						children: "My account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleLogout,
						disabled: signingOut,
						className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-accent/60 disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), signingOut ? "Signing out…" : "Log out"]
					})] })
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 space-y-1 px-3 py-4",
				children: NAV_ITEMS.map(({ label, to, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					title: label,
					className: `flex items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:bg-accent/50 hover:text-foreground ${collapsed ? "justify-center" : "justify-center md:justify-start"}`,
					activeProps: { className: "!border-primary/30 !bg-primary/10 !text-primary" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `truncate ${collapsed ? "hidden" : "hidden md:inline"}`,
						children: label
					})]
				}, to))
			})
		]
	});
}
function TopBar({ searchValue, onSearchChange }) {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const menuRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-6xl items-center gap-2 sm:gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "search",
					value: searchValue,
					onChange: (event) => onSearchChange?.(event.target.value),
					placeholder: "Your business/merchants/shops name",
					className: "w-full min-w-0 rounded-md border border-border bg-card/60 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				ref: menuRef,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMenuOpen((value) => !value),
					"aria-label": "More information",
					className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
				}), menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-md border border-border bg-popover shadow-lg",
					children: MENU_LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						hash: item.hash,
						className: "block px-3 py-2 text-sm hover:bg-accent/60",
						onClick: () => setMenuOpen(false),
						children: item.label
					}, item.label))
				}) : null]
			})]
		})
	});
}
function initials(firstName, lastName) {
	return `${firstName?.trim()?.[0] ?? ""}${lastName?.trim()?.[0] ?? ""}`.toUpperCase() || "SP";
}
/**
* Loads the current session from `/auth/me`.
*
* NOTE: There is no route-level auth middleware yet, so an unauthenticated
* response is treated as a "guest" state instead of a hard redirect — pages
* using this hook must render sensibly for both signed-in users and guests.
*/
function useSession() {
	const [user, setUser] = (0, import_react.useState)(null);
	const [state, setState] = (0, import_react.useState)("loading");
	(0, import_react.useEffect)(() => {
		let active = true;
		async function loadSession() {
			try {
				const response = await api.get("/auth/me");
				if (!active) return;
				setUser(response.data?.user ?? response.data ?? {});
				setState("authenticated");
			} catch (error) {
				if (!active) return;
				const status = error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" ? error.response.status : void 0;
				setUser(null);
				setState(status === 401 || status === 403 ? "guest" : "error");
			}
		}
		loadSession();
		return () => {
			active = false;
		};
	}, []);
	return {
		user,
		state
	};
}
//#endregion
export { useSession as n, AppShell as t };
