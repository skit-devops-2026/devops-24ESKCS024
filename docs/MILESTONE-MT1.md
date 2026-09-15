# MT1 — Modules 1–4 evidence (20 marks)

This file maps each milestone check to what exists in the repository and what you must do
in GitHub/Jenkins yourself, since commit history, branches, pull requests and pipeline runs
cannot be created from inside the codebase.

## M1 · Repository Setup — 4 marks

| Check | Status | Where |
| --- | --- | --- |
| `README.md` filled in, no placeholders | Done | `README.md` — features, stack, setup, env vars, structure, data model, testing, CI, Jenkins, branching |
| `.gitignore` present | Done | `.gitignore` — ignores `node_modules`, `dist`, `.output`, `.env`, `coverage/` |
| No build artifacts committed | Done | `node_modules`, `dist`, `.output`, `coverage` are all ignored |
| 5+ commits across 3+ days | **You** | Commit in small steps over at least three separate days |

## M2 · Branching and Pull Requests — 4 marks

| Check | Status | Where |
| --- | --- | --- |
| 3+ branches | **You** | Create `develop` plus `feature/*` branches — see `CONTRIBUTING.md` |
| 4+ merged pull requests | **You** | Open a PR per feature branch and merge it |
| Half of merged PRs have descriptions | Done (template) | `.github/pull_request_template.md` pre-fills every PR description |

Suggested branch/PR split of the existing work:

1. `feature/auth-and-profiles` — sign in, register, profile page
2. `feature/complaint-crud` — new complaint form, list, detail view
3. `feature/admin-dashboard` — analytics charts, student directory
4. `feature/ci-and-tests` — Vitest suite, GitHub Actions, Jenkinsfile

## M3 · CI Pipeline with Automated Tests — 8 marks

| Check | Status | Where |
| --- | --- | --- |
| `.github/workflows/ci.yml` exists | Done | Lint → test with coverage → build → upload coverage |
| CI pipeline runs the test suite | Done | `npm run test:ci` step |
| Test files present | Done | `src/lib/__tests__/complaint-utils.test.ts`, `src/lib/__tests__/utils.test.ts` (16 tests) |
| 5+ successful CI runs | **You** | Each push and PR triggers a run; five pushes gives five runs |
| Most recent run passing | **You** | Keep `main` green |
| One failed run later fixed | **You** | Break a test on a feature branch on purpose, push (red run), fix it, push again (green run) |

Reproducing a red-then-green pair:

```sh
git checkout -b fix/ci-demo
# change an expected value in src/lib/__tests__/complaint-utils.test.ts
git commit -am "test: temporarily break pagination expectation"
git push          # CI run fails
# restore the correct value
git commit -am "fix: correct pagination expectation"
git push          # CI run passes
```

## M4 · Jenkins Pipeline — 4 marks

| Check | Status | Where |
| --- | --- | --- |
| `Jenkinsfile` present | Done | Checkout, Install, Lint, Test, Build, Archive stages |
| Working pipeline shown at the viva | **You** | Follow the Jenkins setup steps in `README.md` |

For the viva, be ready to show: the job configured from SCM, a build running the Vitest
suite, the archived build output, and Jenkins reporting status back to GitHub via the
GitHub plugin or a webhook.
