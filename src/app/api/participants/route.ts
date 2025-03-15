import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { participants, teams, rooms } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query") || "";

    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Build complex query to get all participant data with their team and room information
    const query = db
      .select({
        participant_id: participants.participant_id,
        name: participants.name,
        email: participants.email,
        phone_number: participants.phone_number,
        college: participants.college,
        gender: participants.gender,
        discord_id: participants.discord_id,
        is_leader: sql<boolean>`${participants.participant_id} = ${teams.team_leader_id}`,
        team_id: teams.team_id,
        team_name: teams.team_name,
        room_id: rooms.room_id,
        room_name: rooms.room_name,
      })
      .from(participants)
      .innerJoin(teams, eq(participants.team_id, teams.team_id))
      .innerJoin(rooms, eq(teams.room_id, rooms.room_id));

    // If there's a search query, add search conditions
    let participantsData;
    if (searchQuery) {
      participantsData = await query.where(
        sql`
            ${participants.name} LIKE ${"%" + searchQuery + "%"} OR
            ${participants.email} LIKE ${"%" + searchQuery + "%"} OR
            ${participants.phone_number} LIKE ${"%" + searchQuery + "%"} OR
            ${participants.college} LIKE ${"%" + searchQuery + "%"} OR
            ${participants.gender} LIKE ${"%" + searchQuery + "%"} OR
            ${participants.discord_id} LIKE ${"%" + searchQuery + "%"} OR
            ${teams.team_name} LIKE ${"%" + searchQuery + "%"} OR
            ${rooms.room_name} LIKE ${"%" + searchQuery + "%"}
          `,
      );
    } else {
      participantsData = await query;
    }

    await client.close();

    return NextResponse.json(participantsData);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 },
    );
  }
}
