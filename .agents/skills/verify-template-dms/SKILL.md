---
name: verify-template-dms
description: How to check a change in template-dms, the DMS starter project, before you push it. The command for each kind of change, the tools, the services, how to scope a run to what you touched, and what CI and the merge queue run instead of you. Use after you edit a page, the Antelope config, a dependency, the Docker files, a synced file or the docs, before you commit or push.
---

# Verify template-dms

CI runs every check on every pull request, and the merge queue runs them again on the merged result. You check only what you changed.

This repo has no test files. Its `test` script is `pnpm run build`, so the build is the test. The app it starts comes from `@antelopejs/dms`, whose Playwright suites run in the `dms` repo's CI, not here. Do not launch the app to check a change.

## Setup

Once per checkout:

```sh
corepack enable
pnpm install
```

Node 24 (`.nvmrc`) and pnpm 10.34.9 (`packageManager` in `package.json`). The repo has no commit hook: run the lint and format rows yourself before you commit.

## What to run for your change

| You changed | Run |
| --- | --- |
| Any file | `pnpm exec oxlint --no-error-on-unmatched-pattern <files>` and `pnpm exec oxfmt --check --no-error-on-unmatched-pattern <files>` on the files you changed. oxlint reads `oxlint.config.ts`, oxfmt reads `oxfmt.config.ts`. Both skip the synced and ignored paths, such as `.agents/skills`; the flag keeps a run on those files alone from failing. |
| A page or other file under `src/` | `pnpm run typecheck`, then `pnpm run build`. Both take seconds: the project is two files. |
| `antelope.config.ts` | `pnpm run typecheck`. It checks the config through `tsconfig.config.json`. |
| An export, an entry point or a dependency in `package.json` | `pnpm run knip`. After a dependency change, `pnpm install` and commit `pnpm-lock.yaml`. Leave the lockfile and range checks to CI. |
| A lint directive, `@ts-expect-error` or `SAFETY:` comment | `pnpm run suppressions`. After you remove one, `pnpm run suppressions:update` and commit `guardrails.suppressions.json`. |
| `compose.yaml` | `docker compose config -q`. It checks the file parses and resolves. No CI job builds the image or starts the stack. |
| `Dockerfile` or `docker/*.sh` | Lint and format only. No CI job builds or runs them: say so in your pull request. |
| `README.md` | The "Any file" row. CI checks the docs (`docs-files` in `ci.yml`). |
| A file `antelopejs-sync --profile template` writes (`.github/workflows/ci.yml`, `oxlint.config.ts`, `oxfmt.config.ts`, `.gitattributes`, `guardrails.suppressions.json`, the AGENTS.md Guardrails block, the entries it owns in `package.json`) | Nothing by hand: the next sync reverts it. Bump `@antelopejs/tooling-configs`, run `pnpm run sync`, then `pnpm run sync:check`. The repo stays on the template profile, so a project made from it gets no org hooks or internal skills: never switch it to the full profile. |

Scope: lint and format take the files you changed. Typecheck, build and knip run on the whole project, which is small enough to run in a few seconds. No command here starts test workers.

## Services

None. No local check needs MongoDB or another service. `compose.yaml` starts MongoDB only for the running app.

## Left to CI

`ci.yml` calls `AntelopeJS/.github/.github/workflows/ci-node.yml@v2`. Read its results on your pull request and rerun none of it locally, apart from the scoped command of a failing check to reproduce it:

- `ci / checks`: `pnpm run checks` in full, with typecheck, lint, format, knip, the build as `test`, size, suppressions, `sync:check`, the lockfile and dependency checks, and the git identity check.
- The docs check of `README.md`, in the same job.
- `verdict`: fails when `ci` or `renovate-sync` failed. Both it and `ci / checks` gate the merge queue.
- The nightly tier at 02:17 UTC, which adds the Windows legs and Stress.

## Done

The change is checked when every row its diff touches passed, with each command and its output in your reply or pull request. A row with no local command says so, and the pull request names the CI job that covers it.
