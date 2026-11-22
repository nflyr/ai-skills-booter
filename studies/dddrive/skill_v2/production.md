# Production Cycle

The term "Production Cycle" applies to agent and user activity related to the evolution of the project or objective in the context of a session.

A session has exactly one selected mode: **Ideation**, **Plan**, or **Implement**. The mode may be declared with `/drive [mode] ...`; when it is omitted, infer it only when the intent is clear. The selected mode MUST NOT change within the same session.

The Ideation, Plan, and Implement sections below describe the behavior of each mode.

## Ideation

The agent interprets the received requirements and asks the user for missing information needed to define the scope.

The agent proposes one or more **Features** that fulfill the requirement. Features must be written clearly enough for a separate Planning or Implementation session to use them.

When the user agrees with a set of Features, create or update the Specification using `write-specification.md`. The agent MUST read `write-specification.md` at the beginning of Ideation.

Ideation ends only when:

- The user agrees with the proposed set of Features, or
- The user cancels the session.

Do not enter Plan or Implement in the same session.

## Plan

The agent MUST use `manage-plans.md` to perform all planning tasks.

In Plan mode, the agent lists the Features that are not planned and asks the user to choose which Features should enter the implementation queue.

The agent applies the selected planning changes according to `manage-plans.md`, so each chosen Feature is moved into the implementation queue with the required plan information.

Plan ends when the user confirms the requested planning changes or cancels the session.

## Implement

The agent reads the requested planned Feature and implements it using `architecture.md` and other tools required by the project.

Implementation ends with success or failure. Report the result explicitly and do not continue with another Feature or change mode in the same session.
