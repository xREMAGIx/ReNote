---
sidebar_position: 3
---

# Objects and Operations

## Objects

## Operations

## Rules
Operations on CRDTs need to follow these rules:

-   **Associativity** (a+(b+c)=(a+b)+c), so that grouping doesn't matter.
-   **Commutativity** (a+b=b+a), so that order of application doesn't matter.
-   **Idempotence** (a+a=a), so that duplication doesn't matter.

Ref: [Roshi - Soundcloud](https://github.com/soundcloud/roshi)