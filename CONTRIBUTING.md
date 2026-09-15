# Contributing to HostelFix

## Branching model

| Branch | Purpose |
| --- | --- |
| `main` | Always deployable. Only updated through merged pull requests. |
| `develop` | Integration branch for the current milestone. |
| `feature/<name>` | One branch per feature, branched from `develop`. |
| `fix/<name>` | Bug fixes, branched from `develop` (or `main` for hotfixes). |

```sh
git checkout develop
git pull
git checkout -b feature/complaint-filters
# work, commit in small steps
git push -u origin feature/complaint-filters
```

## Commit messages

Use short, imperative Conventional Commit style:

```
feat: add hostel block filter to complaint list
fix: keep pending complaints editable after refresh
test: cover pagination edge cases
ci: run vitest with coverage in GitHub Actions
docs: document the Jenkins pipeline setup
```

Commit in small, meaningful steps rather than one large dump at the end.

## Pull requests

1. Open the PR against `develop` (or `main` for a release merge).
2. Fill in the template: what changed, why, how it was tested, screenshots for UI work.
3. Wait for the CI workflow to finish. A red pipeline must be fixed before merging.
4. Merge with a merge commit so the history records the integration.

## Before pushing

```sh
npm run lint
npm run test
npm run build
```

## Adding tests

Pure logic lives in `src/lib/` and is unit-tested in `src/lib/__tests__/`. When you add a
helper, add a test for the happy path and at least one edge case. Keep tests free of
network and database access so they run identically in CI and Jenkins.
All changes should be tested locally before creating a pull request.