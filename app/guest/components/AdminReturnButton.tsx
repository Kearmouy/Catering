"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminReturnButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.isAdmin));
  }, []);

  if (!isAdmin) return null;

  return (
    <button
      style={{ touchAction: "manipulation" }}
      onClick={() => router.push("/admin/events")}
      className="fixed bottom-6 right-6 z-50 bg-[#6E3A1B] text-white px-4 py-3 rounded-full shadow-lg text-sm font-medium hover:opacity-90 flex items-center gap-2"
    >
      ⚙ Back to Admin
    </button>
  );
}