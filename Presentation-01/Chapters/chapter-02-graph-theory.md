# Chapter 2 — Graph Theory (Study Guide)

This is the toolbox chapter — the mathematical language every later chapter speaks. It
looks elementary, but the definitions here (degree distribution, adjacency matrix,
paths, clustering) are the exact quantities that become *surprising* once we hit real
networks in Chapter 4. Master these cold: a shaky grip on $\langle k\rangle$, $p_k$,
$\langle d\rangle$, and $C$ makes everything afterward foggy. Since it's foundational
and you flagged it as important, this guide is thorough and keeps every definition with
its formula. Book figures embedded inline.

**The one-line idea:** a network becomes a *graph* — nodes and links — and once we
have that abstraction, a handful of measures ($k$, $\langle k\rangle$, $p_k$, $A_{ij}$,
$\langle d\rangle$, $C$) capture almost everything we'll want to know.

---

## 2.1 The bridges of Königsberg — where graph theory began

Euler, 1736. The city of Königsberg had seven bridges across the Pregel river, and
the puzzle was whether you could walk a route crossing each bridge exactly once (an
==**Eulerian path**==). Euler's insight: the answer doesn't depend on the *geography*, only
on the *connectivity* — so redraw the problem as a graph (land masses = nodes, bridges
= links). ==He proved such a path exists **iff** the graph has zero or exactly two nodes
of **odd degree**. Königsberg had four odd-degree nodes → no such walk.==

![The Bridges of Königsberg](https://networksciencebook.com/images/ch-02/figure-2-1.jpg)
*Image 2.1 — the seven bridges and their reduction to a four-node graph. The birth of
graph theory: the first proof that a network's *structure*, not its layout, determines
its properties.*

The moral that carries through the whole book: **structure is what matters, and the
graph abstraction is what exposes it.**

---

## 2.2 Networks and graphs

A **graph** has $N$ nodes (the number of nodes = the network's **size**) and $L$ links.
Key distinctions:
- **Undirected** (links have no orientation: friendships, power lines) vs. **directed**
  (links point one way: the WWW, who-follows-whom, metabolic reactions). A directed
  network is a **digraph**.
- **Components / the choice of what is a node or link is a modeling decision** — the
  same system can be represented by different graphs depending on the question. Getting
  this representation right is half the battle.

![Different Types of Networks](https://networksciencebook.com/images/ch-02/figure-2-2.jpg)
*Image 2.2 — undirected vs directed graphs, with the node degrees labeled.*

![The Choice of Links Matters](https://networksciencebook.com/images/ch-02/figure-2-4.jpg)
*Image 2.4 — the same set of individuals yields different networks depending on which
relationship you draw as a link.*

---

## 2.3 Degree, average degree, and degree distribution

**Degree** $k_i$ = the number of links node $i$ has. This is the single most important
node-level quantity in the book.

**Total links from degrees** (undirected — the factor $\frac12$ because each link
touches two nodes):
$$ L = \frac{1}{2}\sum_{i=1}^{N} k_i $$

**Average degree:**
$$ \langle k\rangle = \frac{1}{N}\sum_{i=1}^{N} k_i = \frac{2L}{N} $$

**Directed networks** split degree into in- and out-degree, $k_i = k_i^{in} +
k_i^{out}$, and here $L = \sum_i k_i^{in} = \sum_i k_i^{out}$ (no $\frac12$, since the
two sums count incoming and outgoing separately), giving $\langle k^{in}\rangle =
\langle k^{out}\rangle = L/N$.

**Degree distribution** $p_k$ = the probability a randomly chosen node has degree $k$:
$$ p_k = \frac{N_k}{N}, \qquad \sum_{k=1}^{\infty} p_k = 1 $$
where $N_k$ = number of degree-$k$ nodes (so $N_k = N p_k$). This is *the* central
object of network science — most network properties require knowing $p_k$, and the
average degree can be recovered from it as $\langle k\rangle = \sum_k k\, p_k$.

![Degree Distribution](https://networksciencebook.com/images/ch-02/figure-2-3.jpg)
*Image 2.3 — $p_k$ as a normalized histogram. For a regular lattice (every node degree
2) it's a Kronecker delta $p_k = \delta(k-2)$; for a real network it's a broad
distribution. The whole drama of Chapter 4 is about the *shape* of this curve.*

---

## 2.4 The adjacency matrix

The complete numeric representation of a graph. $A_{ij} = 1$ if there's a link from $i$
to $j$, else $0$.
- **Undirected** → $A$ is **symmetric** ($A_{ij} = A_{ji}$).
- **Directed** → $A$ is generally **asymmetric**.
- Degrees are row/column sums: $k_i = \sum_j A_{ij}$ (undirected);
  $k_i^{out} = \sum_j A_{ij}$, $k_i^{in} = \sum_j A_{ji}$ (directed).

The adjacency matrix is how networks enter a computer and how many properties get
computed (e.g. counting paths via powers of $A$).

![The Adjacency Matrix](https://networksciencebook.com/images/ch-02/figure-2-5.jpg)
*Image 2.5 — small graphs and their adjacency matrices, undirected (symmetric) and
directed (asymmetric).*

---

## 2.5 Real networks are sparse

A crucial empirical fact. The **maximum** possible number of links is $L_{max} =
\binom{N}{2} = \frac{N(N-1)}{2}$. A network where $L \approx L_{max}$ is **complete
(dense)**. Real networks are the opposite — **sparse**: $L \ll L_{max}$, and $\langle
k\rangle \ll N$. A person knows hundreds of people, not billions; a protein interacts
with a handful of others, not all of them.

Consequence: the adjacency matrix is mostly zeros, and $\langle k\rangle$ is tiny
compared to $N$ — a fact the mathematics leans on constantly (e.g. $p \to 0$ in the
random-network limit).

![Real Networks are Sparse](https://networksciencebook.com/images/ch-02/figure-2-7.jpg)
*Image 2.7 — a table of ten reference networks (Internet, WWW, power grid, proteins,
etc.) with their $N$, $L$, $\langle k\rangle$. Note how small $\langle k\rangle$ is
relative to $N$ everywhere.*

---

## 2.6 Weighted networks

Links can carry a **weight** $w_{ij}$ — ==the strength, frequency, or capacity of the
interaction (call minutes between two people, traffic on a cable, reaction flux).== In a
weighted network the adjacency matrix holds the weights, not just 0/1. Many real
networks are weighted; we often study the unweighted "backbone" first for simplicity,
then add weights where they matter (as in the community/epidemic chapters).

---

## 2.7 Bipartite networks

A **bipartite** network has two distinct classes of node, with links only *between*
classes, never within. Examples: actors–movies, genes–diseases (the "diseasome"),
users–products. From a bipartite network you can build two **projections** — e.g. an
actor-collaboration network (two actors linked if they shared a film) and a
movie-network. Projections are how many famous one-mode networks are actually derived.

![Bipartite Networks](https://networksciencebook.com/images/ch-02/figure-2-11.jpg)
*Image 2.11 — a bipartite graph and its two one-mode projections.*

![The Human Disease Network](https://networksciencebook.com/images/ch-02/figure-2-12.jpg)
*Image 2.12 — the diseasome: a bipartite gene–disease network and its projection,
linking diseases that share genes.*

---

## 2.8 Paths and distances

Distance in a network is measured in **hops**, not physical length — this is what makes
"small worlds" possible.

- **Path** — a route along links from one node to another. **Path length** = number of
  links in it.
- **Shortest path (geodesic)** $d_{ij}$ — the fewest links between $i$ and $j$. Found
  by **breadth-first search (BFS)**. In a directed network $d_{ij} \neq d_{ji}$ in
  general.
- **Diameter** $d_{max}$ — the *longest* shortest path in the network (the two most
  distant nodes).
- **Average path length** $\langle d\rangle$ — the mean shortest path over all node
  pairs. This is the quantity that turns out to be shockingly *small* in real networks
  (Ch. 3's small-world result).

![Paths in a Network](https://networksciencebook.com/images/ch-02/figure-2-15.jpg)
*Image 2.15 — shortest paths, the diameter, and BFS. BFS explores the network in
concentric shells, giving every node's distance from the source.*

---

## 2.9 Connectedness

- A network is **connected** if there's a path between every pair of nodes; otherwise
  it's **disconnected**, splitting into **components** (isolated islands).
- The largest component is often the **giant component** (Ch. 3).
- In **directed** networks, connectedness bifurcates: a **strongly connected component**
  requires directed paths *both* ways between every pair; a **weakly connected
  component** only requires connectivity ignoring direction. The WWW's "bowtie"
  structure is the classic example.
- Connectedness can be read off the adjacency matrix: with the right node ordering, a
  disconnected network's $A$ is **block-diagonal**.

![Connected and Disconnected Networks](https://networksciencebook.com/images/ch-02/figure-2-17.jpg)
*Image 2.17 — a disconnected network and the block structure it induces in the
adjacency matrix.*

---

## 2.10 Clustering coefficient

==Measures how tightly a node's neighbors link to *each other* — the "do my friends know
each other?" quantity.== For node $i$ with degree $k_i$ and $L_i$ links among its
neighbors:
$$ C_i = \frac{2 L_i}{k_i(k_i - 1)} $$
Reading it:
- $C_i = 0$: none of $i$'s neighbors are linked.
- $C_i = 1$: $i$'s neighbors form a complete graph (all know each other).
- $C_i$ = the **probability that two neighbors of $i$ are linked**. So $C_i = 0.5$
  means a 50% chance two of your friends are friends.

The denominator $k_i(k_i-1)/2$ is the number of *possible* links among the neighbors,
so $C_i$ is the fraction of those that actually exist — the local link density.

**Average clustering coefficient** $\langle C\rangle = \frac{1}{N}\sum_i C_i$ captures
the whole network's tendency toward tight-knit neighborhoods. Real social networks have
*high* $\langle C\rangle$ (your friends tend to know each other) — a fact random
networks fail to reproduce (Ch. 3), motivating better models.

![Clustering Coefficient](https://networksciencebook.com/images/ch-02/figure-2-16.jpg)
*Image 2.16 — $C_i$ for a central node under three neighborhood configurations (sparse
to complete), plus a worked small network with each node's $C_i$ and the network's
$\langle C\rangle$.*

> **Advanced Topic 2.A — the global clustering coefficient** $C_\Delta$ defines
> clustering at the whole-network level via triangles:
> $C_\Delta = \frac{3 \times (\text{number of triangles})}{\text{number of connected
> triples}}$. It and $\langle C\rangle$ measure related but not identical things — worth
> knowing the distinction if you report clustering in a thesis.

---

## 2.11 Summary — the measures that matter

The toolbox you carry into every later chapter:
- **Size**: $N$ nodes, $L$ links; real networks are **sparse** ($L \ll L_{max}$).
- **Degree**: $k_i$, average $\langle k\rangle = 2L/N$, distribution $p_k = N_k/N$ —
  $p_k$ is the star, and its shape drives everything from Chapter 4 on.
- **Adjacency matrix** $A_{ij}$: the computational representation.
- **Distances**: shortest path $d_{ij}$ (via BFS), diameter $d_{max}$, average
  $\langle d\rangle$ — surprisingly small in real networks.
- **Connectedness**: components and giant components; strong vs weak for directed nets.
- **Clustering** $C_i = \frac{2L_i}{k_i(k_i-1)}$ and $\langle C\rangle$: local link
  density, high in real networks.

Each of these becomes a *puzzle* in Chapter 3, when we compute them for the random
network model and find the predictions don't match reality — which is exactly what
forces the scale-free ideas of Chapter 4.

---

