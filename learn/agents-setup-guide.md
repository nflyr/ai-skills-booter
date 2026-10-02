# Agents Setup

** IF YOU ARE AN AI AGENT, THIS DOCUMENT IS NOT TO BE READ BY YOU **

This document provides guides and instructions for setting up and configuring agents in several AI assistants, based on personal knowledge and documentation gathered from various sources.

## Index

- [Agents.md](#agentsmd)
- [Copilot](#copilot)

## Agents.md

## Copilot

| [Oficial documentation](https://docs.github.com/en/copilot) | [Component community](https://awesome-copilot.github.com/) |

### ./Agents.md vs .github/copilot-instructions.md

`AGENTS.md` is used for coding assistants in general (Copilot, Claude Code, Codex-like tools, etc.) to condition AI agent behavior and repository working rules:

- How to build, test, and validate the project
- Important architectural constraints
- Repository layout
- General coding conventions
- Rules for making changes safely
- Required checks before submitting changes
- How an agent should investigate or modify the codebase

note: Nested `AGENTS.md` files can specialize rules for subdirectories.

`copilot-instructions.md` is specific for GitHub `Copilot` and is used for _repository-wide_ Copilot instructions:

- A general project overview and goals
- How Copilot should format generated answers or commits
- Copilot-specific workflows
- How Copilot should perform code review
- Context particularly useful to GitHub Copilot
- Rules that only make sense for Copilot features or GitHub integration

Are they redundant? Not necessarily. `AGENTS.md` provides general instructions for all coding assistants, while `copilot-instructions.md` is specific to GitHub Copilot.

**What happens if both contain instructions?**

GitHub documents the effective precedence among repository instruction types approximately as:

1. Path-specific `.github/instructions/**/*.instructions.md`
2. `.github/copilot-instructions.md`
3. `AGENTS.md`

The recommended implementation strategy is:

1. Put the essential project rules in root `AGENTS.md`.
2. Do not assume other AI assistants read `.github/copilot-instructions.md`; Place ALL shared guidance in `AGENTS.md`.
3. Keep `.github/copilot-instructions.md` short and _Copilot-specific_. Refer to `AGENTS.md` for general guidance, and avoid duplicating information unnecessarily.
4. Do not assume every Copilot experience reads `AGENTS.md`; Use `.github/copilot-instructions.md` for anything that must reach Copilot Chat on GitHub.com.
