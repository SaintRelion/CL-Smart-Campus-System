# Smart Campus Frontend

React/Vite frontend for the Smart Campus system. It uses the SaintRelion
client libraries and currently uses Firebase as the fast
development/testing data provider.

## Stack

React 19, TypeScript, Vite, Firebase/Firestore, SaintRelion libraries,
Tailwind CSS, TanStack Query, React Router, and Nginx for Docker.

## Access to private dependencies

This project depends on private SaintRelion packages. The required access keys/tokens are **not included in this repository**.

If you need access to build or run the project, please contact the developer to request the required keys.

## Setup

Requirements: Node.js 22, pnpm/Corepack, access to the private
`@saintrelion/*` GitHub Packages, and your own Firebase project.

Keep the project `.npmrc` as:

``` ini
@saintrelion:registry=https://npm.pkg.github.com
```

Configure your GitHub Packages token locally:

``` bash
pnpm config set --global "//npm.pkg.github.com/:_authToken" "YOUR_TOKEN"
```

Copy `.env.example` to `.env` and provide your own values:

``` env
VITE_API_URL=http://localhost:8000/

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Then:

``` bash
corepack enable
pnpm install
pnpm dev
```

`.env` is untracked. Each developer should use their own environment
configuration.

## Firebase note

Firebase is used here primarily for rapid development/testing. This
project may use permissive Firestore rules during private development;
**`allow all` rules must not be used for a public production
deployment.**

The Firebase client SDK can be used in production with properly
configured Firebase Authentication and Firestore Security Rules.
Alternatively, migrate data access to the API provider for a
server-mediated production setup.

`VITE_*` values are compiled into the browser application, so never
place private server credentials, GitHub tokens, database passwords,
Firebase Admin credentials, or other secrets in them.

## First administrator

For a fresh/restored installation, open:

``` text
/setup-admin
```

Create the first administrator, then sign in through `/login`. The
existing application flow will handle email OTP and fingerprint/WebAuthn
enrollment.

After the first administrator is created, remove the temporary bootstrap
page and route:

``` text
src/pages/authentication/SetupAdmin.tsx
```

and remove the `/setup-admin` import/route from `src/navigations.tsx`.

Do not leave the bootstrap route enabled on a public deployment.

## Docker

The complete application is run from the sibling **Django-SmartCampus**
repository, where `docker-compose.yml` is stored.

Expected layout:

``` text
SmartCampus/
├── CL-Smart-Campus-System/
└── Django-SmartCampus/
```

The Docker build reads this repository's `.env` temporarily during the
Vite build; the `.env` file itself is not copied into the final Nginx
image.

See the backend README for the one-command full-stack Docker setup.
