# CLAUDE.md

This file provides guidance to AI assistants (Claude and others) working with this repository.

## Repository Status

This is a **newly initialized repository** with no committed code yet. This CLAUDE.md will be updated as the codebase evolves.

---

## Git Configuration

- **Remote**: `http://local_proxy@127.0.0.1:46567/git/t-kawada-ghb/test`
- **Commit author**: Claude (`noreply@anthropic.com`)
- **Signing**: SSH key signing is enabled for commits

### Branch Conventions

- Development branches follow the pattern: `claude/<task-description>-<session-id>`
- Always push to the designated feature branch; never push directly to `main` or `master` without explicit permission
- Use `git push -u origin <branch-name>` for all pushes

### Commit Message Style

Write clear, descriptive commit messages:
- Use the imperative mood: "Add feature" not "Added feature"
- Keep the subject line under 72 characters
- Separate subject from body with a blank line when additional context is needed
- Reference issue/PR numbers when relevant (e.g., `Fixes #42`)

---

## Development Workflow

Since the codebase is not yet established, follow these general principles:

1. **Read before editing** — Always read relevant files before modifying them
2. **Minimal changes** — Only make changes directly requested or clearly necessary
3. **No over-engineering** — Avoid adding features, abstractions, or error handling beyond what is needed
4. **Test your changes** — Run tests after making modifications (commands to be documented as the project grows)
5. **No secrets in code** — Never commit API keys, passwords, tokens, or credentials

---

## Key Principles for AI Assistants

### Code Quality
- Prefer simple, readable solutions over clever ones
- Do not add comments unless logic is non-obvious
- Do not add docstrings or type annotations to code you did not change
- Do not refactor surrounding code when fixing a bug
- Three similar lines of code is better than a premature abstraction

### Security
- Validate input at system boundaries (user input, external APIs)
- Avoid command injection, SQL injection, XSS, and other OWASP Top 10 vulnerabilities
- Never expose sensitive environment variables in logs or error messages

### File Management
- Prefer editing existing files over creating new ones
- Do not create documentation files (*.md, README) unless explicitly requested
- Remove unused code rather than commenting it out

### Git Operations
- Stage specific files by name rather than `git add -A` or `git add .`
- Always create new commits rather than amending published commits
- Never skip hooks (`--no-verify`) unless explicitly asked

---

## Updating This File

As the project develops, update the following sections to reflect the actual state of the codebase:

- **Technology stack** — languages, frameworks, runtime versions
- **Project structure** — directory layout and purpose of each folder
- **Dependencies** — key libraries and their roles
- **Development setup** — how to install dependencies and run the project locally
- **Testing** — test framework, how to run tests, coverage requirements
- **Build & deploy** — build commands, CI/CD pipeline description
- **Environment variables** — required env vars with descriptions (never actual values)
- **Code conventions** — linting rules, formatting standards, naming conventions
- **Architecture notes** — key design decisions and patterns in use
