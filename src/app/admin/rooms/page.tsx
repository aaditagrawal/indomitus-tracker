"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Room {
  room_id: number;
  room_name: string;
}

export default function RoomsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "ADMIN" && parsedUser.role !== "SUPERADMIN") {
      router.push("/login");
      return;
    }

    setUser(parsedUser);

    // Fetch rooms
    fetchRooms();
  }, [router]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/rooms");
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName: newRoomName }),
      });

      if (!response.ok) throw new Error("Failed to create room");

      // Refresh rooms list and close dialog
      fetchRooms();
      setNewRoomName("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleEditRoom = async () => {
    if (!editingRoom || !newRoomName.trim()) return;

    try {
      const response = await fetch(`/api/rooms/${editingRoom.room_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName: newRoomName }),
      });

      if (!response.ok) throw new Error("Failed to update room");

      // Refresh rooms list and close dialog
      fetchRooms();
      setNewRoomName("");
      setEditingRoom(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete room");

      // Refresh rooms list
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const openAddDialog = () => {
    setEditingRoom(null);
    setNewRoomName("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setNewRoomName(room.room_name);
    setIsDialogOpen(true);
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout
      userRole={user.role as "ADMIN" | "SUPERADMIN"}
      userName={user.email.split("@")[0]}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Rooms</h2>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room ID</TableHead>
                <TableHead>Room Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    Loading rooms...
                  </TableCell>
                </TableRow>
              ) : rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    No rooms found. Add your first room.
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow key={room.room_id}>
                    <TableCell>{room.room_id}</TableCell>
                    <TableCell className="font-medium">
                      {room.room_name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(room)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRoom(room.room_id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? "Edit Room" : "Add New Room"}
              </DialogTitle>
              <DialogDescription>
                {editingRoom
                  ? "Update the room details below."
                  : "Enter the name for the new room."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingRoom ? handleEditRoom : handleAddRoom}>
                {editingRoom ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
