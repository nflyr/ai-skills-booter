---
name: arquis
description: Generate or Modify a Business Component following specific architecture principles.
---

By invoking this skill, the user is asking you to generate or modify a software package with a Business Component. You will RELENTLESSLY following the opinionated principles defined in this specification. This specification is divided into three sections: Architectural Concepts (AC), Predictable Structure (PS), and Language Specifics (LS).

---

## Architectural Concepts (AC)

### AC-1: Business Component

A Business Component (BC) is a software package whose ubiquitous `name` can be well understood by product managers and users. BC is the unit of deployment, integration and discoverability. BCs provide significant value which is exposed to external systems via Controllers.

A BC hosts one or more Aggregates (each containing one or more Entities) and usually just one Business Facade, keeping components focused and maintainable.

**Importante Note**: **Business Component = Domain**, the terms "Business Component" and "Domain" are unified and used indistinctly in this specification to reference the same conceptual unit within the system architecture.

A BC is composed by the following parts:

- **Discoverability**: The BC SHALL contain a DEFINITION document with metadata, that serves as the reference for understanding the Structure, Invariant and Capabilities of the BC. This document is to be created and maintained by developers, including AI Agents. The following assets are components of discoverability:
   - The DEFINITION document `<bc-name>-metadata.json`.
      - Java: The metadata file is localted in the `src/main/resources/<bc-name>` directory.
      - Node.js or Bun: The metadata file is located in the `<bc>/server` directory of the BC package.
   - Java: The metadata file is localted in the `src/main/resources` directory of the BC package.
   - Node.js or Bun: The metadata file is located in the `<bc>/server` directory of the BC package.

**Language Specifics**: The BC SHALL follow the language-specific conventions and directory structures as outlined in the sections below.
`<bc-name>-metadata.json` that defines the metadata for the Business Component, and serves as the entry point for understanding the structure and capabilities of the BC.

- Java: The metadata file is localted in the `src/main/resources` directory of the BC package.
- Node.js or Bun: The metadata file is located in the `<bc>/server` directory of the BC package.

A BC is composed of one or more Aggregates, a Business Facade, and supporting artifacts such as Controllers, Domain Services, and Domain Events.

- Domains SHALL have a ubiquitous `name` that is used to prefix all its technical artifacts, represented in this specification as `<bc-name>`.
- BCs/Domains SHALL:
   - Own a coherent business capability within the system.
   - Expose a public Service contract.
   - Contain one or more Aggregates.
   - Define integration boundaries with other BCs.
- Domains contain:
   - One or more Aggregates.
   - At least one Controller artifact.
   - One Domain Service artifactthat at least exposes discoverability of the Domain.
   - One Domain Events artifact for significant occurrences within the Domain.

### AC-2: Aggregate = Consistency Boundary

Aggregates are responsible for maintaining business consistency within its own scope.

Aggregates SHALL:

- Have exactly one Aggregate Root.
- Own its Entities, Value Objects and Validation rules.
- Expose behavior through its Aggregate Root.
- Aggregates are PEERS and SHALL NOT contain other Aggregates.
- Have a ubiquitous `name` inside the Domain scope that is used to prefix all its technical artifacts.

#### 2.1: Model

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

#### 2.2: Identity-Based References

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

**\*\***\*\*\***\*\*** ficou por aqui \***\*\*\*\***

## Aggregates must remain independent.

#### Principle 6: Aggregate Roots Own State Transitions

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

## Predictable Structure (PS)

Domain generation and maintenance MUST follow a predictable structure that ensures location, namings and metadata consistency across the codebase.
Agents MUST assume and ENSURE that all generated or maintained Domains and Aggregates adhere to this predictable structure.

### PS-1: Architectural Structure

Domains SHALL follow the predictable architectural structure illustrated below:

```text
<domain>/
<domain>/<domain>-metadata.json
<domain>/<domain-controller-code>
<domain>/<domain-service-code>
<domain>/<aggregate[name]>/
<domain>/<aggregate[name]>/<aggregate[name]-controller-code>
<domain>/<aggregate[name]>/<aggregate[name]-service-code>
<domain>/<aggregate[name]>/<aggregate[name]-domain-code>
<domain>/<aggregate[name]>/<aggregate[name]-repository-code>
```

Legend:

- `domain-comtroller-code`: Gives access to Domain-level controller logic. May have several implementations.
- `domain-service-code`: Gives access to Domain-level service logic. May be invoked by controllers or other services within the Domain.
- `aggregate[name]`: Each aggregate as a ubiquitous name within the Domain.
- `aggregate[name]-controller-code`:
- `aggregate[name]-service-code`
- `aggregate[name]-domain-code`
- `aggregate[name]-repository-code`

-

### PS-2: Metadata structure

Domains MUST include a metadata document `<domain>-metadata.json`, in JSON format, located at the root of the Domain folder.
Metada documents MUST follow the structure defined in the Domain Metadata Template `templates/domain-metadata-template.md`.

```text
<domain>/
<domain>/<domain>-metadata.json
<domain>/<domain-controller-code>
<domain>/<domain-service-code>
<domain>/<aggregate-a>/
<domain>/<aggregate-a>/<aggregate[name]-controller-code>
<domain>/<aggregate-a>/<aggregate[name]-service-code>
<domain>/<aggregate-a>/<aggregate[name]-domain-code>
<domain>/<aggregate-a>/<aggregate[name]-repository-code>
<domain>/<aggregate-b>/
<domain>/<aggregate-b>/<aggregate[name]-controller-code>
<domain>/<aggregate-b>/<aggregate[name]-service-code>
<domain>/<aggregate-b>/<aggregate[name]-domain-code>
<domain>/<aggregate-b>/<aggregate[name]-repository-code>
```

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

# End of Specification

[ ] No deviations are allowed unless explicitly approved by the user.

[ ] Any doubts or uncertainties should be resolved by consulting the user to ensure alignment with the defined architectural principles.
