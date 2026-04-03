"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/events");
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#faf7f2] px-4">
      <div className="bg-white border border-[#d6c8b8] rounded-2xl p-8 w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#6E3A1B]">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Bombay Chowpatty Catering</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-gray-500 block">
            Password
          </label>
          <input
            type="password"
            className="border border-[#d6c8b8] p-3 rounded-xl w-full outline-none focus:border-[#6E3A1B]"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          style={{ touchAction: "manipulation" }}
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#6E3A1B] text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </main>
  );
}