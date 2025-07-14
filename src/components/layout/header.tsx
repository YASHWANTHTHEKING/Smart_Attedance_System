"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, UserPlus, BookUser } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Attendance", icon: Camera },
  { href: "/enroll", label: "Enroll", icon: UserPlus },
  { href: "/log", label: "Daily Log", icon: BookUser },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-accent"
            >
              <path d="M12 11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
              <path d="M18.5 18.5c-3-2-6-3-6-3" />
              <path d="M22 19c-1.5-1.5-3-2-6-3" />
              <path d="M2 19c1.5-1.5 3-2 6-3" />
              <path d="M5.5 18.5c3-2 6-3 6-3" />
              <path d="m15 13 2 2 4-4" />
            </svg>
            <span className="inline-block font-bold">FaceCheck In</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-accent",
                  pathname === item.href ? "text-accent" : "text-muted-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <nav className="flex items-center gap-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={`${item.href}-mobile`}
              href={item.href}
              className={cn(
                "flex items-center justify-center rounded-md p-2 transition-colors hover:bg-secondary hover:text-accent",
                pathname === item.href ? "text-accent bg-secondary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
