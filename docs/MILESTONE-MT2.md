# MT2 — Modules 5–7 Evidence (20 marks)

This document maps each Milestone 2 requirement (Containerization, Deployment & Monitoring, and Kubernetes) to its implementation, configuration artifacts, and live operational endpoints.

## Student Details

| Roll No. | Student Name | GitHub Username | Repository |
|---|---|---|---|
| 24ESKCS024 | Aditya Swami | Aditya44350T | [skit-devops-2026/devops-24ESKCS024](https://github.com/skit-devops-2026/devops-24ESKCS024) |

---

## M5 · Containerization & Container Registry (6 marks)

| Requirement | Status | Implementation Details / Location |
|---|---|---|
| Multi-Stage `Dockerfile` | **Done** | `Dockerfile` (Node 20 Alpine builder + minimal runtime stage, non-root, port 5000) |
| `.dockerignore` | **Done** | `.dockerignore` (excludes `node_modules`, `.git`, `.output`, secrets, coverage) |
| Docker Compose Configuration | **Done** | `docker-compose.yml` (orchestrates `app`, `db`, `prometheus`, `grafana`) |
| Container Image Publishing | **Done** | Published to GHCR: `ghcr.io/skit-devops-2026/devops-24eskcs024:latest` via GitHub Actions |

---

## M6 · Deployment & Monitoring (8 marks)

| Requirement | Status | Implementation Details / Location |
|---|---|---|
| **Live Application URL** | **Done (Responding)** | [https://devops-24eskcs024.onrender.com](https://devops-24eskcs024.onrender.com) (HTTP 200 OK) |
| **Health Check Endpoint** | **Done (Responding)** | `GET /health` -> [https://devops-24eskcs024.onrender.com/health](https://devops-24eskcs024.onrender.com/health) (HTTP 200 OK, `{"status":"ok"}`) |
| **Prometheus Metrics** | **Done (Responding)** | `GET /metrics` -> [https://devops-24eskcs024.onrender.com/metrics](https://devops-24eskcs024.onrender.com/metrics) (`prom-client`) |
| Prometheus Scrape Configuration | **Done** | `monitoring/prometheus.yml` (scrapes app at 5s intervals) |
| Grafana Dashboard & Datasource | **Done** | `monitoring/grafana/dashboards/hostel-fix-dashboard.json`, auto-provisioning |
| Deployment Verification Screenshot | **Done** | `docs/deployment-screenshot.png` |
| Infrastructure-as-Code Spec | **Done** | `render.yaml` (Docker runtime blueprint with `/health` check path) |

### Live Response Evidence
1. **Health Check Probe:**
   ```bash
   curl -i https://devops-24eskcs024.onrender.com/health
   ```
   **Response (HTTP 200 OK):**
   ```json
   {
     "status": "ok"
   }
   ```

2. **Metrics Endpoint Probe:**
   ```bash
   curl -i https://devops-24eskcs024.onrender.com/metrics
   ```
   **Response (HTTP 200 OK):** Exposes `http_requests_total`, `http_request_duration_seconds`, process CPU & memory metrics.

---

## M7 · Kubernetes Manifests (6 marks)

| Requirement | Status | Implementation Details / Location |
|---|---|---|
| Kubernetes Deployment | **Done** | `k8s/deployment.yaml` (2 replicas, CPU/memory limits, liveness & readiness probes) |
| Kubernetes Service | **Done** | `k8s/service.yaml` (ClusterIP exposing port 80 -> container target port 5000) |
| Dry-run Client Validation | **Done** | `kubectl apply --dry-run=client -f k8s/` validated |
