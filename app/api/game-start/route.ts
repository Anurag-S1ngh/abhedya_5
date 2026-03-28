import { NextResponse } from "next/server"

// Set your game start date/time here (ISO 8601)
const GAME_START = new Date("2026-04-01T18:00:00+05:30")

export async function GET() {
  return NextResponse.json({ startTime: GAME_START.toISOString() })
}
