# Security Policy

## Supported Versions

We release security updates for the latest minor version of GSAP Blocker. Please keep your dependencies up to date.

| Version | Supported          |
| ------- | ------------------ |
| 0.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

1. **Do not open a public issue.** Instead, send a private email to the maintainer at the contact address in the repository profile.
2. Include a clear description of the vulnerability, the steps to reproduce it and the potential impact.
3. Allow reasonable time for the issue to be addressed before disclosing it publicly.

We will acknowledge receipt within 48 hours and provide a timeline for a fix. Once resolved, we will publish a security advisory and update `CHANGELOG.md` accordingly.

## Security Best Practices for Contributors

- Do not commit secrets, API keys or tokens.
- Keep dependencies up to date and review security advisories (`pnpm audit`).
- Avoid introducing new dependencies with known vulnerabilities.
- Follow the principle of least privilege in CI/CD workflows.
