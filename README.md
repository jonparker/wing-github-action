# Winglang Github Actions (Fork)

Fork of [winglang/wing-github-action](https://github.com/winglang/wing-github-action) to support newer Lambda Node.js runtimes. Wing is unmaintained and hardcodes `nodejs18.x` in all generated `aws_lambda_function` resources. AWS Lambda Node.js 18 is deprecated.

This fork overrides the Lambda runtime at compile time via the `postSynth` hook in `backend.s3.js`, requiring **zero changes to any `.w` source files**.

## Branches

| Branch | Node.js | Lambda Runtime | Terraform | AWS Provider |
|--------|---------|----------------|-----------|--------------|
| `main` | 18 | `nodejs18.x` | 1.5.7 (MPL) | Default from Wing |
| `node20` | 20 | `nodejs20.x` | 1.5.7 (MPL) | Default from Wing |
| `node22` | 22 | `nodejs22.x` | 1.7.5 (BUSL 1.1) | `~> 5.70` |

- `main` is an unmodified mirror of upstream. Do not commit to it.
- `node20` branches from `main`. Fixes should land here first then cherry-pick to `node22`.
- `node22` branches from `node20`. Supports upgrading from either `nodejs18.x` or `nodejs20.x`.

## Usage

```yaml
# Node.js 20
- uses: jonparker/wing-github-action/actions/deploy@node20
  with:
    entry: main.w
    target: 'tf-aws'

# Node.js 22
- uses: jonparker/wing-github-action/actions/deploy@node22
  with:
    entry: main.w
    target: 'tf-aws'
```

No other changes to the consuming project are required. No `.w` files, `package.json`, or Terraform configuration need modification.

## How It Works

Each action's Dockerfile is self-contained (no external container registry dependency). The base image, Terraform, and Node.js are all inlined in the Dockerfile.

The `backend.s3.js` platform plugin has a `postSynth` hook that modifies the Terraform config after Wing compilation but before Terraform runs:

1. **Runtime override** — rewrites `runtime` on all `aws_lambda_function` resources
2. **AWS provider override** (node22 only) — sets `required_providers.aws` to `~> 5.70` since Wing's default provider (5.56.1) doesn't support `nodejs22.x`

## Key Decisions and Learnings

- **`postSynth` over sed/python**: Modifying the Terraform config as a structured JavaScript object in `postSynth` is cleaner and safer than post-compile text replacement with sed/python scripts.
- **No GHCR dependency**: The upstream action Dockerfiles referenced a pre-built base image on `ghcr.io`. This fork inlines the base Dockerfile into each action's Dockerfile so no container registry is needed.
- **Terraform 1.5.7 vs 1.7.5**: The `node20` branch keeps Terraform 1.5.7 (MPL licensed) since the default AWS provider already supports `nodejs20.x`. The `node22` branch requires Terraform 1.7.5 (BUSL 1.1) for compatibility with the newer AWS provider.
- **AWS provider version matters**: The runtime string validation comes from the AWS provider, not the Terraform binary. Wing generates configs pinned to AWS provider 5.56.1, which doesn't know about `nodejs22.x`. The `node22` branch overrides `required_providers` to `~> 5.70`.
- **Wing CLI version**: The action installs Wing at runtime via the `version` input parameter (default: `latest`). Since Wing is unmaintained, pin this in your consuming workflow to avoid breakage.

## Actions

- **[Deploy](./actions/deploy/)** — compiles Wing and runs `terraform apply`
- **[Pull Request Diff](./actions/pull-request-diff/)** — compiles Wing and posts `terraform plan` output as a PR comment

## Maintenance

- **Shared fixes**: Fix on `node20` first, then cherry-pick to `node22`.
- **Future Node versions**: Branch from `node22`, update the Dockerfile base image, `backend.s3.js` runtime string, and AWS provider constraint if needed.
- **Do not upgrade Wing CLI**: It is unmaintained and newer versions may introduce breaking changes.
- **Escape hatch**: If Wing compilation breaks entirely, take the last known `target/*.tf.json` output, commit it as static Terraform, and maintain it directly.