import { Suspense } from "react";
import GuestMenuPage from "./GuestMenuPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400">Loading...</div>}>
      <GuestMenuPage />
    </Suspense>
  );
}