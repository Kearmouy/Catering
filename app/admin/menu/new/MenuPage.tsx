"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type MenuItem = {
  id?: number;
  name: string;
  description: string;
  category: string;
  ingredients: string[];
  tags: string[];
};

export default function MenuPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Main");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const dietaryOptions = ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Nut-Free", "Halal", "Spicy"];
  const categories = ["Starter", "Main", "Side", "Dessert", "Beverage"];

  const isEditing = !!editId;

  useEffect(() => {
    if (!editId) return;

    const loadItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/menu-items/${editId}`);
        if (!res.ok) {
          alert("Could not load menu item.");
          return;
        }

        const item: MenuItem = await res.json();
        setName(item.name || "");
        setDescription(item.description || "");
        setCategory(item.category || "Main");
        setIngredients(item.ingredients || []);
        setSelectedTags(item.tags || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load menu item.");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [editId]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    if (ingredients.includes(trimmed)) {
      setIngredientInput("");
      return;
    }
    setIngredients((prev) => [...prev, trimmed]);
    setIngredientInput("");
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients((prev) =>
      prev.filter((ingredient) => ingredient !== ingredientToRemove)
    );
  };

  const back = () => {
    router.push("/admin/menu");
  };

  const cancel = () => {
    if (!name && !description && ingredients.length === 0 && selectedTags.length === 0) {
      return;
    }

    const confirmClear = window.confirm("Clear all fields?");
    if (!confirmClear) return;

    setName("");
    setDescription("");
    setIngredientInput("");
    setIngredients([]);
    setSelectedTags([]);
  };

  const saveItem = async () => {
    if (!name.trim()) {
      alert("Please enter a dish name.");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      ingredients,
      tags: selectedTags,
    };

    try {
      const res = await fetch(
        isEditing ? `/api/menu-items/${editId}` : "/api/menu-items",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        alert("Failed to save menu item.");
        return;
      }

      router.push("/admin/menu");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save menu item.");
    }
  };

  return (
    <main className="px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#6E3A1B] break-words">
        {isEditing ? "Edit Menu Item" : "Menu Manager"}
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="mb-6 space-y-6 max-w">
          <div className="border p-4 sm:p-6 rounded-2xl space-y-3 bg-white">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-500">
              Dish Details
            </p>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-500 block">
                Dish Name
              </label>
              <input
                className="border border-[#d6c8b8] p-3 rounded-xl w-full outline-none focus:border-[#6E3A1B] text-sm sm:text-base"
                placeholder="e.g. Vanilla Cake"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-gray-500 block">Category</label>
              <select className="border border-[#d6c8b8] p-3 rounded-xl w-full outline-none focus:border-[#6E3A1B]"
                value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2 pt-2 sm:pt-4">
              <label className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-500 block">
                Description
              </label>
              <input
                className="border border-[#d6c8b8] p-3 rounded-xl w-full outline-none focus:border-[#6E3A1B] text-sm sm:text-base"
                placeholder="Brief description of the dish"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-2xl p-4 sm:p-6 space-y-3 bg-white">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-500 block">
              Ingredients
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                className="border border-[#d6c8b8] p-3 rounded-xl w-full outline-none focus:border-[#6E3A1B] text-sm sm:text-base"
                placeholder="Type and press enter"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIngredient();
                  }
                }}
              />

              <button
                type="button"
                onClick={addIngredient}
                className="bg-[#6E3A1B] text-white px-4 py-3 rounded-xl hover:opacity-90 min-h-11 whitespace-nowrap"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-2xl text-sm break-words"
                >
                  <span>{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient)}
                    className="text-gray-500 hover:text-gray-700 shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-2xl p-4 sm:p-6 space-y-3 bg-white">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">
              Dietary Flags
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {dietaryOptions.map((tag) => {
                const isSelected = selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base transition whitespace-nowrap ${
                      isSelected
                        ? "bg-[#6E3A1B] text-white border border-[#6E3A1B]"
                        : "bg-white text-gray-600 border border-[#d6c8b8] hover:bg-gray-100"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
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
                onClick={saveItem}
                className="bg-[#6E3A1B] text-white px-4 py-3 rounded-lg hover:opacity-90 min-h-11 w-full sm:w-auto"
              >
                {isEditing ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}