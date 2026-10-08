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

| Layer         | Technology                                                                     |
| ------------- | ------------------------------------------------------------------------------ |
| Framework     | TanStack Start v1 (React 19, file-based routing, server functions)             |
| Build tool    | Vite 8                                                                         |
| Styling       | Tailwind CSS v4, shadcn-style UI kit, Framer Motion (`motion`)                 |
| Data / charts | TanStack Query, Recharts                                                       |
| Backend       | Lovable Cloud — PostgreSQL, authentication, row-level security, object storage |
| Validation    | Zod + React Hook Form                                                          |
| Tests         | Vitest (+ v8 coverage)                                                         |
| CI/CD         | GitHub Actions (`.github/workflows/ci.yml`) and Jenkins (`Jenkinsfile`)        |

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- Git

Requirements: Node.js 20 or newer and npm.

```sh
# Clone this repository and enter the project folder:
git clone https://github.com/skit-devops-2026/devops-24ESKCS024.git
cd devops-24ESKCS024
npm install
npm run dev
```

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

| Script               | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Start the development server                  |
| `npm run build`      | Production build                              |
| `npm run preview`    | Serve the production build locally            |
| `npm run lint`       | ESLint over the whole project                 |
| `npm run test`       | Run the Vitest suite once                     |
| `npm run test:watch` | Run tests in watch mode                       |
| `npm run test:ci`    | Run tests with a coverage report (used by CI) |
| `npm run format`     | Format the codebase with Prettier             |

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

The project structure keeps UI components, routes, shared utilities, and configuration organized by responsibility.

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

1. Install Jenkins and the _NodeJS_, _Pipeline_ and _Git_ plugins.
2. In _Manage Jenkins → Tools_, add a NodeJS installation named `node20`.
3. Create a new _Pipeline_ job, choose _Pipeline script from SCM_, point it at this
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

## Development Workflow

1. Create a feature branch from `main`.
2. Make the required changes.
3. Run the tests locally.
4. Push the feature branch to GitHub.
5. Create a Pull Request.
6. Verify that CI passes.
7. Merge the Pull Request into `main`.

---

# MT2 — Containerization, Deployment, Monitoring & Kubernetes

## 1. Overview & Architecture
Milestone 2 (MT2) builds upon the foundational CI/CD workflows of MT1 to provide enterprise-grade containerization, orchestration, continuous deployment, and Prometheus/Grafana observability.

| Component | Technology | Target / Port | Status |
|---|---|---|---|
| Container Runtime | Docker (Multi-stage build) | Node 20 Alpine (`:5000`) | Complete |
| Container Orchestration | Docker Compose | Services: `app`, `db`, `prometheus`, `grafana` | Complete |
| Container Registry | GitHub Container Registry (GHCR) | `ghcr.io/skit-devops-2026/devops-24eskcs024:latest` | Automated via CI |
| Cloud Hosting | Render / Docker-compatible runtime | `render.yaml` Blueprint (`/health`) | Configured |
| Metrics & Monitoring | Prometheus + `prom-client` | Port 9090 (`/metrics`) | Complete |
| Metrics Visualization | Grafana Dashboard | Port 3000 (`hostelfix-overview`) | Complete |
| Kubernetes Manifests | Deployment & Service | 2 Replicas, Health Probes, Resource Limits | Complete |

---

## 2. Docker Setup & Build

### Dockerfile Highlights
The multi-stage `Dockerfile` uses `node:20-alpine`:
- **Stage 1 (Builder)**: Installs build dependencies, compiles TypeScript and Vite production assets into `.output/`.
- **Stage 2 (Runner)**: Installs production-only dependencies (`--omit=dev`), injects built assets and Express server, exposes port `5000`, and runs with zero secrets.

### Docker Build & Run Commands
```bash
# Build the Docker image
docker build -t hostel-fix .

# Run the containerized application
docker run -d -p 5000:5000 --name hostel-fix-app hostel-fix

# Verify running container
docker ps
docker logs hostel-fix-app
```

---

## 3. Docker Compose Stack

The stack in `docker-compose.yml` orchestrates the application, database, and monitoring:
- **`app`**: HostelFix container built from local `Dockerfile`, exposed on port `5000` with native healthchecks.
- **`db`**: MongoDB container on port `27017` with persistent named volume `mongo-data`.
- **`prometheus`**: Scrapes metrics from `app:5000/metrics` every 5 seconds.
- **`grafana`**: Auto-provisions Prometheus datasource and the prebuilt dashboard.

```bash
# Validate compose configuration
docker compose config

# Build and start all services in detached mode
docker compose up -d

# Verify container statuses
docker compose ps

# Stop stack
docker compose down
```

---

## 4. Container Registry (GHCR)

The production image is published to GitHub Container Registry:
- **Image URL**: `ghcr.io/skit-devops-2026/devops-24eskcs024:latest`
- **Automation**: Managed securely via `.github/workflows/ci.yml` using GitHub Actions native `secrets.GITHUB_TOKEN` with write permissions to `packages`.

Pull command:
```bash
docker pull ghcr.io/skit-devops-2026/devops-24eskcs024:latest
```

---

## 5. Live Deployment & Health Endpoint

- **Health Check Endpoint**: `GET /health` returns HTTP 200:
  ```json
  {
    "status": "ok"
  }
  ```
- **Deployment Specification**: `render.yaml` infrastructure-as-code file specifies a Docker web service with automatic `/health` probing.
- **Local / Deployed Verification**:
  ```bash
  curl -i http://localhost:5000/health
  ```
- **Deployment Screenshot**: Committed under [`docs/deployment-screenshot.png`](docs/deployment-screenshot.png).

---

## 6. Prometheus Monitoring & Metrics

The application exposes real-time runtime metrics via `GET /metrics` using `prom-client`:
- **HTTP Request Count**: `http_requests_total{method, route, status}`
- **HTTP Latency**: `http_request_duration_seconds{method, route, status}`
- **Node.js Process Metrics**: CPU time, RSS resident memory, heap usage, event loop lag.

Prometheus configuration is stored at `monitoring/prometheus.yml`:
```yaml
scrape_configs:
  - job_name: "hostel-fix-app"
    scrape_interval: 5s
    metrics_path: "/metrics"
    static_configs:
      - targets: ["app:5000", "localhost:5000"]
```

Verification command:
```bash
curl -s http://localhost:5000/metrics | head -n 30
```

---

## 7. Monitoring Dashboard

Grafana configuration and dashboard assets are version-controlled under `monitoring/`:
- **Dashboard JSON**: `monitoring/grafana/dashboards/hostel-fix-dashboard.json`
- **Datasource Provisioning**: `monitoring/grafana/provisioning/datasources/datasource.yml`
- **Dashboard Provider**: `monitoring/grafana/provisioning/dashboards/dashboard-provider.yml`

Dashboard panels:
1. **Application Availability**: Real-time UP/DOWN status indicator.
2. **Total HTTP Requests**: Request counter.
3. **Request Rate (req/s)**: Real-time traffic rate.
4. **Average Response Latency**: p95 and average request duration.
5. **HTTP Status Breakdown**: Distribution of HTTP status codes (200, 400, 404, 500).
6. **Process Memory (RSS)**: Memory consumption tracking.
7. **Process CPU Usage**: Core utilization percentage.

---

## 8. Kubernetes Manifests

Production Kubernetes manifests are located in `k8s/`:
- **`k8s/deployment.yaml`**:
  - Image: `ghcr.io/skit-devops-2026/devops-24eskcs024:latest`
  - Replicas: 2
  - Resource Requests: 100m CPU / 128Mi Memory
  - Resource Limits: 500m CPU / 512Mi Memory
  - Liveness Probe: `HTTP GET /health:5000`
  - Readiness Probe: `HTTP GET /health:5000`
- **`k8s/service.yaml`**:
  - Type: `ClusterIP`
  - Selector: `app: hostelfix`
  - Port: 80 -> TargetPort: 5000

### Verification Commands
```bash
# Validate manifests with client dry-run
kubectl apply --dry-run=client -f k8s/

# Apply manifests to cluster
kubectl apply -f k8s/

# Verify deployment and service status
kubectl get deployments
kubectl get pods -l app=hostelfix
kubectl get services hostelfix-service
```

