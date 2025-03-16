import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { teamOrganizers } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(
  request: Request,
  context: unknown,
): Promise<Response> {
  // Narrow the unknown context to our expected type
  const { params } = context as RouteParams;
  const { id } = params;
  const teamId = parseInt(id, 10);
  if (isNaN(teamId)) {
    return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
  }

  const body = await request.json();
  const organizerIds: number[] = body.organizerIds;
  if (!Array.isArray(organizerIds)) {
    return NextResponse.json(
      { error: "Invalid organizer IDs" },
      { status: 400 },
    );
  }

  const client = createClient({
    url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
  });
  const db = drizzle(client);

  // Delete existing mappings for the team
  await db.delete(teamOrganizers).where(eq(teamOrganizers.team_id, teamId));

  // Insert new mappings if any organizer IDs are provided
  if (organizerIds.length > 0) {
    const insertData = organizerIds.map((organizerId) => ({
      team_id: teamId,
      organizer_id: organizerId,
    }));
    await db.insert(teamOrganizers).values(insertData);
  }

  await client.close();

  return NextResponse.json({
    success: true,
    message: "Team organizers updated successfully",
  });
}
