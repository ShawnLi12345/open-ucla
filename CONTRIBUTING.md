# Contributing to OpenUCLA

OpenUCLA is built by UCLA students, for UCLA students. This guide covers how to contribute code to the web app. If you want to share course materials (notes, syllabi, study guides), use the upload form on the site instead.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Bun](https://bun.sh/) — install with `curl -fsSL https://bun.sh/install | bash`

### Get it running

```bash
git clone https://github.com/DNKYr/open-ucla.git
cd open-ucla
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000). That's it.

### Run tests

```bash
bun test
```

## How We Work

### Branches

We use two long-lived branches: `main` (production) and `development` (staging). Never push directly to `main`.

When you work on something:

1. Create a branch off `development` using the naming convention `dev/your-branch-name`:
   ```bash
   git checkout development
   git pull origin development
   git checkout -b dev/your-branch-name
   ```
2. Make your changes and commit them.
3. Push your branch and open a PR targeting `development`:
   ```bash
   git push -u origin dev/your-branch-name
   ```
   Then open a pull request on GitHub against the `development` branch.

These conventions are also in `CLAUDE.md`, which configures AI coding agents to follow the same workflow. Humans and agents play by the same rules.

### Tech stack

- **Next.js 16** with the App Router (pages live in `src/app/`)
- **React 19**, **TypeScript**
- **Tailwind CSS 4** for styling
- **Bun** as the package manager and runtime
- **Vitest** for tests (`bun test`)
- **Fuse.js** for client-side search

## Setting Up AI Coding Agents

We encourage using AI coding agents when contributing. They're great for exploring an unfamiliar codebase, writing tests, and implementing features from issues.

To see why this matters, here's the same task done manually and then with an agent.

### Example task: add a test

**Manually**, you'd read the existing tests in `src/lib/__tests__/`, understand the patterns, write a new test file, and run `bun test` to verify. That might take 20-30 minutes if you're new to Vitest.

**With an agent**, you describe what you want and it writes the test for you. You review the output, run `bun test`, and iterate. Below is how to set that up.

### Claude Code

This repo already has a `CLAUDE.md` that tells Claude Code about the project's branching model, conventions, and tooling. Claude Code reads it automatically.

Install:
```bash
npm install -g @anthropic-ai/claude-code
```

Run from the repo root:
```bash
claude
```

Example prompt:
```
Write a test for the getDepartments function in src/lib/content.ts. Follow the patterns in src/lib/__tests__/content.test.ts.
```

### Codex CLI

Install:
```bash
npm install -g @openai/codex
```

Run from the repo root:
```bash
codex
```

Example prompt:
```
Look at src/lib/__tests__/content.test.ts for test patterns, then write a test for getDepartments in src/lib/content.ts.
```

### Gemini CLI

Install:
```bash
npm install -g @google/gemini-cli
```

Run from the repo root:
```bash
gemini
```

Example prompt:
```
Read the test files in src/lib/__tests__/ and write a new test for the getDepartments function in src/lib/content.ts using the same Vitest patterns.
```

You don't need any of these agents to contribute. They're optional tools that can speed things up, especially when you're getting familiar with the codebase.

## What to Expect After Your PR

1. A maintainer will review your PR, usually within a few days.
2. You might get feedback asking for changes. This is normal and not a judgment on your code. Push new commits to the same branch to update the PR.
3. Once approved, your PR gets merged into `development`. It will reach `main` in the next release.

If you don't hear back within a week, feel free to leave a comment on your PR. We won't forget about you.
