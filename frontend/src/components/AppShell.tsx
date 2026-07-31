import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeftRight,
  FilePlus2,
  LogOut,
  Menu,
  Search,
  Settings,
  UserCircle2,
  User as UserIcon,
} from "lucide-react";
import { api } from "../lib/api";
import { isProfileComplete, type SessionUser } from "../lib/useSession";

const NAV_ITEMS = [
  { label: "Create Invoice/Bill", to: "/create-invoice", icon: FilePlus2 },
  { label: "Manage your transactions", to: "/transactions", icon: ArrowLeftRight },
  { label: "Setting", to: "/settings", icon: Settings },
] as const;

const MENU_LINKS = [
  { label: "About", to: "/about", hash: undefined },
  { label: "How to use", to: "/about", hash: "how-to-use" },
  { label: "Fees", to: "/about", hash: "fees" },
] as const;

interface AppShellProps {
  user: SessionUser | null;
  guest?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children: ReactNode;
}

export function AppShell({ user, guest = false, searchValue, onSearchChange, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} user={user} guest={guest} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar searchValue={searchValue} onSearchChange={onSearchChange} />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>

      {!guest ? <CompleteProfileModal user={user} /> : null}
    </div>
  );
}

function Sidebar({
  collapsed,
  onToggleCollapse,
  user,
  guest,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  user: SessionUser | null;
  guest: boolean;
}) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore — we redirect to /login regardless of backend result.
    } finally {
      navigate({ to: "/login" });
    }
  };

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-card/40 transition-[width] duration-200 ${
        collapsed ? "w-[76px]" : "w-[76px] md:w-64"
      }`}
    >
      {/* Header: logo · profile · collapse toggle */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-4">
        <Link to="/" className="font-display text-lg font-extrabold tracking-tighter">
          <span className={collapsed ? "hidden" : "hidden md:inline"}>
            CheckAPay<span className="text-primary">.</span>
          </span>
          <span className={collapsed ? "inline" : "inline md:hidden"}>
            C<span className="text-primary">.</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground md:flex"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Profile */}
      <div className="relative border-b border-border px-4 py-4" ref={profileRef}>
        <button
          type="button"
          onClick={() => setProfileOpen((value) => !value)}
          className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent/50 ${
            collapsed ? "justify-center" : "justify-center md:justify-start"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-sm font-semibold text-foreground">
            {guest ? <UserIcon className="h-4 w-4 text-muted-foreground" /> : initials(user?.firstName, user?.lastName)}
          </div>
          <div className={`min-w-0 ${collapsed ? "hidden" : "hidden md:block"}`}>
            <div className="truncate text-sm font-semibold">
              {guest ? "Guest" : user?.firstName?.trim() || "Profile"}
            </div>
            <div className="truncate font-mono text-[11px] text-muted-foreground">
              {guest ? "Not signed in" : user?.email || ""}
            </div>
          </div>
        </button>

        {profileOpen ? (
          <div className="absolute left-4 right-4 top-full z-20 mt-2 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
            {guest ? (
              <>
                <Link to="/login" className="block px-3 py-2 text-sm hover:bg-accent/60" onClick={() => setProfileOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="block px-3 py-2 text-sm hover:bg-accent/60" onClick={() => setProfileOpen(false)}>
                  Create account
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-sm hover:bg-accent/60" onClick={() => setProfileOpen(false)}>
                  My account
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-accent/60 disabled:opacity-60"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {signingOut ? "Signing out…" : "Log out"}
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            title={label}
            className={`flex items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:bg-accent/50 hover:text-foreground ${
              collapsed ? "justify-center" : "justify-center md:justify-start"
            }`}
            activeProps={{ className: "!border-primary/30 !bg-primary/10 !text-primary" }}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className={`truncate ${collapsed ? "hidden" : "hidden md:inline"}`}>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function TopBar({
  searchValue,
  onSearchChange,
}: {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 sm:gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="Your business/merchants/shops name"
            className="w-full min-w-0 rounded-md border border-border bg-card/60 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="More information"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Menu className="h-4 w-4" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
              {MENU_LINKS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  className="block px-3 py-2 text-sm hover:bg-accent/60"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <Link
          to="/collect-info"
          aria-label="Complete your profile"
          title="Complete your profile"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <UserCircle2 className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

function CompleteProfileModal({ user }: { user: SessionUser | null }) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const complete = isProfileComplete(user);

  useEffect(() => {
    // Reset the dismissal once a fresh, complete profile loads so a later
    // incomplete state (e.g. a different account) prompts again.
    if (complete) setDismissed(false);
  }, [complete]);

  if (!user || complete || dismissed) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm"
      onClick={() => setDismissed(true)}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="font-mono text-[11px] uppercase tracking-widest text-primary">Profile setup</div>
        <div className="mt-1 text-lg font-semibold text-foreground">Complete your profile</div>
        <p className="mt-2 text-sm text-muted-foreground">
          We still need a few details — verification, date of birth, and{" "}
          {user.isBusinessAccount ? "your business info" : "your employment info"} — before you can send or receive
          payments.
        </p>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            Later
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/collect-info" })}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
          >
            Complete your profile
          </button>
        </div>
      </div>
    </div>
  );
}

function initials(firstName?: string, lastName?: string) {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";
  const combined = `${first}${last}`.toUpperCase();
  return combined || "SP";
}
