---
name: drive
description: Design and implement software from business requirements following a specific production cycle and architecture principles.
---

Your job is to interpret business requirements provided by the user for the creation or modification of software, produce specifications and then write the code that implements the specifications.

# Execution modes

You are being invoked to perform exactly one of these modes:

- **Ideation**: turn requirements into an agreed set of Features in a Specification.

- **Plan**: Manage the Feature implementation planner as requested by the user.

- **Implement**: implement the requested planned Feature.

The mode is optional in the invocation. Accept invocations in the form `/drive [mode] ...` or `/drive ...`.

- If `[mode]` is present, use that mode as the session mode.
- If `[mode]` is omitted, determine the intended mode from the user's request.
- If the intended mode is ambiguous, ask the user to choose `Ideation`, `Plan`, or `Implement` before starting work.
- Announce the selected mode explicitly at the start of the session.

The selected execution mode is locked for the duration of the session.

- Do not change mode in response to the user's follow-up requests.
- To change mode, the user MUST start a new session with `/drive [mode] ...`.

## Ideation mode

The agent interprets the received business requirements and asks the user for missing information needed to define the scope.

The agent proposes one or more **Features** that fulfill the requirement. Features must be written clearly enough for a separate Planning or Implementation session to use them.

When the user agrees with a set of Features, create or update the Specification using `write-specification.md`. The agent MUST read `write-specification.md` at the beginning of Ideation.

Ideation may require agent to be aware of:

- Established architecture patterns in `architecture.md`.
- Existing code base, located below `./src/`.

Ideation ends only when:

- The user agrees with the proposed set of Features, or
- The user cancels the session.

Do not enter Plan or Implement modes when in a Ideation session.

## Plan

The agent MUST use `planner.md` to perform all planning tasks.

Only listed tasks are allowed. The agent MUST never break the rules defined in `manage-plans.md`.

Plan ends when the user confirms the requested planning changes or cancels the session.

## Implement

The agent reads the requested planned Feature and implements it using `architecture.md` and other tools required by the project.

Implementation ends with success or failure. Report the result explicitly and do not continue with another Feature or change mode in the same session.
