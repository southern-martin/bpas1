# BPAS Context Instructions

## What belongs here
- Project rules, workflows, definitions, structure, naming conventions.
- Non-sensitive guidance for devs and collaborators.

## What never belongs here (or in Git)
- API keys, secrets, tokens, passwords.
- .env contents or private customer data.
- Certificates/keys (`*.pem`, `.env*.key`).

## Storage & Access
- Store in `docs/` and version via GitHub PRs.
- Use `.gitignore` to keep secrets out of the repo.

## Workflow for updates
- Branch from `develop` (e.g., `feature/context-update-*`).
- Keep changes small and documented in PR descriptions.
- Merge via PR to preserve history and traceability.

## Rationale
- MPAs and context are logic, not secrets → safe to version.
- GitHub provides history, review, and team access.
