"use client";

import { useEffect, useState } from "react";
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

  const loadEvents = async () => {
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to load events");
        return;
      }

      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const deleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete event.");
        return;
      }

      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete event.");
    }
  };

  return (
    <main className="p-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-[#6E3A1B]">Events</h1>
          <p className="text-gray-500 mt-2">
            {events.length} {events.length === 1 ? "event" : "events"} in your library
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="bg-[#6E3A1B] text-white px-5 py-3 rounded-xl hover:opacity-90"
        >
          + New Event
        </Link>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="border border-[#d6c8b8] rounded-2xl p-6 text-gray-500 bg-white">
            No events yet.
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="border border-[#d6c8b8] rounded-2xl p-6 bg-white"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-medium text-[#3b2a22]">
                  {event.title}
                </h2>

                <p className="text-gray-600">
                  <strong>Date:</strong> {event.date}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong> {event.time}
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong> {event.location}
                </p>

                <div className="text-gray-600">
                  <strong>Menu Items:</strong>
                  {event.selectedMenuItems.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.selectedMenuItems.map((itemName) => (
                        <span
                          key={itemName}
                          className="px-3 py-1 rounded-full text-sm bg-[#f7f1ec] text-[#6E3A1B] border border-[#e5d8cb]"
                        >
                          {itemName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="ml-2 text-gray-400">No menu items selected</span>
                  )}
                </div>

                <div className="border-t border-[#e5d8cb] pt-4 flex justify-between items-center">
                  <p className="text-gray-500">
                    {event.selectedMenuItems.length}{" "}
                    {event.selectedMenuItems.length === 1 ? "menu item" : "menu items"}
                  </p>

                  <div className="flex gap-3">
                    <Link
                      href={`/admin/events/new?edit=${event.id}`}
                      className="px-4 py-2 rounded-xl border border-[#d6c8b8] text-gray-600 hover:bg-gray-50"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}