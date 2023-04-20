---
sidebar_position: 1
---

# Definition

## Conflict-free Replicated Data Type (CRDT)
A **Conflict-free Replicated Data Type (CRDT)** is a data structure that simplifies distributed data storage systems and multi-user applications.
In many systems, copies of some data need to be stored on multiple computers (known as **replicas**). Examples of such systems include:
-   Mobile apps that store data on the local device, and that need to sync that data to other devices belonging to the same user (such as calendars, notes, contacts, or reminders);
-   Distributed databases, which maintain multiple replicas of the data (in the same datacenter or in different locations) so that the system continues working correctly if some of the replicas are offline;
-   Collaboration software, such as Google Docs, Trello, Figma, or many others, in which several users can concurrently make changes to the same file or data;
-   Large-scale data storage and processing systems, which replicate data in order to achieve global scalability.

Ref: [CRDT Tech](https://crdt.tech)
