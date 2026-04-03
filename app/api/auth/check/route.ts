import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  const isAdmin = token?.value === process.env.ADMIN_TOKEN;
  return NextResponse.json({ isAdmin });
}