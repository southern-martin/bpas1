# Git flow for BPAS

- Base branch: `develop` is the integration branch. Branch new work from `develop`.
- Feature branches: `feature/<scope>` (e.g., `feature/card-notes`, `feature/ai-retry`). Keep scope small.
- Commits: concise messages using `feat:`, `fix:`, `chore:`, etc. Keep changes scoped.
- Sync before merge: `git fetch` then `git rebase origin/develop` on the feature branch; resolve conflicts locally.
- Merge strategy: open a PR into `develop` and merge with a merge commit (no squash) to preserve the feature graph.
- Cleanup: keep feature branches until release if you need traceability, then delete when done.
- Task prefixes: when working on numbered tasks (A, B, C, etc.), prefix feature branch names and commit messages with `Task A:`, `Task B:`, etc., to clearly identify the task context.
