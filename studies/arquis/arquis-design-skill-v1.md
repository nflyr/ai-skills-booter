---
name: arquis
description: Generate or Modify a complete Domain Component following specific DDD and Business Component architecture.
---

## Purpose

The generated component must:

- Encapsulate business rules inside aggregate roots.
- Expose functionality through a Service layer.
- Expose transport through a Controller layer.
- Persist through Repository implementations.
- Return DTOs.
- Be self-describing through metadata definitions.
- Hide entities behind aggregate boundaries.

## Input information

The agent must receive via prompt or inquiry the user through a grilling process the following information:

- Domain ubiquitous name and description.
- Aggregate root: ubiquitous name, description, properties, validations and operations.
- Other Entities: ubiquitous name, description, properties, validations and operations.
- Value Objects: name, description, properties and validations.

# Architecture

The generated component shall contain the following modules:

```text
<domain-name>/
│
├── <domain>-model.ts
│
├── <domain>-dto.ts
│
├── <domain>-domain.ts
│
├── <domain>-repository.ts
│
├── <domain>-sqlite-repository.ts
│
├── <domain>-service.ts
│
└── <domain>-controller.ts
```

---

# Component Responsibilities

## Model

```text
<domain>-model.ts
```

Contains metadata definitions.

Must expose:

```typescript
MODEL_DEFINITION;
OPERATION_DEFINITION;
VALIDATION_RULES;
```

Purpose:

- Runtime introspection
- Documentation
- UI generation
- Agent discovery

No business behavior permitted.

---

## DTO

```text
<domain>-dto.ts
```

Contains DTO objects exchanged across domain boundaries.

Rules:

- DTOs contain only data.
- DTOs contain no behavior.
- DTOs must not expose internal aggregate implementation details.
- DTOs must be serializable.

---

## Domain

```text
<domain>-domain.ts
```

Contains:

- Value Objects
- Entities
- Aggregate Roots
- Domain Enumerations

Rules:

### Value Objects

Must:

- Be immutable.
- Validate their own state.
- Support equality by value.

### Entities

Must:

- Possess identity.
- Be mutable through business behavior.

### Aggregate Root

Must:

- Be the only externally visible business entry point.
- Preserve aggregate consistency.
- Own all child entities.

Must expose intent-oriented methods.

Good:

```typescript
proposal.approve();
proposal.refuse();
proposal.changeCustomerAddress(...);
```

Bad:

```typescript
proposal.setStatus("approved");
customer.address = ...;
```

---

# Aggregate Boundary Rules

Consumers shall never directly manipulate internal entities.

Allowed:

```typescript
proposal.changeCustomerAddress(...);
```

Not allowed:

```typescript
customer.changeAddress(...);
```

unless `Customer` itself is declared as an Aggregate Root.

Entities internal to an aggregate should not be exported.

Example:

```typescript
class Customer {
    ...
}
```

instead of:

```typescript
export class Customer {
    ...
}
```

---

# Repository Contract

```text
<domain>-repository.ts
```

Contains repository interfaces only.

Example:

```typescript
export interface ProposalRepository {
   save(proposal: Proposal): Promise<void>;

   findById(id: number): Promise<Proposal | undefined>;
}
```

Rules:

- No SQL.
- No persistence implementation.
- No infrastructure concerns.
- Repository contracts belong to the application boundary.

---

# Repository Implementation

```text
<domain>-sqlite-repository.ts
```

Contains repository implementations.

Rules:

- Uses SQLite persistence.
- Maps aggregates to relational storage.
- Rehydrates aggregates from persistence.

Typical responsibilities:

```typescript
save();
findById();
delete();
search();
```

Must not contain business validation or business decisions.

---

# Service

```text
<domain>-service.ts
```

Represents the Business Component API.

This is the official public API of the domain.

Other domains shall only communicate through this layer.

Responsibilities:

### Commands

Examples:

```typescript
createProposal();
updateCustomer();
changeCustomerAddress();
sendProposal();
approveProposal();
refuseProposal();
```

Responsibilities:

- Load aggregates from repositories.
- Invoke aggregate behavior.
- Persist changes.
- Return DTOs.

Must not:

- Expose aggregate internals.
- Contain direct SQL.
- Expose entities across domain boundaries.

### Queries

Examples:

```typescript
getProposal();
searchProposals();
```

Responsibilities:

- Retrieve aggregates or data.
- Convert results to DTOs.
- Never expose aggregate internals.

---

# Metadata APIs

Every service must expose:

```typescript
getModelDefinition();

getOperationDefinition();

getValidationRules();
```

These APIs provide runtime discoverability for:

- UIs
- Documentation generation
- Agent interactions
- Integration tooling

---

# Controller

```text
<domain>-controller.ts
```

Represents an access channel.

The controller only adapts input and output formats.

Example:

```typescript
createProposal(request) {

    return this.service.createProposal(
        ...
    );
}
```

Rules:

Controller:

- Must contain no business logic.
- Must contain no validation logic.
- Must contain no persistence logic.
- Must contain no SQL.

Responsibilities:

- Input transformation.
- Output transformation.
- Service delegation.

---

# Validation Placement

Validation must be implemented in the following locations.

### Value Object Validation

Performed during construction.

Example:

```typescript
new Address(...)
```

Typical rules:

- Required fields.
- Data format validation.
- Numeric ranges.
- Simple field constraints.

---

### Aggregate Validation

Performed inside aggregate methods.

Example:

```typescript
proposal.approve();
```

Typical rules:

- State transitions.
- Aggregate consistency.
- Cross-entity invariants.
- Business constraints.

---

### Service Validation

Typical responsibilities:

- Aggregate existence checks.
- Duplicate detection.
- Cross-aggregate lookups.
- Authorization hooks.
- Infrastructure-dependent validations.

---

# State Transition Rules

The generator must prefer explicit domain operations.

Generate:

```typescript
send();
approve();
refuse();
activate();
cancel();
```

Avoid:

```typescript
setStatus(...);
updateStatus(...);
changeState(...);
```

unless explicitly requested.

Reason:

Business intent becomes explicit and validation remains centralized.

Example:

```typescript
proposal.approve();
```

is preferred over:

```typescript
proposal.updateStatus(ProposalStatus.APPROVED);
```

---

# DTO Rules

DTOs shall be used for all communication outside the domain.

Never return:

```typescript
Proposal;
Customer;
Address;
```

Return:

```typescript
ProposalDto;
CustomerDto;
AddressDto;
```

instead.

DTOs must not contain behavior.

---

# Metadata Structure

The model definition should expose:

```typescript
{
    aggregate: "Proposal",

    valueObjects: [...],

    entities: [...],

    operations: [...],

    validations: [...]
}
```

The metadata should fully describe:

- Aggregate root.
- Child entities.
- Value objects.
- Public operations.
- Validation rules.
- State machine transitions.

---

# Dependency Rules

Allowed:

```text
Controller
    ->
Service

Service
    ->
Repository

Service
    ->
Aggregate

Aggregate
    ->
Entities

Aggregate
    ->
Value Objects
```

Forbidden:

```text
Controller
    -> Repository

Controller
    -> Aggregate

Repository
    -> Service

Repository
    -> Controller

Domain
    -> Controller
```

---

# Public Domain Contract

Other domains may access only:

```text
<domain>-service
```

and

```text
<domain>-model
```

Everything else is considered an implementation detail.

---

# Input Specification

The generator shall accept:

- Domain name.
- Aggregate root definition.
- Entity definitions.
- Value object definitions.
- Enumeration definitions.
- Validation rules.
- Business operations.
- State transition rules.
- Persistence technology.

---

# Output Specification

The generator shall produce:

1. `<domain>-model.ts`
2. `<domain>-dto.ts`
3. `<domain>-domain.ts`
4. `<domain>-repository.ts`
5. `<domain>-sqlite-repository.ts`
6. `<domain>-service.ts`
7. `<domain>-controller.ts`

while enforcing:

- Aggregate encapsulation.
- DTO-based communication.
- Intent-oriented domain behavior.
- Repository abstraction.
- Metadata discoverability.
- Proper dependency direction.
- Thin controllers.
- Domain-centric business rules.

---

# Design Principle

The Domain represents the Business Component boundary.

A Domain may contain one or more Aggregates.

Each Aggregate Root is the owner of consistency for its Aggregate only.

Services coordinate use cases involving multiple Aggregates.

Repositories persist a single Aggregate.

Controllers provide access channels.

DTOs provide integration contracts.

Metadata provides discoverability.

External consumers interact exclusively through the Domain Service API and never directly manipulate Aggregate Roots, Entities, Value Objects or Repositories.
