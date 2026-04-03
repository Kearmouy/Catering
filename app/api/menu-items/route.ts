import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";

export async function GET() {
  const rows = db
    .prepare(
      `
      SELECT id, name, description, category, ingredients, tags
      FROM menu_items
      ORDER BY name ASC
      `
    )
    .all() as {
    id: string;
    name: string;
    description: string;
    category: string;
    ingredients: string;
    tags: string;
  }[];

  return NextResponse.json(
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? "",
      category: row.category ?? "",
      ingredients: JSON.parse(row.ingredients || "[]"),
      tags: JSON.parse(row.tags || "[]"),
    }))
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = randomUUID();

  db.prepare(
    `
    INSERT INTO menu_items (id, name, description, category, ingredients, tags)
    VALUES (?, ?, ?, ?, ?, ?)
    `
  ).run(
    id,
    body.name,
    body.description || "",
    body.category || "",
    JSON.stringify(body.ingredients || []),
    JSON.stringify(body.tags || [])
  );

  return NextResponse.json({ success: true, id });
}