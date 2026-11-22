# Planner

The Planner structure and location are defined in the `## Planner structure and location` section of `reference.md`. If the implementation planner does not exist, create an empty planner.

## Planner principles

The unit of implementation managed by the planner is the Feature.

Each Feature MUST always be in one of the planner groups:

- `unplanned`: Features that have not been scheduled.
   - Features are inserted into the unplanned group when they are created, at the end of an **Ideation** session.

- `scheduled`: ordered Features that are waiting to be implemented. Features are moved in and out of this group as a result of user instruction during a **Plan** session.

- `implementing`: Features that are being implemented. Features are moved in and out of this group by the start and end of an **Implementation** session.

- `completed`: Features that have already been implemented, deleted or replaced.

Each Feature is referenced in the planner using its Feature identifier, described in the `## Feature naming and reference` section of `reference.md`.

For each Feature identifier moved into a group, record the timestamp when it entered that group.

## Plan mode tasks

When Plan mode is active, perform only these planner tasks:

- Add a Feature to `scheduled`.
- Move a Feature from `scheduled` into `unplanned`.
- Reorder Features in `scheduled`. The order of entries in `scheduled` is the implementation order.
- Show planner statistics.

### Add

Features are added to the planner at the time of their creation:

1. Locate the Feature identifier in `unplanned`.
2. Move it to `scheduled`.
3. Set the entry timestamp to the current time.
4. Append it to `scheduled` unless the user specifies a position.

Do not add a Feature that is already in `scheduled` or `completed`.

### Remove

When the user removes a Feature from the schedule:

1. Locate the Feature identifier in `scheduled`.
2. Move it to `unplanned`.
3. Set the entry timestamp to the current time.

Do not remove a Feature from `completed`.

### Reorder

When the user reorders Features in `scheduled`:

1. Preserve every scheduled Feature identifier.
2. Apply the requested order.
3. Keep each Feature entry and timestamp unchanged.

### Statistics

When the user requests statistics, report the number of Features in each planner group:

- Unplanned count
- Scheduled count
- Completed count

The statistics are informational only. Do not change planner state unless the user also requests a change.
