# Write Specification and Features

When business specifications are agreed and closed with the user, write them into documentation.

**NO BUSINESS OR ARCHITECTURAL DECISIONS CAN BE CREATED OR MUTATED IN THE WRITE ACTION**

## Information hierarchy

Business Requirements are translated into a Specification at the end of an Ideation session.

**Specification**

- Is composed of **Features** to be implemented.

**Feature**:

- Is composed of **Tasks** to be performed.
- Delivers one coherent business requirement.
- Is the smallest unit of deployment.

**Task**

- Describes a single goal or action inside the Feature.

- **The user MUST explicitly agree to each Feature that is going to be saved in the Specification**

Business Requirements are translated into an _implementation_ **Specification** at the end of an **Ideation** interaction.

- A **Specification** is composed of **Features** to be implemented.

- A **Feature** is composed of **Tasks** to be performed.

- One **Feature** delivers one coherent business requirement as is the smallest unit of deployment.

- **The user MUST explicitly agree to each Feature that is going to be saved in the Specification**.

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

---

{place: short text that may contain the scope and objective of this specification and other notes}

---

{place: append a section for each Feature, using `### Feature template`}
```

## Feature

Main Feature characteristics:

- Is the smallest unit of work in the Plan and Implementation phases.

- MUST contain enough detail for another agent to independently carry it through the Plan or Implementation phases.

- MUST have a unique identifier in the whole project.

The Feature is saved and exposed to the production cycle in three ways:

- The Feature text is added into the Specification document. Append a section for each new Feature. There is a location identified in the "### Specification template" above.

- The Feature text is saved in a standalone document with a unique file name.

- An entry in added to the `unplanned` section of the Planner, as described in "### Add" section of `planner.md`.

Execution rules:

- The Feature text MUST follow the template defined in `### Feature template` section below.

- Both Feature identifier and filename MUST follow the instructions described in the `## Feature naming and reference` section of `reference.md`.

- For performance reasons, the insertion of the Feature reference to the Planner is delayed to be done in bulk, at the end, after writing the whole Specification and Features.

### Feature template

```markdown
## {place: `{spec-index}-{feature-sequence}`} - {place: Feature title}

{place: description of feature specification}

### Tasks

**1 - {place: task title}**

{place: description of task to execute or implement}

**..._(next task)_...**

---
```

## Updates or revocations

Because Specifications are immutable historical records, do not edit or rewrite existing Specification documents. Do not reuse or renumber the old Feature identifier.

If a new Feature requires changes to or removal of previous Features from another Specification:

1. Create the new Feature like any other Feature.
2. Add initial/specific Tasks to mark the affected older Features as deleted or replaced.
3. For each of the affected older Features:
   - Add an annotation at the very top of the document with the text "**Deleted by `{feature-index}`**" or "**Replaced by `{feature-index}`**".
   - Update the planner, moving the Feature to `completed` with status "deleted" or "replaced".
