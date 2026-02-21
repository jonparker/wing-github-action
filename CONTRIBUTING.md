# Contributing

Thanks for your interest in contributing to this fork.

## Branch Structure

| Branch | Purpose |
|--------|---------|
| `main` | Unmodified mirror of upstream. Do not target PRs here. |
| `node20` | Node.js 20 / `nodejs20.x` Lambda runtime |
| `node22` | Node.js 22 / `nodejs22.x` Lambda runtime (default branch) |

## How to Contribute

1. Fork this repo to your own GitHub account.
2. Branch from `node20` for most changes (fixes propagate forward to `node22`).
3. Make your changes and ensure `pnpm install && pnpm run -r build && pnpm run -r package` succeeds.
4. Open a PR targeting `node20` on this repo.
5. The `check-dist` workflow will run automatically to verify the build.
6. Once merged, the maintainer will cherry-pick the change to `node22`.

If your change is specific to `node22` only (e.g. AWS provider version, Terraform version), branch from and target `node22` instead.

## What to Change

- **Dockerfiles**: `actions/deploy/Dockerfile` and `actions/pull-request-diff/Dockerfile` — base image, Terraform version, etc.
- **Platform plugin**: `actions/deploy/platforms/backend.s3.js` and `actions/pull-request-diff/platforms/backend.s3.js` — runtime overrides, provider overrides.
- **Action logic**: TypeScript source in `actions/*/src/` — rebuild dist with `pnpm run -r build && pnpm run -r package` and commit the updated `dist/` directory.

## Important Notes

- Do not modify the `main` branch. It is kept as a clean mirror of the upstream repo.
- Do not upgrade the Wing CLI version. Wing is unmaintained and version changes may introduce breakage.
- Always commit the rebuilt `dist/` directory. The CI workflow checks that `dist/` matches the source.
