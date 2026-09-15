# HostelFix — Hostel Complaint Management System

HostelFix is a full-stack web application that lets hostel students raise maintenance
complaints (electrical, plumbing, internet, furniture, cleanliness, water and other issues),
attach a photo of the problem, and follow the complaint until it is resolved. Wardens and
admins triage every complaint from a single dashboard, assign maintenance staff, add
remarks and track resolution performance through charts.

Live preview: https://id-preview--977442ce-b91b-4acc-a56b-dae39855ff7f.lovable.app

## Features

- Email/password authentication with two roles: **student** and **admin**
- Students raise complaints with title, description, category, block, room number and an image
- Complaint timeline with four states: pending, in progress, resolved, rejected
- Students may edit or delete their own complaint while it is still pending
- Admins update status, assign maintenance staff and post official remarks
- Search, filter (category, status, block, date) and paginated complaint list
- Analytics dashboard with bar and pie charts plus a resolution-rate summary
- Admin-only student directory with contact details and complaint counts
- Private image storage: photos are readable only by their owner and admins
- Glassmorphism UI, dark/light themes and Framer Motion animations

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start v1 (React 19, file-based routing, server functions) |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4, shadcn-style UI kit, Framer Motion (`motion`) |
| Data / charts | TanStack Query, Recharts |
| Backend | Lovable Cloud — PostgreSQL, authentication, row-level security, object storage |
| Validation | Zod + React Hook Form |
| Tests | Vitest (+ v8 coverage) |
| CI/CD | GitHub Actions (`.github/workflows/ci.yml`) and Jenkins (`Jenkinsfile`) |

## Getting started

Requirements: Node.js 20 or newer and npm.

```sh
# After cloning this repository from its GitHub page, enter the cloned folder.
cd project
npm install
npm run dev
```

Use the **Code** button on the GitHub repository page to copy its exact clone command.

The app starts on http://localhost:8080.

### Environment variables

Create a `.env` file in the project root:

```sh
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

These are publishable client values, safe to expose in the browser. No private keys are
stored in this repository, and `.env` is listed in `.gitignore`.

## npm scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the whole project |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ci` | Run tests with a coverage report (used by CI) |
| `npm run format` | Format the codebase with Prettier |

## Project structure

```
.github/workflows/ci.yml   GitHub Actions pipeline (lint, test, build)
Jenkinsfile                Jenkins declarative pipeline
src/routes/                File-based routes (public pages + _authenticated area)
src/components/            Layout and shared UI kit
src/lib/                   Auth context, theme, domain constants, pure helpers
src/lib/__tests__/         Vitest unit tests
src/integrations/          Generated backend client and types
supabase/migrations/       Database schema, policies and storage setup
vitest.config.ts           Test runner configuration
```

## Data model

- **profiles** — one row per user: name, email, phone, hostel block, room number
- **user_roles** — role per user (`admin` / `student`), stored separately to prevent privilege escalation
- **complaints** — title, description, category, block, room, image path, status, assigned staff, remarks, timestamps

Row-level security policies let a student read and write only their own rows, while admins
have full access. A database trigger creates a profile automatically when a user signs up.

## Testing

```sh
npm run test        # run once
npm run test:ci     # run with coverage
```

Unit tests cover the complaint filtering, statistics, category grouping, pagination and
storage-path helpers in `src/lib/complaint-utils.ts`, plus the class-merging utility and the
domain constants. Every test runs on each push and pull request through GitHub Actions.
All automated tests are executed using Vitest with coverage reporting.


## Continuous integration

`.github/workflows/ci.yml` runs on every push, on pull requests targeting `main` and on
manual dispatch. Stages: checkout → install → lint → test with coverage → production build →
upload the coverage artifact. A red pipeline blocks the merge until it is fixed.

## Jenkins pipeline

`Jenkinsfile` defines a declarative pipeline with Checkout, Install, Lint, Test, Build and
Archive stages. It expects a Jenkins NodeJS tool installation named `node20`.

To run it locally:

1. Install Jenkins and the *NodeJS*, *Pipeline* and *Git* plugins.
2. In *Manage Jenkins → Tools*, add a NodeJS installation named `node20`.
3. Create a new *Pipeline* job, choose *Pipeline script from SCM*, point it at this
   repository and leave the script path as `Jenkinsfile`.
4. Build now. The Test stage runs the same Vitest suite as GitHub Actions, and the Build
   stage archives the compiled output.

## Branching and pull request workflow

- `main` — always deployable; changes only arrive through merged pull requests
- `develop` — integration branch for the current milestone
- `feature/<short-name>` — one branch per feature, e.g. `feature/complaint-filters`
- `fix/<short-name>` — bug fixes

Every pull request describes what changed, why, and how it was tested. CI must be green
before merging. See `CONTRIBUTING.md` for the full workflow and commit message convention.

## License

Released for academic coursework use.
DevOps workflow is managed using GitHub Actions and Jenkins.
The Jenkins pipeline automatically installs dependencies, runs the test suite, builds the application, and archives the generated outputs.
