## Language settings

- All technical documentation produced by agents should be in English.
- All business related documentation produced by agents should be in Portuguese (pt-PT).
- User may prompt agents using English or Portuguese language.

## Agent Delegation contract

- Keep architecture decisions, ambiguous requirements, security-sensitive work, destructive actions, and final acceptance with the main agent.
- Use lower grade agents for bounded read-only research, code tracing, and documentation lookup.
- Do not use nested subagents or broad fan-out by default.
- Every delegated task must state the objective, constraints, acceptance criteria, and expected report format.

## Safety

- Do not modify secrets, credentials, Git configuration metadata, dependency or lock files.
- Do not commit, push, reset, clean, delete, or otherwise perform destructive operations unless explicitly approved by the user.

## Documentation

- Documentation lives in `docs/`
- Issues and specs live as Github Issues or if the repository is only local, files under `docs/spec/`.
- Architectural requirements live in `docs/adr/`.

## Project information

_(write project goal and other global instructions for Agents, may include a history of updates)_
