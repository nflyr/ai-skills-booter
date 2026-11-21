# Production Cycle

The term "Production Cycle" applies to agent and user activity related to the evolution of the project or objective in the context of a session. A production cycle starts when requested by the user or invoked by a skill and includes up to three steps in sequence: **Ideation**, **Plan** and **Implement**.

## Ideation

The agent interprets the received requirements and interviews the user in cycles until a shared understanding is being reached, about a statement of **Specifications** organized into distinct **Features** to be implemented. After a shared agreement has being reached, create or update a Specifications document. The agent MUST apply the instructions at `write-specification.md` to write the Specification. Read it at the beginning of the **Ideation**.

**Plan**

so features becomes part of the implementation backlog

Produce and propose an implementation plan for the requirements closed with the user in the previous step. Each main step should deliver value in some specific scope or produce some coherent and complete part of business requirements. Present the plan to the user

Header:

`[{issueId}] {Issue

Body:

```markdown
**Domain**: {DomainName}
**Context**: {Documentation | Coding | Integration | Deployment | Operation}

{free issue description}
```

**Implement**
