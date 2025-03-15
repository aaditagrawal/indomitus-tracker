import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { teams, rooms, participants } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET method to fetch team details
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const teamId = parseInt(params.id);

    if (isNaN(teamId)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Get team data with room name
    const teamData = await db
      .select({
        team_id: teams.team_id,
        team_name: teams.team_name,
        room_id: teams.room_id,
        room_name: rooms.room_name,
        team_leader_id: teams.team_leader_id,
      })
      .from(teams)
      .leftJoin(rooms, eq(teams.room_id, rooms.room_id))
      .where(eq(teams.team_id, teamId));

    if (teamData.length === 0) {
      await client.close();
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Get participants for this team
    const teamParticipants = await db
      .select({
        participant_id: participants.participant_id,
        name: participants.name,
        email: participants.email,
        phone_number: participants.phone_number,
        college: participants.college,
      })
      .from(participants)
      .where(eq(participants.team_id, teamId));

    // Mark the team leader
    const participantsWithLeader = teamParticipants.map((participant) => ({
      ...participant,
      is_leader: participant.participant_id === teamData[0].team_leader_id,
    }));

    // Combine team and participants data
    const result = {
      ...teamData[0],
      participants: participantsWithLeader,
    };

    await client.close();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json(
      { error: "Failed to fetch team details" },
      { status: 500 },
    );
  }
}
