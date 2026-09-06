import { styles } from "@/styles/site.stylex";
import { styleClass } from "@/styles/classes";
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
    <div className={styleClass("componentsDashboardLayoutStyle1")}>
      {/* Desktop Sidebar */}
      <div className={styleClass("componentsDashboardLayoutStyle2")}>
        <div className={styleClass("componentsDashboardLayoutStyle3")}>
          <div className={styleClass("componentsDashboardLayoutStyle4")}>I</div>
          <h1 className={styleClass("componentsDashboardLayoutStyle5")}>
            Indomitus
          </h1>
        </div>

        <nav className={styleClass("appAdminTeamsIdPageStyle25")}>
          <Link href={isAdmin ? "/admin/dashboard" : "/organizer/dashboard"}>
            <Button
              variant="ghost"
              xstyle={styles.componentsDashboardLayoutStyle7}
              className="sx-componentsDashboardLayoutStyle7"
            >
              <LayoutDashboard
                className={styleClass("componentsDashboardLayoutStyle8")}
              />
              Dashboard
            </Button>
          </Link>

          <Link href={isAdmin ? "/admin/teams" : "/organizer/teams"}>
            <Button
              variant="ghost"
              xstyle={styles.componentsDashboardLayoutStyle7}
              className="sx-componentsDashboardLayoutStyle7"
            >
              <Users
                className={styleClass("componentsDashboardLayoutStyle8")}
              />
              Teams
            </Button>
          </Link>

          <Link
            href={isAdmin ? "/admin/participants" : "/organizer/participants"}
          >
            <Button
              variant="ghost"
              xstyle={styles.componentsDashboardLayoutStyle7}
              className="sx-componentsDashboardLayoutStyle7"
            >
              <User className={styleClass("componentsDashboardLayoutStyle8")} />
              Participants
            </Button>
          </Link>

          {isAdmin && (
            <Link href="/admin/organizers">
              <Button
                variant="ghost"
                xstyle={styles.componentsDashboardLayoutStyle7}
                className="sx-componentsDashboardLayoutStyle7"
              >
                <UserPlus
                  className={styleClass("componentsDashboardLayoutStyle8")}
                />
                Organizers
              </Button>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/rooms">
              <Button
                variant="ghost"
                xstyle={styles.componentsDashboardLayoutStyle7}
                className="sx-componentsDashboardLayoutStyle7"
              >
                <Home
                  className={styleClass("componentsDashboardLayoutStyle8")}
                />
                Rooms
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            xstyle={styles.componentsDashboardLayoutStyle7}
            className="sx-componentsDashboardLayoutStyle7"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <>
                <Sun
                  className={styleClass("componentsDashboardLayoutStyle8")}
                />
                Light Mode
              </>
            ) : (
              <>
                <Moon
                  className={styleClass("componentsDashboardLayoutStyle8")}
                />
                Dark Mode
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            xstyle={styles.componentsDashboardLayoutStyle20}
            className="sx-componentsDashboardLayoutStyle20 ui-text-defined"
            onClick={handleLogout}
          >
            <LogOut className={styleClass("componentsDashboardLayoutStyle8")} />
            Logout
          </Button>
        </nav>
      </div>

      <div className={styleClass("componentsDashboardLayoutStyle22")}>
        <Button onClick={() => setMobileNavOpen(true)}>
          <Menu className={styleClass("componentsDashboardLayoutStyle23")} />
        </Button>
      </div>

      {mobileNavOpen && (
        <div className={styleClass("componentsDashboardLayoutStyle24")}>
          <div className={styleClass("componentsDashboardLayoutStyle25")}>
            <div className={styleClass("componentsDashboardLayoutStyle26")}>
              <h1 className={styleClass("componentsDashboardLayoutStyle5")}>
                Indomitus
              </h1>
              <Button variant="ghost" onClick={() => setMobileNavOpen(false)}>
                <XIcon
                  className={styleClass("componentsDashboardLayoutStyle23")}
                />
              </Button>
            </div>
            <nav className={styleClass("appAdminTeamsIdPageStyle25")}>
              <Link
                href={isAdmin ? "/admin/dashboard" : "/organizer/dashboard"}
              >
                <Button
                  variant="ghost"
                  xstyle={styles.componentsDashboardLayoutStyle7}
                  className="sx-componentsDashboardLayoutStyle7"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <LayoutDashboard
                    className={styleClass("componentsDashboardLayoutStyle8")}
                  />
                  Dashboard
                </Button>
              </Link>
              <Link href={isAdmin ? "/admin/teams" : "/organizer/teams"}>
                <Button
                  variant="ghost"
                  xstyle={styles.componentsDashboardLayoutStyle7}
                  className="sx-componentsDashboardLayoutStyle7"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <Users
                    className={styleClass("componentsDashboardLayoutStyle8")}
                  />
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
                  xstyle={styles.componentsDashboardLayoutStyle7}
                  className="sx-componentsDashboardLayoutStyle7"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <User
                    className={styleClass("componentsDashboardLayoutStyle8")}
                  />
                  Participants
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin/organizers">
                  <Button
                    variant="ghost"
                    xstyle={styles.componentsDashboardLayoutStyle7}
                    className="sx-componentsDashboardLayoutStyle7"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <UserPlus
                      className={styleClass("componentsDashboardLayoutStyle8")}
                    />
                    Organizers
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin/rooms">
                  <Button
                    variant="ghost"
                    xstyle={styles.componentsDashboardLayoutStyle7}
                    className="sx-componentsDashboardLayoutStyle7"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Home
                      className={styleClass("componentsDashboardLayoutStyle8")}
                    />
                    Rooms
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                xstyle={styles.componentsDashboardLayoutStyle7}
                className="sx-componentsDashboardLayoutStyle7"
                onClick={toggleDarkMode}
              >
                {darkMode ? (
                  <>
                    <Sun
                      className={styleClass("componentsDashboardLayoutStyle8")}
                    />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon
                      className={styleClass("componentsDashboardLayoutStyle8")}
                    />
                    Dark Mode
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                xstyle={styles.componentsDashboardLayoutStyle20}
                className="sx-componentsDashboardLayoutStyle20 ui-text-defined"
                onClick={() => {
                  setMobileNavOpen(false);
                  handleLogout();
                }}
              >
                <LogOut
                  className={styleClass("componentsDashboardLayoutStyle8")}
                />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={styleClass("componentsDashboardLayoutStyle45")}>
        {/* Header */}
        <header className={styleClass("componentsDashboardLayoutStyle46")}>
          <div className={styleClass("appAdminDashboardPageStyle3")}>
            <h1 className={styleClass("componentsDashboardLayoutStyle48")}>
              Dashboard
            </h1>
            <div className={styleClass("componentsDashboardLayoutStyle49")}>
              <span className={styleClass("componentsDashboardLayoutStyle50")}>
                Welcome, {userName}
              </span>
              <div className={styleClass("componentsDashboardLayoutStyle51")}>
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className={styleClass("componentsDashboardLayoutStyle52")}>
          {children}
        </main>
      </div>
    </div>
  );
}
