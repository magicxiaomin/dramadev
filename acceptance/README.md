# Acceptance checks

This directory contains lightweight acceptance scripts for DramaDev P0 review.

## Script

- `dramadev-p0.sh`: local/CI smoke wrapper for dependency, guardrail, unit, lint, and build checks.

Run from the repository root:

```bash
bash acceptance/dramadev-p0.sh
```

Use `--ci` in GitHub Actions or other clean environments:

```bash
bash acceptance/dramadev-p0.sh --ci
```

The script is intentionally limited to local static checks and does not call external services.
