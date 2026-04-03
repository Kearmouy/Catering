"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  selectedMenuItems: string[];
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  ingredients: string[];
  tags: string[];
};

const CATEGORIES = ["Starter", "Main", "Side", "Dessert", "Beverage"];

const tagColors: Record<string, string> = {
  Vegan: "bg-green-100 text-green-700",
  Vegetarian: "bg-lime-100 text-lime-700",
  "Gluten-Free": "bg-yellow-100 text-yellow-700",
  "Dairy-Free": "bg-sky-100 text-sky-700",
  "Nut-Free": "bg-orange-100 text-orange-700",
  Halal: "bg-emerald-100 text-emerald-700",
  Spicy: "bg-red-100 text-red-700",
};

export default function GuestMenuPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("event");

  const [event, setEvent] = useState<EventItem | null>(null);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [openItem, setOpenItem] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    Promise.all([
      fetch("/api/events").then((r) => r.json()),
      fetch("/api/menu-items").then((r) => r.json()),
    ]).then(([events, menuItems]: [EventItem[], MenuItem[]]) => {
      const ev = events.find((e) => e.id === eventId);
      if (ev) {
        setEvent(ev);
        const filtered = menuItems.filter((m) =>
          ev.selectedMenuItems.includes(m.name)
        );
        setAllMenuItems(filtered);
      }
    });
  }, [eventId]);

  const headerText = useMemo(() => {
    if (!event) return "";
    return `${formatTime(event.time)} · ${formatLongDate(event.date)}`;
  }, [event]);

  // Group items by category, only categories that have items
  const itemsByCategory = CATEGORIES.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    const items = allMenuItems.filter((m) => m.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  // Items with no category or unrecognised category
  const uncategorised = allMenuItems.filter(
    (m) => !CATEGORIES.includes(m.category)
  );

  if (!event) {
    return (
      <main className="min-h-screen bg-[#f7f3ee] px-4 sm:px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-500">Event not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ee]">
      <section className="bg-[#6E3A1B] text-white px-4 sm:px-6 py-16 sm:py-20 relative">
        <button
          style={{ touchAction: "manipulation" }}
          onClick={() => router.back()}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-sm text-[#e2e8e0] hover:opacity-80 min-h-11"
        >
          ← Back
        </button>

        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#d8e2d7] mb-4 break-words">
            {headerText}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight text-[#f4f1ea] break-words">
            {event.title}
          </h1>
          <p className="mt-6 text-[#e2e8e0] text-sm sm:text-base break-words">
            <span className="mr-2">📍</span>{event.location}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-10 sm:py-12 md:py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[#b0a59a] mb-8 sm:mb-10 text-sm">
            Tap any dish to see its ingredients
          </p>

          {allMenuItems.length === 0 ? (
            <div className="border border-[#d6c8b8] rounded-2xl p-6 bg-white text-gray-500">
              No menu items available for this event.
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(itemsByCategory).map(([category, items]) => (
                <div key={category}>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#b07a33] mb-4 pb-2 border-b border-[#e8ddd1]">
                    {category}
                  </p>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <DishCard
                        key={item.id}
                        item={item}
                        isOpen={openItem === item.id}
                        onToggle={() => setOpenItem(openItem === item.id ? null : item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {uncategorised.length > 0 && (
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#b07a33] mb-4 pb-2 border-b border-[#e8ddd1]">
                    Other
                  </p>
                  <div className="space-y-4">
                    {uncategorised.map((item) => (
                      <DishCard
                        key={item.id}
                        item={item}
                        isOpen={openItem === item.id}
                        onToggle={() => setOpenItem(openItem === item.id ? null : item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function DishCard({
  item,
  isOpen,
  onToggle,
}: {
  item: MenuItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      style={{ touchAction: "manipulation" }}
      onClick={onToggle}
      className="w-full text-left border border-[#d6c8b8] rounded-2xl p-4 sm:p-6 bg-white hover:bg-[#fcfaf8] transition"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-[#3b2a22] leading-tight break-words">
            {item.name}
          </h2>
          <p className="text-[#7a6f66] mt-3 text-sm sm:text-base break-words">
            {item.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end md:max-w-[240px]">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap ${tagColors[tag] || "bg-gray-100 text-gray-700"}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="mt-5 pt-4 border-t border-[#e8ddd1]">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8f8276] mb-3">
            Ingredients
          </p>
          <div className="flex flex-wrap gap-2">
            {item.ingredients.length > 0 ? (
              item.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="px-3 py-1 rounded-full text-xs sm:text-sm bg-[#f4efe9] text-[#6E3A1B] border border-[#e5d8cb]"
                >
                  {ing}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No ingredients listed</span>
            )}
          </div>
        </div>
      )}
    </button>
  );
}

function formatTime(time: string) {
  if (!time) return "";
  const [hourStr, minute] = time.split(":");
  const hourNum = Number(hourStr);
  return `${hourNum % 12 || 12}:${minute} ${hourNum >= 12 ? "PM" : "AM"}`;
}

function formatLongDate(dateString: string) {
  if (!dateString) return "";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-CA", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}