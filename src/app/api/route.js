import { NextResponse } from "next/server";

export async function GET() {
  // 从 public 目录获取 JSON
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/leetcode.json`);
  const data = await res.json();

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const question = data[today] || null;

  return NextResponse.json({ date: today, question });
}
