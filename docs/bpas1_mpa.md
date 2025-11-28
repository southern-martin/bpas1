# BPAS1 Master Project Artefact (MPA)

## Purpose
- Single source of truth for project rules, workflows, context instructions, definitions, structure, and naming conventions.
- Non-sensitive: safe to store in GitHub for version control and collaboration.

## Scope
- Includes: rules, workflows, context, naming, structure, definitions.
- Excludes: secrets (API keys, tokens, passwords), private data, customer PII.

## Storage & Versioning
- Location: `docs/bpas1_mpa.md`.
- Managed via Git on GitHub; use PRs to update and review changes.

## Git Safety
- MPAs are logic and process, not secrets → safe in repo.
- Secrets stay in `.env`/secure store; never commit credentials.

## Update Workflow
- Branch from `develop` (e.g., `feature/mpa-update-*`).
- Edit the MPA; keep changes scoped and well-described.
- PR into `develop` with clear summary of rule changes.
- Tag releases as needed when rules change materially.
