# Arch design

Help me build an AI skill named `arquis`.
This skill drives agents to build software components (parts of applications) from reduced prompts where the instructions contain references to terms established by the architectural principles described bellow.

## Concepts

The following concepts derive (inherit partial rules) from the well known concepts of Entity-Control-Boundary, Domain-Driven-Design, and also define Business Component. The concepts are presented from the higher level to the lower level of aggregation.

### Domain Model

- **Aggregate**, **Entity** and **Value Object**, as defined in DDD.

- **Domain**, an architectural boundary, deployable modular unit, that implements a specific business capability and contains its own API, model, persistence, and business rules. It is the broader unit of implementation that is to be requested from each interaction with the skill. There is a similarity with the "Domain" level in DDD and in many cases encapsulates multiple Aggregates.

The agent MUST recognize and identify the meaning of the following acronyms

| acronym | Meaning                                   |
| ------- | ----------------------------------------- |
| AG      | Aggregate in _Domain Model_               |
| AGR     | Aggregate Root (Entity) in _Domain Model_ |
| EN      | Entity in _Domain Model_                  |
| VO      | Value Object in _Domain Model_            |
| DM      | Domain in _Domain Model_                  |

### Behaviour

- **Controller** handles touch points between the boundary of the DM or an AGR and the exterior. Controllers perform validation of mandatory fields and data formats. The DM API only exposes access to transactions that require state transition in more than one Aggregate inside the BC. So we have

- **Service** handles internal behaviour. AGR services protect its own invariants, as well as BC services protect BC invariants and ensure internal consistency.

- **Events**, sss Inter-domain...

- **Event Handlers**, xxx Inter-Domain...

### Repository

Each available repository is bounded at the "Aggregate" level, to the propper component isolation.
Repository methods should be organized in two groups:

- Lifecycle operations, contains methods like `entity.GetById()` and `entity.save()`.
- Aggregate selections, contains methods that return multiple instances based on some state, like `orders.findPending()` and `orders.findCreatedAfter(Date cutoff)`.

### Naming conventions

\***\* This should GO to language specifics \*\***

By example, when we have a DM named Customer with a AGR named Customer, a EN named Address, and a VO Named CreditRating:

| Item                | Naming                           |
| ------------------- | -------------------------------- |
| Domain folder       | customer                         |
| Domain controller   | customer/Controller.[lang]       |
| Customer EN         | customer/ent/Customer.[lang]     |
| Address EN          | customer/ent/Address.[lang]      |
| Credit rating VO    | customer/ent/CreditRating.[lang] |
| Customer Controller | customer/Customer.[lang]         |
| Domain Controller   | /controller/Customer.[lang]      |

### Folder structure by example

\***\* This should GO to language specifics \*\***

When we have a DM named Customer with a AGR named Customer, a EN named Address, and a VO Named CreditRating:

```
customer
customer/ent/customer
customer/ent/address
customer/ent/creditRatings

├── <domain>-domain-definition.ts


```

When we have a DM named Contracting with an AGR named Simulation, a AGR named Proposal, a EN named Prospect, a VO named Salary and a VO named Address:

## Component structure

The following logical components should exist in the implmentation of a Domain:

- **Service**, implements the public API of the domain, contains logic to validate "cross-aggregate" operations. Delegates to Aggregate roots the internal logic/behaviour of those entites. Always exposes a method `getModelDefinition()` to offer a JSON metadata about it's internal entities.

- **Controller**, translates **Service** transport concerns from code to REST. Implementation is framework dependent, for example using Jackson in spring boot or Router in Node.

- **model**, implements the objects of the Domain Model, behaviour Invariants, and exposes a metadata object with the model definition.

- **repository**, is responsible for persistency regarding Domain entities

```
+----------------------+
| proposal-controller  |
| (REST Adapter)       |
+----------+-----------+
           |
           v
+----------------------+
| proposal-service     |
| (BC / Application)   |
+----------+-----------+
           |
           v
+----------------------+
| proposal-domain      |
| (Aggregate Model)    |
+----------+-----------+
           |
           v
+----------------------+
| proposal-repository  |
| (Persistence)        |
+----------------------+
```

### Code structure

- In terms of code implementation, a BC is to be viewed as a vertical implementation (no UI for now), totally implemented inside a folder width a standard subfolder organization derived by the componente tipology.

Boundary -> Controller
Control -> Service
Entity -> Domain Entity

Keep the instructions as much as posible conceptual and agnostic to implementation language or framework. On a subsequent phase we may complement the base skill with aditional skills focused on specific languages and frameworks like "Java with Spring boot" and "Typescript with [Node](https://nodejs.org/en) or [Bun](https://bun.com/)".

Boundary

- WebController
- RESTEndpoint
- UIForm
- DatabaseGateway

DDD

Domain modelling
Ubiquitous language
Bounded contexts
Aggregates
Domain services
Repositories
Value Objects
Domain Events

Rules:

There is Domain Modeling with clear distinction between Value-Object, Entity and Aggregate.
There are Bounded Contexts, wheer
There are Domain servicesThere are Repositories
There are Domain Events (async operations)

Hibrid concepts between ECB and DDD

Business Component -> Domain
Boundary -> Controller
Control -> Service
Entity -> Domain Entity

Example:

Contracting BC

/controller/
simulation
proposal
prospect
/service/
simulation
proposal
prospect
/entity/
Simulation
Proposal
Prospect
Address
/repository/ (one per Aggregate)
Simulation
Proposal
Prospect

## Acronyms

## Usage

## Input information

Each invocation of the skill MUST refer to a single Domain.

The agent must receive via prompt or inquiry the user through a grilling process the following information:

- Domain ubiquitous name and description.
- Aggregate roots: ubiquitous name, description, properties, validations and operations.
- Other Entities: ubiquitous name, description, properties, validations and operations.
- Value Objects: name, description, properties and validations.
- Operations that cross aggregates
- Validation rules for operations that cross aggregates

### Examples

Start designing a business context:

```
Lets build Customer BC.
Customer is root and holds one or more Address EN, one or more ContactInfo and one or more CreditRating.
ContactInfo VO has properties "type" and "value", where type is a enumeration of "email", phoneNumber" and "other".
```

Keep defining the BC:

```
CreditRating En has a rating datetime and a rating percentage.
```

## Important considerations

The agents and models consuming this skill are expected to be savy on software architecure patterns and design principles, so keep the skill instructions as concise as posible.
Critisize
