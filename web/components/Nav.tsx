"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_QUEUE } from "@/lib/mock-data";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/queue", label: "Review queue", icon: Inbox, badgeKey: "queue" as const },
    ],
  },
  {
    label: "Generate",
    items: [
      { href: "/generate/pre-auth", label: "Pre-auth narrative", icon: ClipboardList },
      { href: "/generate/appeal", label: "Appeal letter", icon: FileText },
      { href: "/generate/referral", label: "Referral letter", icon: Send },
    ],
  },
  {
    label: "Records",
    items: [
      { href: "/history", label: "History", icon: History },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Nav() {
  const pathname = usePathname();
  const queueCount = MOCK_QUEUE.filter((q) => q.status === "pending").length;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white">
            <Stethoscope size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Restore</div>
            <div className="text-xs text-slate-500">Mom&apos;s Practice · 4 endodontists</div>
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
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  const showBadge = "badgeKey" in item && item.badgeKey === "queue" && queueCount > 0;
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
                            {queueCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 px-6 py-4">
          <div className="text-xs text-slate-500">Logged in as</div>
          <div className="text-sm font-medium text-slate-900">Office Manager</div>
          <div className="mt-2 text-xs text-slate-400">Audit log: enabled</div>
        </div>
      </div>
    </aside>
  );
}
