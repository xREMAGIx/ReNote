# References

## Shorthand Words

**LUB**: Least upper bound

## Defines

### Eventual Consistency (EC)

Eventual delivery: An update delivered at some correct replica is eventually delivered to all correct replicas: ∀i,j : f ∈ ci ⇒ ♦f ∈ cj.

### Strong Eventual Consistency (SEC)

### Monotonic semilattice object

A state-based object, equipped with partial order ≤, noted (S,≤,s0,q,u,m), that has the following properties, is called a monotonic semi-lattice:

- Set S of payload values forms a semilattice ordered by ≤.
- Merging state s with remote state s′ computes the LUB of the two states, i.e., s - m(s′ ) = s ⊔ s′ .
- State is monotonically non-decreasing across updates, i.e., s ≤ s - u

### Commutativity

Operations f and g commute, if for any reachable replica state S where their source pre-condition is enabled, the source precondition of f (resp. g) remains enabled in state S - g (resp. S - f), and S - f - g and S - f - g are equivalent abstract states.

## Papers

[A comprehensive study of Convergent and Commutative Replicated Data Types](https://inria.hal.science/inria-00555588/document)

[Conflict-free Replicated Data Types](https://inria.hal.science/inria-00609399v1/document)

[Near Real-Time Peer-to-Peer Shared Editing on Extensible Data Types](https://www.researchgate.net/publication/310212186_Near_Real-Time_Peer-to-Peer_Shared_Editing_on_Extensible_Data_Types)

## Blogs

[An introduction to state-based CRDTs](https://www.bartoszsypytkowski.com/the-state-of-a-state-based-crdts/)

[CRDT: Conflict-free Replicated Data Types](https://medium.com/@amberovsky/crdt-conflict-free-replicated-data-types-b4bfc8459d26)