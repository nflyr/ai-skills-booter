# Reference

## Specification naming and reference

Specification documents are located in `docs/spec`.

Specification names follows the pattern `spec-{spec-index}-{aaaammdd-hhmm}.md` where:

- `{spec-index}` is a number, unique for each Sepecification, padded to three digits.
- `{aaaammdd-hhmm}` is the current date and time (up to the minute).
- For example, `spec-005-20261011-1632.md` is the name of Specification number 5.

Keeping `{spec-index}` unique:

- A counter number is kept in `docs/spec/counter.json`.
- Before creating a new Specification, atomically increment `spec-index` and keep the allocated index in memory for the entire Ideation session.
- If `counter.json` is missing or inconsistent with the Specification files, recover it by setting `spec-index` to one greater than the highest Specification index found on disk. Do not reuse a Specification index after its allocation has been recorded.

---

## Feature naming and reference

Feature documents are located in `docs/spec`.

Feature doc names follows the pattern `feat-{spec-index}-{feature-sequence}.md` where:

- `{spec-index}` is defined above.
- `{feature-sequence}` start at `1` within each Specification and are assigned in document order, and is padded to three digits.
- For example, `feat-005-002.md` is the name of the second Feature of Specification number 5.

The term `{feature-index}` is the same as `{spec-index}-{feature-sequence}` and represents the UNIQUE Feature index.

---

## Planner structure and location

The planner document has the following JSON structure:

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
   "implementing": [
      {
         "feature": "{feature-reference}",
         "timestamp": "{ISO-8601 timestamp}"
      }
   ],
   "completed": [
      {
         "feature": "{feature-reference}",
         "timestamp": "{ISO-8601 timestamp}",
         "status": "{implemented | deleted | replaced}"
      }
   ]
}
```

The implementation planner is stored in `./docs/spec/planner.json`.

An empty planner is:

```json
{
   "unplanned": [],
   "scheduled": [],
   "implementing": [],
   "completed": []
}
```
