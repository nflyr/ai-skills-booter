---
name: arquis
description: Generate or Modify a Business Component following specific architecture principles.
---

By invoking this skill, the user is asking you to generate or modify a Business Component by RELENTLESSLY following the opinionated subset of Domain-Driven Design (DDD) defined in this specification.

**Objective**

The agent should consistently generate or maintain:

- Predictable code structures
- Discoverable metadata
- Strong encapsulation
- Explicit business operations
- Aggregate-centric consistency boundaries
- Stable integration contracts
  The generated architecture is intended for business applications where Domains are exposed as reusable Business Components.

# Core Principals

## 1: Domain = Business Component

**The Domain is the unit of deployment, integration, discoverability and reuse.**

A Domain represents a Business Component:

- Owns a coherent business capability.
- Exposes a public Service contract.
- May contain one or more Aggregates.
- Defines integration boundaries with other Domains.

A Domain may contain one or more Aggregates:

- Each Aggregate is isolated within the Domain.
- Aggregates are peers and SHALL NOT contain other Aggregates.

<maybe delete this section>

Example:

```text
Onboarding Domain
├── Simulation Aggregate
├── Proposal Aggregate
└── Onboarding Service
```

</maybe delete this section>

---

## 2: Aggregate = Consistency Boundary

An Aggregate is responsible for maintaining business consistency within its own scope:

- Has exactly one Aggregate Root.
- Owns its Entities.
- Owns its Value Objects.
- Owns its validation rules.
- Exposes behavior through its Aggregate Root.

### 2.1: Model

The Model is composed by the compound of ISOLATED models of each of its Aggregates:

- The Model only exists within the context of an Aggregate, and each model element belongs to exactly one Aggregate.
- Entities and Value Objects SHALL NOT be shared between Aggregates.
- If the same business concept appears in multiple Aggregates, it shall either:
   - Be duplicated across Aggregates.
   - Be referenced through an identity from another Aggregate.
   - ASK the user for guidance on how to handle the shared business concept.

**The concept of the Domain Model only exists as the compound of ISOLATED models of each of its Aggregates**

<maybe delete this section>

Example:

```text
Proposal Aggregate
Proposal (Root)
├── Applicant
├── CoApplicant
└── ProposalConditions
```

</maybe delete this section>

### 2.2: Identity-Based References

Aggregates SHALL reference other Aggregates only through identities.

<maybe delete this section>

Preferred:

```typescript
simulationId: SimulationId;
```

Allowed:

```typescript
simulationId: string;
```

Forbidden:

```typescript
simulation: Simulation;
```

Forbidden:

```typescript
proposal.simulation.calculateLoan();
```

</maybe delete this section>

******\*\*\******* ficou por aqui ****\*****

## Aggregates must remain independent.

## Principle 6: Aggregate Roots Own State Transitions

All state transitions SHALL be exposed through Aggregate Root operations.
Allowed:

```typescript
proposal.approve();
proposal.refuse();
proposal.cancel();
```

Forbidden:

```typescript
proposal.status = "APPROVED";
```

Forbidden:

```typescript
proposalEntity.status = "APPROVED";
```

## Business behavior must always be explicit.

## Principle 7: Services Coordinate Use Cases

Services coordinate business use cases involving:

- One Aggregate
- Multiple Aggregates
- Repository access
- External integrations
  Services are the public API of the Domain.
  Example:

```typescript
onboardingService.createSimulation();
onboardingService.createProposal();
onboardingService.approveProposal();
```

## External consumers SHALL communicate exclusively through Services.

## Principle 8: Repositories Persist Aggregates

Repositories belong to Aggregates.
Each Aggregate SHALL define its own Repository contract.
Example:

```text
simulation-repository.ts
proposal-repository.ts
contract-repository.ts
```

Repositories persist Aggregate state.
Repositories SHALL NOT contain business logic.

---

## Principle 9: DTOs Are Integration Contracts

Services SHALL expose DTOs.
External consumers SHALL NEVER receive:

- Aggregate Roots
- Entities
- Value Objects
- Repository implementations
  Example:

```typescript
ProposalDTO;
SimulationDTO;
ContractDTO;
```

## DTOs define stable integration contracts.

## Principle 10: Metadata Is First-Class

Every generated Domain SHALL expose metadata describing:

- Domain structure
- Aggregate structure
- Operations
- Validation rules
- Enumerations
- DTO contracts
  Metadata exists to support:
- UI generation
- Validation discovery
- Documentation
- AI-agent introspection
- Runtime discoverability

---

# Architectural Structure

Generated Domains SHALL follow this structure:

```text
<domain>/
├── <domain>-model.ts
├── <domain>-dto.ts
├── <domain>-service.ts
├── <domain>-controller.ts
│
├── <aggregate-a>/
│   ├── <aggregate-a>-domain.ts
│   ├── <aggregate-a>-repository.ts
│   └── <aggregate-a>-repository-impl.ts
│
├── <aggregate-b>/
│   ├── <aggregate-b>-domain.ts
│   ├── <aggregate-b>-repository.ts
│   └── <aggregate-b>-repository-impl.ts
│
└── metadata/
	└── <domain>-definition.ts
```

Example:

```text
onboarding/
├── onboarding-model.ts
├── onboarding-dto.ts
├── onboarding-service.ts
├── onboarding-controller.ts
│
├── simulation/
│   ├── simulation-domain.ts
│   ├── simulation-repository.ts
│   └── simulation-sqlite-repository.ts
│
├── proposal/
│   ├── proposal-domain.ts
│   ├── proposal-repository.ts
│   └── proposal-sqlite-repository.ts
│
└── metadata/
	└── onboarding-definition.ts
```

---

# Domain Definition Contract

AI agents SHALL accept Domain definitions in the following form:

```typescript
{
  domain: {
	name: "Onboarding",
	description: "Financial onboarding process"
  },
  aggregates: {
	Simulation: {
  	description: "Loan simulation process",
  	root: "Simulation",
  	entities: {},
  	valueObjects: {},
  	enumerations: {},
  	operations: [],
  	validations: []
	},
	Proposal: {
  	description: "Credit proposal lifecycle",
  	root: "Proposal",
  	entities: {},
  	valueObjects: {},
  	enumerations: {},
  	operations: [],
  	validations: []
	}
  }
}
```

---

# Aggregate Definition Contract

Every Aggregate definition SHALL contain:

```typescript
{
  name: "Proposal",
  description: "Credit proposal",
  root: {},
  entities: {},
  valueObjects: {},
  enumerations: {},
  operations: [],
  validations: []
}
```

---

# Domain Service Definition

Each Domain SHALL expose a single Domain Service.
Example:

```typescript
OnboardingService;
```

This Service represents the public Business Component API.
Consumers SHALL depend on the Domain Service rather than on individual Aggregates.
Example:

```typescript
onboardingService.createProposal(...)
onboardingService.approveProposal(...)
onboardingService.createSimulation(...)
```

---

# Allowed Aggregate Dependencies

Allowed:

```text
Proposal
	└── SimulationId
```

Allowed:

```text
OnboardingService
	├── ProposalRepository
	└── SimulationRepository
```

Forbidden:

```text
Proposal
	└── Simulation
```

Forbidden:

```text
ProposalEntity
	└── SimulationEntity
```

Forbidden:

```text
ProposalRepository
	└── SimulationRepository
```

## Cross-Aggregate interaction SHALL occur only through Services.

# Service Responsibilities

Services SHALL:

- Load Aggregates.
- Coordinate Aggregates.
- Invoke Aggregate behavior.
- Persist Aggregate changes.
- Perform cross-Aggregate validation.
- Invoke external integrations.
- Transform Domain objects into DTOs.
- Publish Domain-level events when applicable.
  Services SHALL NOT:
- Expose repository internals.
- Duplicate Aggregate business rules.
- Bypass Aggregate behavior.
- Manipulate Aggregate state directly.

---

# Aggregate Responsibilities

Aggregate Roots SHALL:

- Protect invariants.
- Enforce state transitions.
- Execute business rules.
- Manage internal Entities.
- Manage internal Value Objects.
- Emit Aggregate business events when required.
  Aggregate Roots SHALL NOT:
- Query repositories.
- Access databases.
- Call external services.
- Invoke APIs.
- Manipulate other Aggregates directly.

---

# Repository Responsibilities

Repositories SHALL:

- Persist Aggregate state.
- Load Aggregate state.
- Remove Aggregate state.
- Execute persistence-specific queries.
  Repositories SHALL NOT:
- Contain business rules.
- Coordinate Aggregates.
- Invoke external integrations.
- Perform orchestration logic.

---

# Metadata Contract

Every generated Domain SHALL expose:

```typescript
getDomainDefinition();
```

Returns:

```typescript
{
  domain: {},
  aggregates: {}
}
```

---

Every generated Domain SHALL expose:

```typescript
getAggregateDefinition(aggregateName);
```

Returns:

```typescript
{
   (name, root, entities, valueObjects, operations, validations);
}
```

---

Every generated Domain SHALL expose:

```typescript
getOperationDefinitions();
```

## Returns all available Service and Aggregate operations.

Every generated Domain SHALL expose:

```typescript
getValidationDefinitions();
```

## Returns all structural and business validation definitions.

# Controller Responsibilities

Controllers are optional boundary adapters.
Examples:

```text
REST
GraphQL
CLI
Message Bus
Scheduled Jobs
Background Workers
```

Controllers SHALL:

- Validate requests.
- Invoke Services.
- Handle transport concerns.
- Return DTOs.
  Controllers SHALL NOT contain business logic.

---

# Model Discoverability

Each Domain SHALL expose discoverable metadata for AI agents.
The following information SHALL be introspectable:

- Available Aggregates
- Aggregate structures
- Entity structures
- Value Object structures
- Enumerations
- Operations
- Validation rules
- DTO definitions
  AI agents SHALL be able to generate consumers, forms, APIs and documentation entirely from metadata.

---

# Generation Rules For AI Agents

When generating a Domain:

1. Generate exactly one Domain Service.
2. Generate one Repository per Aggregate.
3. Generate one Aggregate Root per Aggregate.
4. Place Aggregate business rules inside Aggregate Roots.
5. Place cross-Aggregate orchestration inside Services.
6. Use identifier-based Aggregate references.
7. Return DTOs from Service operations.
8. Generate complete metadata definitions.
9. Prevent Aggregate-to-Aggregate object references.
10.   Prevent direct state mutations.
11.   Preserve Aggregate boundaries.
12.   Treat the Domain as the Business Component boundary.

---

# Final Architectural Statement

The Domain represents the Business Component boundary.
A Domain may contain one or more Aggregates.
Each Aggregate defines its own consistency boundary and is managed through a single Aggregate Root.
Aggregate Roots own business behavior, invariants and state transitions.
Repositories persist Aggregates.
Services orchestrate use cases and cross-Aggregate interactions.
DTOs define integration contracts.
Metadata provides discoverability and AI-driven introspection.
External consumers interact exclusively through the Domain Service API and SHALL NEVER directly manipulate Aggregate Roots, Entities, Value Objects or Repositories.
