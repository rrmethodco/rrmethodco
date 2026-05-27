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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="white" opacity="0.4"/>
            <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17.65 6.35C16.02 4.72 13.71 3.78 11.17 4.04C7.5 4.41 4.48 7.39 4.07 11.06C3.52 15.91 7.27 20 12 20C15.19 20 17.93 18.13 19.21 15.44" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 7V3h-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-white tracking-tight">Restore</div>
          <div className="truncate text-xs text-slate-400">Allyson A. Abbott DMD PC</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-brand-700/60">
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
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-dark-50 text-white"
                          : "text-slate-400 hover:bg-dark-100 hover:text-slate-200"
                      )}
                    >
                      <Icon size={18} className={active ? "text-brand-400" : "text-slate-500"} />
                      <span className="flex-1">{item.label}</span>
                      {showBadge && (
                        <span className="rounded-full bg-coral px-2 py-0.5 text-[11px] font-bold text-white">
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

        <div className="mt-4 border-t border-dark-50 pt-4">
          <Link
            href="/practice/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/practice/settings")
                ? "bg-dark-50 text-white"
                : "text-slate-400 hover:bg-dark-100 hover:text-slate-200"
            )}
          >
            <Settings size={18} className={pathname.startsWith("/practice/settings") ? "text-brand-400" : "text-slate-500"} />
            Settings
          </Link>
        </div>
      </nav>

      <div className="border-t border-dark-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-brand-300">
            SJ
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">Sarah J.</div>
            <div className="text-xs text-slate-500">Office Manager</div>
          </div>
        </div>
      </div>
    </>
  );

  const totalAlerts = inboxCount + casesCount;

  return (
    <>
      {/* Mobile top header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-dark px-4 py-3 md:hidden">
        <Link href="/practice" className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="white" opacity="0.4"/>
              <path d="M17.65 6.35C16.02 4.72 13.71 3.78 11.17 4.04C7.5 4.41 4.48 7.39 4.07 11.06C3.52 15.91 7.27 20 12 20C15.19 20 17.93 18.13 19.21 15.44" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold leading-tight text-white">Restore</div>
            <div className="truncate text-[10px] leading-tight text-slate-400">Allyson A. Abbott DMD PC</div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="relative inline-flex items-center gap-1.5 rounded-lg border border-dark-50 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-dark-50"
        >
          <Menu size={16} />
          Menu
          {totalAlerts > 0 && (
            <span className="ml-1 rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-bold text-white">
              {totalAlerts}
            </span>
          )}
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 bg-dark md:block">
        <div className="flex h-screen flex-col sticky top-0">
          <NavBody />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-900/40"
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-dark shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 rounded-md p-2 text-slate-400 hover:bg-dark-50"
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
