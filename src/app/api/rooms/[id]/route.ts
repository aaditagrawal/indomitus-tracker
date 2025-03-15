import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { rooms, teams } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const roomId = parseInt(params.id);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
    }

    const { roomName } = await request.json();
    if (!roomName) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 },
      );
    }

    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    const result = await db
      .update(rooms)
      .set({ room_name: roomName })
      .where(eq(rooms.room_id, roomId))
      .returning();

    await client.close();

    if (result.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const roomId = parseInt(params.id);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
    }

    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Check if the room is in use by any teams
    const teamsUsingRoom = await db
      .select({ count: sql`count(*)` })
      .from(teams)
      .where(eq(teams.room_id, roomId));

    if (teamsUsingRoom[0].count > 0) {
      await client.close();
      return NextResponse.json(
        { error: "Cannot delete room that is assigned to teams" },
        { status: 400 },
      );
    }

    // Delete the room
    const result = await db
      .delete(rooms)
      .where(eq(rooms.room_id, roomId))
      .returning();

    await client.close();

    if (result.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 },
    );
  }
}
