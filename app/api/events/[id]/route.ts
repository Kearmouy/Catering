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
      SELECT id, title, date, time, location, selectedMenuItems
      FROM events
      WHERE id = ?
      `
    )
    .get(id) as
    | {
        id: string;
        title: string;
        date: string;
        time: string;
        location: string;
        selectedMenuItems: string;
      }
    | undefined;

  if (!row) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time,
    location: row.location,
    selectedMenuItems: JSON.parse(row.selectedMenuItems || "[]"),
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
    UPDATE events
    SET title = ?, date = ?, time = ?, location = ?, selectedMenuItems = ?
    WHERE id = ?
    `
  ).run(
    body.title,
    body.date,
    body.time,
    body.location,
    JSON.stringify(body.selectedMenuItems || []),
    id
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  db.prepare(`DELETE FROM events WHERE id = ?`).run(id);

  return NextResponse.json({ success: true });
}