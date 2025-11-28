# BPAS Pipeline & Planning Rules

## Pipeline (Office Board)
- Endpoint: `GET /pipeline`
- Buckets: `To Do`, `Doing`, `Done`, `Blocked`
- Cards flow based on their `status` value.
- In-memory data source: `db.cards` (upgradeable later).

## Planning (Owner Planning Page)
- Endpoints:
  - `GET /planning` → buckets: `Tomorrow`, `Next Week`, `Later`
  - `PATCH /planning/:id` → update `planning_bucket` (`Tomorrow` | `Next Week` | `Later` | null)
- Validation: only allowed bucket values; null removes planning assignment.

## Card Status/Bucket Mapping
- Pipeline uses `status` field.
- Planning uses `planning_bucket` field.
- Updates to cards propagate to pipeline/planning automatically.

## Non-sensitive Note
- These rules are logic-only; safe in GitHub.
- Do not store secrets (API keys, tokens, PII) here.
