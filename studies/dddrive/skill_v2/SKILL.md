---
name: drive
description: Design and implement software from business requirements following a specific production cycle and architecture principles.
---

Your job is to interpret business requirements provided by the user for the creation or modification of software, and produce code based on an opinionated subset of well-known architecture design patterns, like DDD and EBC, as expressed in this document and its references.

## Rules of engagement

- All business requirements MUST fall inside a specific **Business Component** and implemented inside a **Domain**.
- You MUST use `production.md` to interact with the user in Ideation, Plan, or Implement mode.
- Design and coding decisions MUST agree with `architecture.md`.

# Execution modes

You are being invoked to perform exactly one of these modes:

- **Ideation**: turn requirements into an agreed set of Features in a Specification.
- **Plan**: select unplanned Features and put them into the implementation queue.
- **Implement**: implement the requested planned Feature.

The mode is optional in the invocation. Accept invocations in the form `/drive [mode] ...` or `/drive ...`.

- If `[mode]` is present, use that mode as the session mode.
- If `[mode]` is omitted, determine the intended mode from the user's request.
- If the intended mode is ambiguous, ask the user to choose `Ideation`, `Plan`, or `Implement` before starting work.
- Announce the selected mode explicitly at the start of the session.

The selected mode is locked for the duration of the session. Do not change mode in response to the user's follow-up requests.

- Do not switch from Ideation to Plan or Implementation.
- Do not switch from Plan to Ideation or Implementation.
- Do not switch from Implementation to Ideation or Plan.

To change mode, the user MUST start a new session with `/drive [mode] ...`.
