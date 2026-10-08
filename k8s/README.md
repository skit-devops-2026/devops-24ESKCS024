# Kubernetes Architecture & Manifests (Module 7)

This directory contains the production-grade Kubernetes manifests for orchestrating **HostelFix**.

---

## Files

- **`deployment.yaml`**: Kubernetes Deployment managing the container replicas with health probes, environment variables, and compute resource controls.
- **`service.yaml`**: Kubernetes Service exposing the pods via internal cluster networking.

---

## Manifest Specifications

### Deployment (`k8s/deployment.yaml`)
- **Image**: `ghcr.io/skit-devops-2026/devops-24eskcs024:latest`
- **Replicas**: 2 pods for high availability
- **Container Port**: 5000 (HTTP)
- **Liveness Probe**:
  - Path: `/health`
  - Port: 5000
  - Initial delay: 15s, Period: 10s
- **Readiness Probe**:
  - Path: `/health`
  - Port: 5000
  - Initial delay: 5s, Period: 5s
- **Resource Constraints**:
  - Requests: CPU 100m, Memory 128Mi
  - Limits: CPU 500m, Memory 512Mi

### Service (`k8s/service.yaml`)
- **Type**: `ClusterIP` (can be switched to `NodePort` or `LoadBalancer` depending on ingress infrastructure)
- **Selector**: `app: hostelfix` (matches pod labels)
- **Port Mapping**: Port 80 -> TargetPort 5000

---

## Deployment & Verification Commands

```bash
# Validate manifests without applying
kubectl apply --dry-run=client -f k8s/

# Apply manifests to the cluster
kubectl apply -f k8s/

# Verify Deployment rollout
kubectl get deployments
kubectl rollout status deployment/hostelfix-deployment

# Verify Pods status
kubectl get pods -l app=hostelfix

# Verify Service endpoints
kubectl get services hostelfix-service
```
