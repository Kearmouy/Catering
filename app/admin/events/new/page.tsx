import { Suspense } from "react";
import EventsNewPage from "./EventsNewPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400">Loading...</div>}>
      <EventsNewPage />
    </Suspense>
  );
}