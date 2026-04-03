import { Suspense } from "react";
import MenuPage from "./MenuPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400">Loading...</div>}>
      <MenuPage />
    </Suspense>
  );
}