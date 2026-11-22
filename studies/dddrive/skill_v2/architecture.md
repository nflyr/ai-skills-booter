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

The specification of file paths and coding templates, you MUST interpret `{Placeholder}` as the literal that represents one of the values mentioned in the table below.
The placeholder literal defines the casing convention to use in case of names (not in the case of descriptions).
For example, if you have a domain named `InvoiceDetail` then it assumes the casing used in the placeholder:

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

- Domain is identified by a ubiquitous name and a mandatory description.
- Domains contains one or more Aggregates.
- Aggregate is identified by a ubiquitous name in the Domain context that may match the Domain's name and a mandatory description.
- Aggregates contains one or more elements of type "Entity" and zero or more elements of type "Value Object".
- Aggregates may declare elements of type "Type" (reusable data structures).
- Entity is identified by a ubiquitous name in the Domain context that may match the Aggregate's name and a mandatory description.
- The Aggregate root is the Entity with the same name as the Aggregate unless explicitly declared otherwise.
-

<draft>

Behaviour

Repository

### Coding

<draft>

- All domain code is placed in the same folder at `(...)/domain/{DomainName}`.
- Domain exposes its model and behaviour through module `{DomainName}-declaration.ts` that follow template `template--model-declaration.ts`.
- Domain exposes DTOs and structures through module `{DomainName}-declaration.ts` that follow template `template--model-definition.ts`.
- Domain implements business logic DTOs and structures through module `{DomainName}-declaration.ts` that follow template `template--model-definition.ts`.
