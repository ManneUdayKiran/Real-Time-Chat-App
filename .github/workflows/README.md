# GitHub Actions Workflows

This directory contains CI/CD workflows for the Real-Time Chat App.

## Workflows Overview

| Workflow       | File                 | Trigger          | Description                                          |
| -------------- | -------------------- | ---------------- | ---------------------------------------------------- |
| CI Pipeline    | `ci.yml`             | Push/PR to main  | Runs lint, build, and syntax checks                  |
| UI Tests       | `ui-tests.yml`       | Push to Frontend | ESLint, build verification, Lighthouse accessibility |
| Security Audit | `security-audit.yml` | Push/PR + Weekly | npm audit, CodeQL, secret scanning                   |

## Required Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Environment Variables

| Secret              | Description                    |
| ------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | Backend API URL for production |
| `VITE_SOCKET_URL`   | Socket.io URL for production   |

## Workflow Details

### CI Pipeline (`ci.yml`)

- Runs on every push and pull request
- Checks frontend lint and build
- Validates backend syntax
- Runs security audit

### UI Tests (`ui-tests.yml`)

- ESLint for code quality
- Build verification
- Lighthouse CI for accessibility and performance

### Security Audit (`security-audit.yml`)

- **npm audit**: Checks for vulnerable dependencies
- **CodeQL**: Static analysis for security vulnerabilities
- **TruffleHog**: Scans for leaked secrets
- **Dependency Review**: Checks new dependencies in PRs

## Troubleshooting

### Build Failures

- Check if all environment variables are set
- Verify Node.js version compatibility
- Review error logs in Actions tab

### Security Audit Warnings

- Review the generated audit reports
- Update vulnerable packages: `npm audit fix`
- For breaking changes: `npm audit fix --force` (use with caution)
