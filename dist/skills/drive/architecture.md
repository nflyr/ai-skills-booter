# Architecture principles

You MUST follow the architecture principles for development of software described below. They present a subset of well-known design patterns, like DDD and EBC, with concrete opinionated variations.

## Purpose

- Predictable code structures
- Discoverable metadata
- Strong encapsulation
- Explicit business operations
- Aggregate-centric consistency boundaries
- Stable integration contracts

## Naming placeholders and conventions

When reading the specifications for file paths and coding templates, interpret `{Placeholder}` as the literal that represents one of the values mentioned in the table below.

The placeholder literal defines the casing convention to use for names (not descriptions). For example, if you have a domain named `InvoiceDetail`, then match the placeholder in the following map:

- `{DomainName}` becomes `InvoiceDetail`
- `{domainName}` becomes `invoiceDetail`
- `{domain_name}` becomes `invoice_detail`

| Placeholder          | Value it represents                                 |
| -------------------- | --------------------------------------------------- |
| DomainName           | Name of the Domain                                  |
| DomainDescription    | Description of a Domain                             |
| ComponentName        | Name of an Aggregate, Entity or Value Object        |
| ComponentDescription | Description of an Aggregate, Entity or Value Object |

## Domain Model

Elements of the Domain Model: **Domain**, **Aggregate**, **Entity**, **Value Object**.

- A Domain is identified by a ubiquitous name and a mandatory description.
- Domains contain one or more Aggregates.
- An Aggregate is identified by a ubiquitous name in the Domain context that may match the Domain's name and a mandatory description.
- Aggregates contain one or more elements of type "Entity" and zero or more elements of type "Value Object".
- Aggregates may declare elements of type "Type" (reusable data structures).
- An Entity is identified by a ubiquitous name in the Domain context that may match the Aggregate's name and a mandatory description.
- The Aggregate root is the Entity with the same name as the Aggregate unless explicitly declared otherwise.
-

<draft>

Behaviour

Repository

### Coding

<draft>

- All domain code is placed in the same folder at `(...)/domain/{DomainName}`.

The Domain:

- Exposes its model and behaviour through the module `{DomainName}-declaration.ts` that follows the template `template--model-declaration.ts`.

- Exposes DTOs and structures through the module `{DomainName}-declaration.ts` that follows the template `template--model-definition.ts`.

- Implements DTOs and structures through the module `{DomainName}-declaration.ts` that follows the template `template--model-definition.ts`.
