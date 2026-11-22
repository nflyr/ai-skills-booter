# Manage Plans

## Planner

The planner is stored in `./docs/spec/planner.json`.

The unit managed by the planner is a **Feature**. The planner MUST contain exactly these three groups:

- `unplanned`: Feature references that have not been scheduled.
- `scheduled`: ordered Feature references that are waiting to be implemented.
- `completed`: Feature references that have been implemented.

For each Feature reference moved into a group, record the timestamp when it entered that group.

A Feature reference MUST use the local ticket identity `feat-{sss}-{fff}.md`, where `{sss}` is the Specification index and `{fff}` is the Feature sequence inside that Specification.

The `{feat-index}` value MUST use the format `{sss}-{fff}`, for example `005-002`. It identifies the Feature without relying on a separate global counter.

## Planner structure

Use the following JSON structure:

```json
{
   "unplanned": [
      {
         "feature": "{feature-reference}",
         "timestamp": "{ISO-8601 timestamp}"
      }
   ],
   "scheduled": [
      {
         "feature": "{feature-reference}",
         "timestamp": "{ISO-8601 timestamp}"
      }
   ],
   "completed": [
      {
         "feature": "{feature-reference}",
         "timestamp": "{ISO-8601 timestamp}"
      }
   ]
}
```

The order of entries in `scheduled` is the implementation order. New entries MUST be appended unless the user explicitly requests another position.

If `./docs/spec/planner.json` does not exist, create it with all three groups as empty arrays:

```json
{
   "unplanned": [],
   "scheduled": [],
   "completed": []
}
```

Do not remove a Feature reference from the planner when changing its status; move it between groups while updating its timestamp.

## Plan mode tasks

When Plan mode is active, perform only these planner tasks:

- Add a Feature to `scheduled`.
- Move a Feature from `scheduled` into `unplanned`.
- Reorder Features in `scheduled`.
- Show planner statistics.

### Add

When the user adds a Feature to the schedule:

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
