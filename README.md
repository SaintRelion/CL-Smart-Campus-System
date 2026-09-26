# Smart Campus Frontend

React/Vite frontend for the **Smart Campus** system. It provides the browser interface for authentication, instructor administration, class scheduling, attendance tracking, and role-specific workflows.

## Key features

- **WebAuthn / passkey authentication** — device-based authentication with email OTP during initial security enrollment.
- **Class and schedule management** — create and manage classes by semester, year, day, room, and time, with validation for overlapping schedules.
- **GPS attendance tracking** — records live instructor geolocation paths during attendance sessions and displays previous sessions on a map.
- **Attendance coverage** — compares attendance sessions against scheduled classes and provides daily/session history.
- **Role-based workflows** — separate access and views for administrators, instructors, and part-time instructors.
- **Instructor administration** — administrators can register and manage instructor accounts.

## Screenshots

> Screenshots will be added after the local environment is restored.

<!-- Suggested screenshots:
1. Login / WebAuthn enrollment
2. Main dashboard
3. Class and schedule management
4. Live GPS attendance
5. Attendance history / map
6. Instructor administration
-->

## Technology stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Router
- Firebase / Firestore
- SaintRelion client libraries
- Nginx for the Docker frontend

Firebase is currently used as the fast development/testing data provider. The client architecture can also use the API provider for a server-mediated setup.

## Access to private dependencies

This project depends on private `@saintrelion/*` packages. Required access tokens are **not included in the repository**.

Contact the developer for the required package access before building the project.

## Run Smart Campus

The complete application is started from the sibling **Django-SmartCampus** repository, which owns the Docker Compose configuration.

Keep the two repositories beside each other:

```text
SmartCampus/
├── CL-Smart-Campus-System/
└── Django-SmartCampus/
```

Configure this frontend using its provided `.env.example`, then configure the backend as described in the Django-SmartCampus README.

From `Django-SmartCampus`:

```powershell
docker compose up -d --build
```

The Docker frontend is then available at:

```text
http://localhost:8080
```

The frontend `.env` is used during the Vite build and is not copied into the final Nginx image.

## First administrator

For a fresh/restored installation, open:

```text
/setup-admin
```

Create the first administrator, then sign in through `/login`. The application handles the existing email OTP and WebAuthn/passkey enrollment flow.

After the first administrator has been created, remove or disable the temporary `/setup-admin` route before public deployment.

## Firebase and client configuration

Use `.env.example` as the reference for the frontend values that need to be configured.

`VITE_*` values are compiled into the browser application. Do not place server credentials, GitHub tokens, database passwords, Firebase Admin credentials, or other private server secrets in them.

If Firebase is used beyond private development, configure appropriate Firebase Authentication and Firestore Security Rules. Permissive development rules should not be used for a public deployment.

## Local setup

This section is only needed when running the frontend directly instead of through Docker.

Requirements:

- Node.js 22
- pnpm / Corepack
- Access to the private `@saintrelion/*` GitHub Packages
- The required frontend configuration from `.env.example`

Keep the repository `.npmrc` pointed at GitHub Packages and configure your package token locally:

```powershell
pnpm config set --global "//npm.pkg.github.com/:_authToken" "YOUR_TOKEN"
```

Then:

```powershell
corepack enable
pnpm install
pnpm dev
```

The local Vite development server runs separately from the Docker frontend. When using WebAuthn locally, make sure the backend `ORIGIN` matches the frontend's local origin.

## Author

**June Aurelius Jacinto**  
Full-Stack Software Developer

GitHub: https://github.com/SaintRelion
