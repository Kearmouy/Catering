"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/admin/menu", label: "Menu" },
    { href: "/admin/events", label: "Events" },
  ];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b shadow-sm z-50 text-[#6E3A1B]">
      <div className="w-full px-4 sm:px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src="/bombayLogo.png"
              alt="Logo"
              width={60}
              height={60}
              className="shrink-0 rounded-full object-cover"
            />
            <h1 className="font-bold text-base sm:text-lg leading-tight break-words">
              Bombay Chowpatty Catering
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ touchAction: "manipulation" }}
                  className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition whitespace-nowrap ${
                    isActive
                      ? "bg-gray-200 text-[#6E3A1B]"
                      : "text-[#6E3A1B] hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="w-px h-5 bg-gray-200 hidden sm:block" />

            <Link
              href="/guest/events"
              style={{ touchAction: "manipulation" }}
              className="px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition whitespace-nowrap bg-[#f7f1ec] text-[#6E3A1B] hover:bg-[#ede4d8]"
            >
              Guest View
            </Link>

            <button
              style={{ touchAction: "manipulation" }}
              onClick={logout}
              className="px-3 sm:px-4 py-2 rounded-md text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}