"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  ingredients: string[];
  tags: string[];
};

type EventItem = {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  selectedMenuItems: string[];
};

export default function EventsNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const isEditing = !!editId;

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const res = await fetch("/api/menu-items", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadMenuItems();
  }, []);

  useEffect(() => {
    if (!editId) return;

    const loadEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/events/${editId}`);
        if (!res.ok) {
          alert("Could not load event.");
          return;
        }

        const event: EventItem = await res.json();
        setTitle(event.title || "");
        setDate(event.date || "");
        setTime(event.time || "");
        setLocation(event.location || "");
        setSelectedMenuItems(event.selectedMenuItems || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [editId]);

  const toggleMenuItem = (itemName: string) => {
    setSelectedMenuItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const back = () => {
    router.push("/admin/events");
  };

  const cancel = () => {
    if (!title && !date && !time && !location && selectedMenuItems.length === 0) return;

    const confirmClear = confirm("Clear all fields?");
    if (!confirmClear) return;

    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setSelectedMenuItems([]);
  };

  const saveEvent = async () => {
    if (!title || !date || !time || !location) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      title,
      date,
      time,
      location,
      selectedMenuItems,
    };

    try {
      const res = await fetch(
        isEditing ? `/api/events/${editId}` : "/api/events",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        alert("Failed to save event.");
        return;
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save event.");
    }
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-[#6E3A1B]">
        {isEditing ? "Edit Event" : "Events Manager"}
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="border p-6 rounded-2xl max-w space-y-6 bg-white">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Event Details
            </p>

            <div className="space-y-2">
              <label className="text-sm uppercase tracking-[0.2em] text-gray-500 block">
                Event Title
              </label>
              <input
                className="border border-[#d6c8b8] p-3 rounded-xl w-full outline-none focus:border-[#6E3A1B]"
                placeholder="e.g. Henderson Wedding Reception"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 min-w-0">
                <label className="text-sm uppercase tracking-[0.2em] text-gray-500 block">
                  Date
                </label>
                <input
                  type="date"
                  className="border border-[#d6c8b8] p-3 rounded-xl w-full outline-none focus:border-[#6E3A1B]"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-2 min-w-0">
                <label className="text-sm uppercase tracking-[0.2em] text-gray-500 block">
                  Time
                </label>
                <input
                  type="time"
                  className="border border-[#d6c8b8] p-3 rounded-xl w-full outline-none focus:border-[#6E3A1B]"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm uppercase tracking-[0.2em] text-gray-500 block">
                Location
              </label>
              <input
                className="border border-[#d6c8b8] p-3 rounded-xl w-full outline-none focus:border-[#6E3A1B]"
                placeholder="e.g. Grand Ballroom, Fairmont Hotel"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm uppercase tracking-[0.2em] text-gray-500 block">
                Menu Items
              </label>

              {menuItems.length === 0 ? (
                <div className="border border-[#d6c8b8] rounded-xl p-4 text-gray-500">
                  No menu items available. Create menu items first.
                </div>
              ) : (
                <div className="space-y-3">
                  {menuItems.map((item) => {
                    const isSelected = selectedMenuItems.includes(item.name);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleMenuItem(item.name)}
                        className={`w-full text-left border rounded-xl p-4 transition ${
                          isSelected
                            ? "border-[#6E3A1B] bg-[#f7f1ec]"
                            : "border-[#d6c8b8] bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold text-[#3b2a22]">{item.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>

                          <div
                            className={`h-5 w-5 rounded border flex items-center justify-center ${
                              isSelected
                                ? "bg-[#6E3A1B] border-[#6E3A1B] text-white"
                                : "border-gray-400 bg-white"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mt-4">
            <button
              type="button"
              onClick={back}
              className="bg-white text-[#6E3A1B] border border-[#6E3A1B] px-4 py-3 rounded-lg hover:bg-gray-100 min-h-11 w-full sm:w-auto"
            >
              Back
            </button>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={cancel}
                className="bg-white text-[#6E3A1B] border border-[#6E3A1B] px-4 py-3 rounded-lg hover:bg-gray-100 min-h-11 w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveEvent}
                className="bg-[#6E3A1B] text-white px-4 py-3 rounded-lg hover:opacity-90 min-h-11 w-full sm:w-auto"
              >
                {isEditing ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}