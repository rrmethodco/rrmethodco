"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  ClipboardList,
  Send,
  History,
  Settings,
  Stethoscope,
  Briefcase,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_QUEUE } from "@/lib/mock-data";
import { activeCases } from "@/lib/cases";

const navSections = [
  {
    label: "Work",
    items: [
      { href: "/practice/inbox", label: "Inbox", icon: Inbox, badgeKey: "inbox" as const },
      { href: "/practice/cases", label: "Cases", icon: Briefcase, badgeKey: "cases" as const },
      { href: "/practice", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Knowledge",
    items: [
      { href: "/practice/playbook", label: "Carrier Playbook", icon: BookOpen },
      { href: "/practice/history", label: "History", icon: History },
    ],
  },
  {
    label: "Generate manually",
    items: [
      { href: "/practice/generate/pre-auth", label: "Pre-auth narrative", icon: ClipboardList },
      { href: "/practice/generate/appeal", label: "Appeal letter", icon: FileText },
      { href: "/practice/generate/referral", label: "Referral letter", icon: Send },
    ],
  },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const inboxCount = MOCK_QUEUE.filter((q) => q.status === "pending").length;
  const casesCount = activeCases().length;

  const badgeFor = (key?: string) => {
    if (key === "inbox") return inboxCount;
    if (key === "cases") return casesCount;
    return 0;
  };

  const NavBody = () => (
    <>
      <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white">
          <Stethoscope size={18} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">Restore</div>
          <div className="truncate text-xs text-slate-500">Allyson A. Abbott DMD PC</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <div className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {section.label}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === "/practice"
                    ? pathname === "/practice"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                const badgeCount = "badgeKey" in item ? badgeFor(item.badgeKey) : 0;
                const showBadge = badgeCount > 0;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-brand-50 text-brand-800"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <Icon size={16} className={active ? "text-brand-700" : "text-slate-400"} />
                      <span className="flex-1">{item.label}</span>
                      {showBadge && (
                        <span className="rounded-full bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white">
                          {badgeCount}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="mt-6 border-t border-slate-100 pt-4">
          <Link
            href="/practice/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/practice/settings")
                ? "bg-brand-50 text-brand-800"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <Settings size={16} className={pathname.startsWith("/practice/settings") ? "text-brand-700" : "text-slate-400"} />
            Settings
          </Link>
        </div>
      </nav>

      <div className="border-t border-slate-200 px-6 py-4">
        <div className="text-xs text-slate-500">Logged in as</div>
        <div className="text-sm font-medium text-slate-900">Office Manager</div>
        <div className="mt-2 text-xs text-slate-400">Audit log: enabled</div>
      </div>
    </>
  );

  const totalAlerts = inboxCount + casesCount;

  return (
    <>
      {/* Mobile top header — only visible on < md */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Link href="/practice" className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-white">
            <Stethoscope size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight text-slate-900">Restore</div>
            <div className="truncate text-[10px] leading-tight text-slate-500">Allyson A. Abbott DMD PC</div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="relative inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Menu size={16} />
          Menu
          {totalAlerts > 0 && (
            <span className="ml-1 rounded-full bg-brand-700 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {totalAlerts}
            </span>
          )}
        </button>
      </header>

      {/* Desktop sidebar — only visible on md+ */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="flex h-screen flex-col sticky top-0">
          <NavBody />
        </div>
      </aside>

      {/* Mobile drawer — overlays content when open */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-900/40"
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 rounded-md p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
            <NavBody />
          </aside>
        </div>
      )}
    </>
  );
}
