# HostelFix Application Monitoring Setup

This directory contains the production monitoring and observability infrastructure for **HostelFix**, built with **Prometheus** and **Grafana**.

---

## Directory Structure

```
monitoring/
├── prometheus.yml                     # Prometheus scrape configuration
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── datasource.yml         # Auto-provisioned Prometheus data source
│   │   └── dashboards/
│   │       └── dashboard-provider.yml # Auto-provisioned dashboard loader
│   └── dashboards/
│       └── hostel-fix-dashboard.json  # Preconfigured monitoring dashboard
└── README.md                          # Monitoring documentation
```

---

## Metrics Collection Architecture

The application exposes real-time runtime and HTTP metrics on `/metrics` using `prom-client`:

1. **Standard Node.js Process Metrics**:
   - `process_cpu_user_seconds_total`, `process_cpu_system_seconds_total`
   - `process_resident_memory_bytes` (RSS memory)
   - `nodejs_eventloop_lag_seconds`
   - `nodejs_heap_size_used_bytes`

2. **Custom HTTP Application Metrics**:
   - `http_requests_total{method, route, status}` — Counter for total HTTP requests categorized by HTTP verb, path, and response status code.
   - `http_request_duration_seconds{method, route, status}` — Histogram tracking latency distributions across endpoints.

3. **Application Health Probe**:
   - `GET /health` — Returns HTTP 200 `{"status": "ok"}` for container liveness and readiness probes.

---

## Prometheus Configuration (`prometheus.yml`)

Prometheus scrapes the target every 5 seconds:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "hostel-fix-app"
    scrape_interval: 5s
    metrics_path: "/metrics"
    static_configs:
      - targets: ["app:5000", "localhost:5000"]
        labels:
          app: "hostel-fix"
          env: "production"
```

---

## Grafana Dashboard (`hostel-fix-dashboard.json`)

The dashboard (`UID: hostelfix-overview`) displays:

| Panel | Metric / PromQL | Description |
|---|---|---|
| **App Availability** | `up{job="hostel-fix-app"}` | Live UP/DOWN stat indicator |
| **Total HTTP Requests** | `sum(http_requests_total)` | Total request volume counter |
| **Request Rate (req/s)** | `sum(rate(http_requests_total[1m]))` | Throughput in requests per second |
| **Average Latency** | `rate(http_request_duration_seconds_sum[1m]) / rate(...)` | End-to-end response time |
| **Status Codes** | `sum by (status) (http_requests_total)` | Distribution of 2xx, 4xx, 5xx |
| **Resident Memory** | `process_resident_memory_bytes` | Node.js RSS memory consumption |
| **CPU Usage** | `rate(process_cpu_seconds_total[1m])` | CPU core utilization percentage |

---

## Running with Docker Compose

To start the complete application, Prometheus, and Grafana stack:

```bash
docker compose up -d
```

- Application: [http://localhost:5000](http://localhost:5000)
- Health check: [http://localhost:5000/health](http://localhost:5000/health)
- Metrics endpoint: [http://localhost:5000/metrics](http://localhost:5000/metrics)
- Prometheus UI: [http://localhost:9090](http://localhost:9090)
- Grafana UI: [http://localhost:3000](http://localhost:3000) (admin / admin)
