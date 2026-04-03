"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  ingredients: string[];
  tags: string[];
};

const tagColors: Record<string, string> = {
  Vegan: "bg-green-100 text-green-700",
  Vegetarian: "bg-lime-100 text-lime-700",
  "Gluten-Free": "bg-yellow-100 text-yellow-700",
  "Dairy-Free": "bg-sky-100 text-sky-700",
  "Nut-Free": "bg-purple-100 text-purple-700",
  Halal: "bg-emerald-100 text-emerald-700",
  Spicy: "bg-red-100 text-red-700",
};

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const loadMenuItems = async () => {
    try {
      const res = await fetch("/api/menu-items", { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to load menu items");
        return;
      }

      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Failed to load menu items:", error);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  const deleteItem = async (id: number) => {
    try {
      const res = await fetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete item.");
        return;
      }

      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete item.");
    }
  };

  return (
    <main className="p-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-[#6E3A1B]">Menu Items</h1>
          <p className="text-gray-500 mt-2">
            {menuItems.length} {menuItems.length === 1 ? "dish" : "dishes"} in your library
          </p>
        </div>

        <Link
          href="/admin/menu/new"
          className="bg-[#6E3A1B] text-white px-5 py-3 rounded-xl hover:opacity-90"
        >
          + New Item
        </Link>
      </div>

      <div className="space-y-4">
        {menuItems.length === 0 ? (
          <div className="border border-[#d6c8b8] rounded-2xl p-6 text-gray-500 bg-white">
            No menu items yet.
          </div>
        ) : (
          menuItems.map((item) => (
            <div
              key={item.id}
              className="border border-[#d6c8b8] rounded-2xl p-6 bg-white"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-medium text-[#3b2a22]">
                  {item.name}
                </h2>

                <p className="text-gray-600">{item.description}</p>

                <p className="text-sm tracking-[0.25em] uppercase text-[#b07a33]">
                  {item.category || "Uncategorized"}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.length > 0 ? (
                    item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-sm ${
                          tagColors[tag] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No dietary flags</span>
                  )}
                </div>

                <div className="border-t border-[#e5d8cb] pt-4 flex justify-between items-center">
                  <p className="text-gray-500">
                    {item.ingredients.length}{" "}
                    {item.ingredients.length === 1 ? "ingredient" : "ingredients"}
                  </p>

                  <div className="flex gap-3">
                    <Link
                      href={`/admin/menu/new?edit=${item.id}`}
                      className="px-4 py-2 rounded-xl border border-[#d6c8b8] text-gray-600 hover:bg-gray-50"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteItem(item.id)}
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