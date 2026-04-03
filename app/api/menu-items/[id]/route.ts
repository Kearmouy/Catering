import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const row = db
    .prepare(
      `
      SELECT id, name, description, category, ingredients, tags
      FROM menu_items
      WHERE id = ?
      `
    )
    .get(id) as
    | {
        id: string;
        name: string;
        description: string;
        category: string;
        ingredients: string;
        tags: string;
      }
    | undefined;

  if (!row) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    category: row.category ?? "",
    ingredients: JSON.parse(row.ingredients || "[]"),
    tags: JSON.parse(row.tags || "[]"),
  });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  db.prepare(
    `
    UPDATE menu_items
    SET name = ?, description = ?, category = ?, ingredients = ?, tags = ?
    WHERE id = ?
    `
  ).run(
    body.name,
    body.description || "",
    body.category || "",
    JSON.stringify(body.ingredients || []),
    JSON.stringify(body.tags || []),
    id
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  db.prepare(`DELETE FROM menu_items WHERE id = ?`).run(id);

  return NextResponse.json({ success: true });
}