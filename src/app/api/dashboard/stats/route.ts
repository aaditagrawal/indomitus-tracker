// src/app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { teams, participants } from "@/db/schema";
import { count } from "drizzle-orm";

export async function GET() {
  try {
    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Get total teams count
    const teamsResult = await db.select({ count: count() }).from(teams);
    const totalTeams = teamsResult[0].count || 0;

    // Get total participants count
    const participantsResult = await db
      .select({ count: count() })
      .from(participants);
    const totalParticipants = participantsResult[0].count || 0;

    await client.close();

    return NextResponse.json({
      totalTeams,
      totalParticipants,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}
