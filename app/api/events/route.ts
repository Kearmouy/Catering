import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";

export async function GET() {
  const rows = db
    .prepare(
      `
      SELECT id, title, date, time, location, selectedMenuItems
      FROM events
      ORDER BY date ASC, time ASC
      `
    )
    .all() as {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    selectedMenuItems: string;
  }[];

  return NextResponse.json(
    rows.map((row) => ({
      id: row.id,
      title: row.title,
      date: row.date,
      time: row.time,
      location: row.location,
      selectedMenuItems: JSON.parse(row.selectedMenuItems || "[]"),
    }))
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = randomUUID();

  db.prepare(
    `
    INSERT INTO events (id, title, date, time, location, selectedMenuItems)
    VALUES (?, ?, ?, ?, ?, ?)
    `
  ).run(
    id,
    body.title,
    body.date,
    body.time,
    body.location,
    JSON.stringify(body.selectedMenuItems || [])
  );

  return NextResponse.json({ success: true, id });
}