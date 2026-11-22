# Write Specification and Features

This document defines how to write business Specifications into documentation following an Ideation session.

## Information hierarchy

Business Requirements are translated into a Specification at the end of an Ideation session.

- The **Specification** is composed of **Features** to be implemented.
- The **Feature** is composed of **Tasks** to be performed and scopes one coherent business requirement.
- The **Task** describes a single goal or action inside the Feature.

## Specification

All agreed Specification documents from current and past interactions are kept in the project as a historical record of decisions.

Each Specification has a unique index, as described in the `## Specification naming and reference` section of `reference.md`.

### Specification template

```markdown
# Specification #{place:spec-index}

**Project**: {place: project or root folder}\
**Date** : {place: date and time}\
**User** : {place: user account name}\
**Model** : {place: ai model name / thinking level }

## Prompt

{place: initial prompt received from the user}

## Features

{place: Bullet list of features resulting from the Specification}

- **`{feature-index}`**: {Feature title}
- ...

**== EOD ==** _(always include this End-of-document personal mark)_
```

## Feature

Main Feature characteristics:

- Is the smallest unit of work in the Plan and Implementation phases.

- MUST contain enough detail for another agent to independently carry it through the Plan or Implementation phases.

- MUST have a unique identifier in the whole project.

The Feature is saved and exposed to the production cycle in three ways:

- The Feature identifier and title are added to the Specification document. Append an item to the bullet list of Features at the location identified in the "### Specification template" above.

- The Feature text is saved in a standalone document with a unique file name.

- An entry is added to the `unplanned` section of the Planner, as described in the `### Add` section of `planner.md`.

Execution rules:

- The Feature text MUST follow the template defined in the `### Feature template` section below.

- Both the Feature identifier and the filename MUST follow the instructions described in the `## Feature naming and reference` section of `reference.md`.

- For performance reasons, the insertion of the Feature identifier to the Planner is deferred until the end, when it can be added in bulk, after writing the whole Specification and Features.

### Feature template

```markdown
## {place: `{spec-index}-{feature-sequence}`} - {place: Feature title}

{place: description of feature specification}

### Tasks

**1 - {place: task title}**

{place: description of task to execute or implement}

**..._(next task)_...**

**== EOD ==** _(always include this End-of-document personal mark)_
```

## Updates and Deletions

Both Specifications and Feature documents are immutable historical records.
Do NOT edit or rewrite existing Specification and Feature documents.

If a new Feature requires changes to or removal of previous Features from another Specification:

1. Create the new Feature like any other Feature.
2. Add specific Tasks to mark the affected older Features as deleted or replaced.
3. For each of the affected older Features:
   - Add an annotation at the very top of the Feature document with the text "**Deleted by `{feature-index}`**" or "**Replaced by `{feature-index}`**". Note: this is an exception to the immutability rule for Feature documents.
   - Update the planner, moving the Feature to `completed` with status "deleted" or "replaced".

Features in the same Specification MUST NOT conflict with, amend, or delete one another. If such a situation is found, stop writing, alert the user, and return to the discussion of Specifications.
