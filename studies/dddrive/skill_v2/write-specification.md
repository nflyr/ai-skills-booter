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
Specifications are immutable after they are written. Do not edit the contents of an existing Specification.
The filename of each document must reflect both a numeric sequence and also the date and time when the document was originally written.
A JSON file `docs/spec/counter.json` is persisted and its Specification counter `spec-index` is incremented whenever a new Specification document is created.

If `docs/spec/counter.json` does not exist, create it with the following contents:

```json
{
   "spec-index": 0
}
```

New specification documents are saved into `./docs/spec/spec-{sss}-{aaaammdd-hhmm}.md`, where `{sss}` is the next `spec-index` (001, 002, ...) and `{aaaammdd-hhmm}` is the current date and time (up to the minute).

Before creating a new Specification, atomically increment `spec-index` and keep the allocated index in memory for the entire Ideation session.

If `counter.json` is missing or inconsistent with the Specification files, recover it by setting `spec-index` to one greater than the highest Specification index found on disk. Do not reuse a Specification index after its allocation has been recorded.

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

- MUST have a unique identifier composed of the Specification index and the Feature sequence inside that Specification.
- `{feat-index}` MUST use the format `{spec-index}-{feature-sequence}` with both components padded to three digits, for example `005-002`.
- Feature sequences start at `1` within each Specification and are assigned in document order.

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

**Features as local tickets**

Besides being included in the Specification document, each Feature MUST always be written to a local standalone ticket.

- Path: `./docs/spec/feat-{sss}-{fff}.md`
- `{sss}` is the Specification index that contains the Feature.
- `{fff}` is the Feature sequence inside the Specification.
- Use the Feature markdown template above for the ticket text.

The local ticket is the persistent Feature reference. The `feat-index` MUST be used consistently in:

- Specification Feature headings.
- Local ticket filenames.
- Planner Feature references.
- References to a Feature in later sessions.

After all agreed Features are written, add each new Feature reference to `planner.json` in `unplanned` with the timestamp when it was first added.


## Updates or revocations

Specifications are immutable historical records. If an agreed Feature changes or is removed:

1. Allocate a new Specification index and create a new Specification document.
2. Rewrite the changed Feature in the new Specification with a new `{spec-index}-{feature-sequence}` identifier.
3. Write the rewritten Feature to a new local ticket.
4. Add the rewrite to `planner.json` when the new Feature is approved and should be planned.
5. In the old local ticket, add an annotation identifying the rewrite and its new Feature reference.
6. If the old Feature is removed rather than rewritten, annotate the old local ticket as `Removed` and reference the new Specification that records the removal.

Do not edit or rewrite the old Specification document. Do not reuse or renumber the old Feature identifier.

If cancellation removes a Feature that is unplanned or scheduled, remove its active reference from `unplanned` or `scheduled` in `planner.json`. If it is completed, preserve the completed history and annotate both the ticket and the new Specification record.
