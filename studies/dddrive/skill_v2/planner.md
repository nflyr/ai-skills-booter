# Planner

The implementation planner structure and location is defined in section `## The Planner structure` of `reference.md`.

If the implementation planner does not exist, create an empty planner.

## Planner principles

The unit of implementation managed by the planner is the **Feature**.

Each Feature MUST be at all times inside of one of the planner groups.

- `unplanned`: Feature references that have not been scheduled.
   - Features are inserted into the unplanned group when they are created, at the end of a **Ideation** session.

- `scheduled`: ordered Feature references that are waiting to be implemented. Features moved in and out of this group as a result of user instruction during a **Plan** session.

- `implementing`: Feature references that are being implemented. Features moved in and out of this group by the start and end of an **Implementation** session.

- `completed`: Feature references that have been implemented.

For each Feature reference moved into a group, record the timestamp when it entered that group.

A Feature reference MUST use the local ticket identity `feat-{sss}-{fff}.md`, where `{sss}` is the Specification index and `{fff}` is the Feature sequence inside that Specification, for example `feat-005-002.md`.

## Plan mode tasks

When Plan mode is active, perform only these planner tasks:

- Add a Feature to `scheduled`.
- Move a Feature from `scheduled` into `unplanned`.
- Reorder Features in `scheduled`. The order of entries in `scheduled` is the implementation order.
- Show planner statistics.

### Add

Features are added into the planner at the time of their creation:

1. Locate the Feature reference in `unplanned`.
2. Move it to `scheduled`.
3. Set the entry timestamp to the current time.
4. Append it to `scheduled` unless the user specifies a position.

Do not add a Feature that is already in `scheduled` or `completed`.

### Remove

When the user removes a Feature from the schedule:

1. Locate the Feature reference in `scheduled`.
2. Move it to `unplanned`.
3. Set the entry timestamp to the current time.

Do not remove a Feature from `completed`.

### Reorder

When the user reorders Features in `scheduled`:

1. Preserve every scheduled Feature reference.
2. Apply the requested order.
3. Keep each Feature entry and timestamp unchanged.

### Statistics

When the user requests statistics, report the number of Features in each planner group:

- Unplanned count
- Scheduled count
- Completed count

The statistics are informational only. Do not change planner state unless the user also requests a change.
