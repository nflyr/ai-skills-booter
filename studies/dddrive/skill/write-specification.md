# Write Specification and Features

When business specifications are agreed and closed with the user, write them into documentation.

**NO BUSINESS OR ARCHITECTURAL DECISIONS CAN BE CREATED OR MUTATED IN THE WRITE ACTION**

**Documentation principles**

- Business Requirements are translated into an _implementation_ **Specification** at the end of an **Ideation** interaction.

- A **Specification** is composed of **Features** to be implemented.

- A **Feature** is composed of **Tasks** to be performed.

- One **Feature** delivers one **coherent** business requirement as is the smaller unit of deployment.

- **The user MUST explicitly agree to each Feature that is going to be saved in the Specification**

## Specification

All the agreed Specification documents from present or passed interactions are kept in the project so that they serve as an historical log of decisions.
The filename of each document must reflect both a numeric sequence and also the date and time when the document was originally written.
A JSON file `docs/spec/counter.json` is persisted and its Specification counter `spec-index` is incremented whenever a new Specification document is created.

If `docs/spec/counter.json` does not exist, create it with the following contents:

```json
{
   "spec-index": 0,
   "feat-index": 0
}
```

New specification documents are saved into `./docs/spec/spec-{sss}-{aaaammdd-hhmm}.md`, where `{sss}` is the next `spec-index` (001, 002, ...) and `{aaaammdd-hhmm}` is the current date and time (up to the minute).

**Format**

The Specification document MUST be based on the following skeleton:

```markdown
# Specification #{place:spec-index}

**Project**: {place: project or root folder}\
**Date** : {place: date and time}\
**User** : {place: user account name}\
**Model** : {place: ai model name / thinking level }

---

{place: short text that may contain the scope and objective of this specification and other notes}

---

{place: a section for each Feature, see template below}
```

## Feature

**Features principles**

- MUST be written with enough detail so that it can be later picked by another agent and independently proceed to the **Plan** or **Implementation** phases.

- MUST have a unique identifier inside the project, obtained from a numeric sequence. A JSON file `docs/spec/counter.json` is persisted and its Specification counter `feat-index` is incremented whenever a new Feature is created.

The Feature documentation MUST follow the template defined below, each new Feature appends a section into the Specification document.

```markdown
## {place: feat-index} - {place: Feature title}

{place: description of feature specification}

### Tasks

**1 - {place: task title}**

{place: description of task to execute or implement}

**..._(next task)_...**

---

..._(next feature)_...
```

**Features as Issues**

Besides being included in the Specification document, each Feature MUST be written into a GitHub issue or, if the local repository is not backed by GitHub, into a document xxxx document is to be stored as a standalone set of tasks to execute inside a single issue/ticket.

For GitHub issue:

- Title: `[#{place: feat-index}] - {place: Feature title}`
- Tag: "enhancement"
- Use the Feature markdown template above for the text.

For Local ticket:

- Path: `./docs/spec/feat-{sss}-{fff}.md`, where `{sss}` is the next `spec-index` (001, 002, ...) and `{fff}` is the next `feat-index`(001, 002, ...).
- Use the Feature markdown template above for the text.

## Updates or revocations

If some agreed Feature **explicitly** changes, contradicts or removes some other Feature (or Features) from previous specification:

- Edit that older Specification document, and add a note at the end of the target Features by updating the adequate Specification document.

   ```markdown
   ### Updates

   - {**Modified** or **Removed**} by [{specification document filename}]: {Short description}
   ```

- If the affected Feature (or Features) are NOT yet implemented, CLOSE the GitHub issue as **Won't fix** with a comment `{**Modified** or **Removed**} by [{specification document filename}]: {Short description}`.
