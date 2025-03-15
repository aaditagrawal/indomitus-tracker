A web application built with Next.js, Drizzle ORM, and Turso for managing teams, participants, organizers, and rooms for events.

## Features

-   **User Authentication:** Secure login system with different roles (SUPERADMIN, ADMIN, ORGANIZER).
-   **Admin Dashboard:** A central hub for SUPERADMIN and ADMIN roles to manage organizers, teams, rooms, and view statistics.
-   **Organizer Dashboard:** Dedicated dashboard for organizers to manage teams and participants.
-   **Team Management:** Add, view, edit, and delete teams with team member information (name, email, phone, college, gender, discord ID).
-   **Participant Management:** Search, view, and manage participants across all teams.
-   **Room Management:** Create, edit, and delete rooms for events.
-   **Organizer Management:** Add, view, and delete organizers with different roles (ADMIN and ORGANIZER).
-   **Dashboard Statistics:** Real-time overview of total teams and participants.
-   **Data Table:** Display data using the `react-table` library.
-   **UI Components:** Utilizes Radix UI and `class-variance-authority` for a consistent and customizable user interface.

## Technologies Used

-   **Next.js:** React framework for building performant web applications.
-   **TypeScript:** Provides static typing for enhanced code quality and maintainability.
-   **Drizzle ORM:** Lightweight and type-safe ORM for interacting with the database.
-   **Turso:** Distributed SQLite database for storing application data.
-   **Radix UI:** Unstyled, accessible UI components for building user interfaces.
-   **tailwindcss:** Utility-first CSS framework for rapidly styling web pages.
-   **class-variance-authority (cva):**  A utility for managing component variants with ease.
-   **lucide-react:** Beautifully simple, pixel-perfect icons.
-   **zod:** TypeScript-first schema validation with static types.
-   **react-hook-form:**  Performant, flexible and extensible forms with easy-to-use validation.
-   **cmdk (cmdk-ui):** Fast, composable, unstyled command menu for React.
-   **bcrypt:** For securely hashing and verifying user passwords.

## Getting Started

### Prerequisites

-   Node.js (version 18 or higher recommended)
-   npm or yarn package manager
-   Turso CLI (optional, for local development)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd indomitus-tracker
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or yarn install
    ```

3.  **Set up your environment variables:**

    -   Create a `.env` file in the root directory.
    -   Add the following variables:

        ```
        DB_FILE_NAME="./indomitus.db"  # Path to your SQLite database file
        ```

4.  **Initialize the database:**

    ```bash
    npm run init-db
    ```

    This command will:
        - Create a new SQLite database file at the path specified in `DB_FILE_NAME`.
        - Define the database schema (tables, columns, etc.).
        - Seed the database with an initial superadmin user (`superadmin@indomitus.com` with password `superadmin123`).  **Be sure to change this password after logging in!**

### Running the Application

```bash
npm run dev  # or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Database Initialization Script Details (`scripts/init-db.ts`)

The `init-db.ts` script is responsible for:

-   **Creating a new SQLite database file:**  It ensures that if a database file already exists at the specified path, it is deleted to start with a clean slate.  A new file is then created.
-   **Defining the database schema:**  The script directly executes SQL commands to create the necessary tables based on the schema defined in `src/db/schema.ts`.  This ensures the database has all required tables with the correct columns and constraints.
-   **Seeding the database with an initial superadmin user:**  An administrative account (`superadmin@indomitus.com`) is created with a default password (`superadmin123`). It is **crucial** to change this password immediately after the initial login.  Failing to do so presents a significant security risk.

**Important Security Note:**
The initial superadmin user is created with a default password for simplicity. **It is extremely important that you change this password immediately after first logging in to prevent unauthorized access.**  This is a vital step to secure your application.

## File Structure

```
indomitus-tracker/
├── src/
│   ├── app/                       # Next.js application routes and pages
│   │   ├── admin/                 # Admin-specific pages
│   │   │   ├── dashboard/
│   │   │   ├── organizers/
│   │   │   ├── participants/
│   │   │   ├── rooms/
│   │   │   ├── teams/
│   │   ├── api/                   # API endpoints
│   │   ├── login/                 # Login page
│   │   ├── organizer/             # Organizer-specific pages
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   ├── components/              # Reusable React components
│   ├── db/                      # Database schema definitions
│   │   ├── schema.ts
│   ├── lib/                     # Utility functions (auth, utils)
│   ├── styles/                  # Global CSS styles
│   ├── scripts/                 # Initialization scripts (init-db.ts)
├── .env                         # Environment variables
├── README.md                    # This file
├── ...
```

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes.
4.  Test your changes thoroughly.
5.  Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
```
