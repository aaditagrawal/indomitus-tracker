import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  LogOut,
  Home,
  User,
  Menu,
  X as XIcon,
  Sun, // Added Sun icon
  Moon, // Added Moon icon
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "SUPERADMIN" | "ADMIN" | "ORGANIZER";
  userName: string;
}

export function DashboardLayout({
  children,
  userRole,
  userName,
}: DashboardLayoutProps) {
  const isAdmin = userRole === "ADMIN" || userRole === "SUPERADMIN";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Changed to boolean

  useEffect(() => {
    // Check local storage for existing theme
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme === "dark"; //convert string to boolean
    setDarkMode(initialTheme);
  }, []);

  useEffect(() => {
    // Apply dark mode class to the HTML element
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle the boolean
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-sidebar border-r border-sidebar-border p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-white font-bold">
            I
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Indomitus
          </h1>
        </div>

        <nav className="space-y-2">
          <Link href={isAdmin ? "/admin/dashboard" : "/organizer/dashboard"}>
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>

          <Link href={isAdmin ? "/admin/teams" : "/organizer/teams"}>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-5 w-5" />
              Teams
            </Button>
          </Link>

          <Link
            href={isAdmin ? "/admin/participants" : "/organizer/participants"}
          >
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-5 w-5" />
              Participants
            </Button>
          </Link>

          {isAdmin && (
            <Link href="/admin/organizers">
              <Button variant="ghost" className="w-full justify-start">
                <UserPlus className="mr-2 h-5 w-5" />
                Organizers
              </Button>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/rooms">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-5 w-5" />
                Rooms
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <>
                <Sun className="mr-2 h-5 w-5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-5 w-5" />
                Dark Mode
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </nav>
      </div>

      <div className="fixed top-4 left-4 md:hidden z-50">
        <Button onClick={() => setMobileNavOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden">
          <div className="w-64 bg-sidebar h-full p-4">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-sidebar-foreground">
                Indomitus
              </h1>
              <Button variant="ghost" onClick={() => setMobileNavOpen(false)}>
                <XIcon className="h-6 w-6" />
              </Button>
            </div>
            <nav className="space-y-2">
              <Link
                href={isAdmin ? "/admin/dashboard" : "/organizer/dashboard"}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
              <Link href={isAdmin ? "/admin/teams" : "/organizer/teams"}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Teams
                </Button>
              </Link>
              <Link
                href={
                  isAdmin ? "/admin/participants" : "/organizer/participants"
                }
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <User className="mr-2 h-5 w-5" />
                  Participants
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin/organizers">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Organizers
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin/rooms">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Rooms
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={toggleDarkMode}
              >
                {darkMode ? (
                  <>
                    <Sun className="mr-2 h-5 w-5" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-5 w-5" />
                    Dark Mode
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => {
                  setMobileNavOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Welcome, {userName}
              </span>
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
