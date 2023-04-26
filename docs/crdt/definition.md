---
sidebar_position: 1
---

# Definition

## Conflict-free Replicated Data Type (CRDT)

A **Conflict-free Replicated Data Type (CRDT)** is a data structure that simplifies distributed data storage systems and multi-user applications.
In many systems, copies of some data need to be stored on multiple computers (known as **replicas**). Examples of such systems include:

- Mobile apps that store data on the local device, and that need to sync that data to other devices belonging to the same user (such as calendars, notes, contacts, or reminders);
- Distributed databases, which maintain multiple replicas of the data (in the same datacenter or in different locations) so that the system continues working correctly if some of the replicas are offline;
- Collaboration software, such as Google Docs, Trello, Figma, or many others, in which several users can concurrently make changes to the same file or data;
- Large-scale data storage and processing systems, which replicate data in order to achieve global scalability.

Ref: [CRDT Tech](https://crdt.tech)

## Consistency (TODO)

:::info

Resource: ["Eventual Consistency" vs "Strong Eventual Consistency" vs "Strong Consistency" - StackOverflow](https://stackoverflow.com/questions/29381442/eventual-consistency-vs-strong-eventual-consistency-vs-strong-consistency)

:::

### Eventual Consistency (EC)

Conflicts can arise, but nodes communicate each other their changes to solve those conflicts, so in time they agree upon the definitive value. Thus, if no more changes are applied to the data for a certain period, then all nodes will agree in the data value (i.e. they will eventually agree) so readers of data will eventually see the same value.

Example:

1. Two nodes A and B (nA and nB) have each one copy of a string, which is update with operations `read()` and `write(string)`. Let's say each one has its own client (cliA and cliB).

2. Let's say that initially both nodes store the same value "Joe", but at some moment nA updates it to "Frank" (calls `write("Frank")`).

3. Then nA will tell nB that the value has been updated; as both values differ a conflict has arisen but in can be solved using some policy (for example last-write-wins) so nB finally updates its record also to "Frank".

4. Before the conflict is resolved cliAand cliB will see different versions of the data (the `read()` op result will differ), but eventually both will see the same value again.

Keep in mind that if both nodes update their value simultaneously then conflict resolution is still possible but more complicated. This is where SEC shines.

### Strong Eventual Consistency (SEC)

This is a special case of EC, that is valid only for certain data types.

Example:

1. Let's assume that the data object shared is a counter, and updates are made by add(int value) and substract(int value) operations. In this case, the order in which we apply updates does not matter!

2. So if both nA and nB start with a counter value of 0, and if then nA runs add(10) and nB runs substract(5) (simultaneosly), they only need to send the update operation to each other without caring for conflict resolution, eventually it is ensured that they will reach the same value (remember that, in contrast, in the previous example for EC some conflict resolution could be required)!

### Strong Consistency

Quite different to the other two. Here it is a requirement that upon update operations all nodes agree on the new value before making the new value visible to clients. That way updates are visible to all clients 'at the same time', so they will read the same value at all times. Now this introduces the requirement for some blocking in update operations. Both in EC and SEC an update operation was over as soon as the local copy was updated (then the operation was broadcasted to the other nodes). Here a client update does not return until all nodes have agreed upon the data value, and while this is done all accesses to any copy of that data are 'locked' (so other clients reads are blocked). In our example for EC, if cliA runs `write("Frank")`, cliA will be blocked until the update is agreed by both nA and nB, and then it will made visible for both cliA and cliB at the same time, i.e. the `read()` operation should return the same value from then on.

### Comparison

[TODO](https://www.baeldung.com/cs/eventual-consistency-vs-strong-eventual-consistency-vs-strong-consistency)
[TODO2](https://stackoverflow.com/questions/29381442/eventual-consistency-vs-strong-eventual-consistency-vs-strong-consistency)
