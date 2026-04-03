"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  selectedMenuItems: string[];
};

export default function EventsListPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents);
  }, []);

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-CA", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f3ee]">
      <section className="bg-[#6E3A1B] text-white w-full px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4">Welcome</p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-medium leading-tight break-words">
            {todayLabel}
          </h1>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#8f8276] mb-6">
            Today&apos;s Events
          </p>

          <div className="space-y-4 sm:space-y-6">
            {events.length === 0 ? (
              <div className="border border-[#d6c8b8] rounded-3xl p-6 sm:p-8 bg-white text-[#8f8276] text-sm">
                No events yet.
              </div>
            ) : (
              events.map((event) => (
                <Link
                  key={event.id}
                  href={`/guest/menu?event=${event.id}`}
                  className="block rounded-3xl border border-[#d6c8b8] bg-white px-4 sm:px-8 py-5 sm:py-7 shadow-sm transition hover:bg-[#fcfaf8] hover:border-[#c9b5a3]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-[#b07a33] mb-3">
                        {formatTime(event.time)}
                      </p>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#3b2a22] leading-tight break-words">
                        {event.title}
                      </h2>
                      <p className="mt-4 text-[#7a6f66] text-sm sm:text-base break-words">
                        <span className="mr-2">📍</span>{event.location}
                      </p>
                    </div>
                    <div className="shrink-0 self-start md:self-auto">
                      <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-[#eef2ec] text-[#6E3A1B] flex items-center justify-center text-xl sm:text-2xl">
                        ›
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#e8ddd1] pt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="text-[#a19488] text-sm">
                      {event.selectedMenuItems?.length || 0}{" "}
                      {event.selectedMenuItems?.length === 1 ? "menu item" : "menu items"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.selectedMenuItems?.length > 0 ? (
                        event.selectedMenuItems.map((name) => (
                          <span key={name} className="px-3 py-1 rounded-full text-xs bg-[#f7f1ec] text-[#6E3A1B] border border-[#e5d8cb]">
                            {name}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[#b0a59a]">No menu items selected</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e5d8cb] px-4 sm:px-6 py-6">
        <div className="max-w-5xl mx-auto text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#b0a59a]">
          <span>Bombay Chowpatty</span>
        </div>
      </footer>
    </main>
  );
}

function formatTime(time: string) {
  if (!time) return "";
  const [hourStr, minute] = time.split(":");
  const hourNum = Number(hourStr);
  return `${hourNum % 12 || 12}:${minute} ${hourNum >= 12 ? "PM" : "AM"}`;
}