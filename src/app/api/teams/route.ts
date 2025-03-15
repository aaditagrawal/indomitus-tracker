import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { teams, rooms, participants } from "@/db/schema";

// GET method already defined above

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { teamName, roomId, participants: teamParticipants } = data;

    // Find team leader
    const leaderIndex = teamParticipants.findIndex((p) => p.isLeader);

    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Start a transaction
    const result = await db.transaction(async (tx) => {
      // Create the team first
      const teamResult = await tx
        .insert(teams)
        .values({
          team_name: teamName,
          room_id: parseInt(roomId),
          // Set team_leader_id to null initially, will update after creating participants
          team_leader_id: null,
        })
        .returning();

      const teamId = teamResult[0].team_id;

      // Create all participants
      const participantPromises = teamParticipants.map(async (p) => {
        return await tx
          .insert(participants)
          .values({
            name: p.name,
            email: p.email || null,
            phone_number: p.phone || null,
            college: p.college || null,
            team_id: teamId,
          })
          .returning();
      });

      const createdParticipants = await Promise.all(participantPromises);

      // Update team with leader ID if a leader was designated
      if (leaderIndex !== -1) {
        const leaderId = createdParticipants[leaderIndex][0].participant_id;
        await tx
          .update(teams)
          .set({ team_leader_id: leaderId })
          .where(eq(teams.team_id, teamId));
      }

      return {
        teamId,
        message: "Team created successfully",
      };
    });

    await client.close();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 },
    );
  }
}
