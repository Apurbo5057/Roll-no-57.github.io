# Chapter 9 — Communities (Study Guide)

Networks aren't uniform — they break into **communities**: groups of nodes densely
wired to each other and loosely wired to the rest. Finding them is one of the most
practically useful problems in network science (it reveals functional modules in
cells, interest groups in society, topics in the Web). This chapter builds the idea
up from *what a community even is* to the algorithms that find them at scale, the
handling of *overlapping* communities, and how to *test* whether an algorithm's
output is real. It's the largest chapter, so this guide keeps the key equations and
the logic of each algorithm while staying navigable. Book figures embedded inline.

**Core tension of the chapter:** the number of ways to partition a network grows
faster than exponentially, so we can never check them all — every method is a clever
heuristic, and none is provably "the" answer.

---

## 9.1 Introduction — communities are real and meaningful

A community is a functional unit you can often *name*. The motivating examples:

![Communities in Belgium](http://networksciencebook.com/images/ch-09/figure-9-1.jpg)
*Image 9.1 — the Belgian mobile-call network splits cleanly into French- and
Dutch-speaking communities, mirroring the country's linguistic divide — recovered
from call data alone.*

![Zachary's Karate Club](http://networksciencebook.com/images/ch-09/figure-9-2.jpg)
*Image 9.2 — the famous karate club: a real club that split into two after a dispute.
The network structure *predicts the split* almost perfectly. The canonical test case
for community detection.*

![Communities in Metabolic Networks](http://networksciencebook.com/images/ch-09/figure-9-3.jpg)
*Image 9.3 — communities in a metabolic network correspond to functional modules
(carbohydrate metabolism, nucleotide metabolism, etc.).*

**H1 — Fundamental Hypothesis:** *A network's community structure is uniquely encoded
in its wiring diagram.* Communities aren't imposed from outside; they're recoverable
from the topology alone.

---

## 9.2 Basics — defining a community and counting partitions

**H2 — Connectedness and Density Hypothesis:** *A community is a locally dense
connected subgraph.* Two requirements: every member is reachable through other
members (connectedness), and nodes link to their own community more than to outsiders
(density). This narrows things but doesn't pin down a unique definition. Several
coexist:

![Connectedness and Density Hypothesis](http://networksciencebook.com/images/ch-09/figure-9-4.jpg)
*Image 9.4 — communities as dense connected subgraphs.*

- **Clique:** a complete subgraph (everyone knows everyone). Automatically satisfies
  H2 but far too rigid — big cliques are rare, and most real communities aren't
  complete.
- **Strong community:** every node has *more* internal than external links:
  $$ k_i^{int}(C) > k_i^{ext}(C) \quad \forall i \in C $$
- **Weak community:** the *total* internal degree exceeds the total external degree
  (relaxes "strong" to hold on average, not per-node):
  $$ \sum_{i \in C} k_i^{int}(C) > \sum_{i \in C} k_i^{ext}(C) $$

Nesting: every clique is a strong community, every strong community is a weak one; the
converses fail.

![Defining Communities](http://networksciencebook.com/images/ch-09/figure-9-5.jpg)
*Image 9.5 — clique (orange), strong (purple), weak (green) communities in one graph.*

### The combinatorial explosion (why this is hard)

**Graph bisection** (split into two fixed halves, minimize the *cut size* = links
between groups): the number of ways to split $N$ nodes into $N_1, N_2$ is
$\frac{N!}{N_1!N_2!}$, which grows *exponentially*. For $N=100$ split evenly, that's
$\sim10^{29}$ divisions — $\sim10^{16}$ years to brute-force.

**Community detection** (number *and* size of communities unknown) is even worse. The
number of partitions is the **Bell number**:
$$ B_N = \frac{1}{e}\sum_{j=0}^{\infty} \frac{j^N}{j!} $$
which grows **faster than exponentially** ($>10^{40}$ partitions for $N=50$).

![Number of Partitions](http://networksciencebook.com/images/ch-09/figure-9-7.jpg)
*Image 9.7 — the Bell number dwarfs an exponential.*

**Conclusion:** brute force is hopeless. We need polynomial-time algorithms that find
good communities without enumerating all partitions. That's the rest of the chapter.

---

## 9.3 Hierarchical clustering — agglomerative and divisive

Build a hierarchy (a **dendrogram**) of nested communities. Two directions.

### Agglomerative: the Ravasz algorithm (bottom-up: merge)

Start with each node alone, repeatedly merge the most similar groups. The key is a
good similarity measure. Ravasz uses **topological overlap**:
$$ x_{ij}^{o} = \frac{J(i,j)}{\min(k_i, k_j) + 1 - \Theta(A_{ij})} $$
where $J(i,j)$ = number of common neighbors (+1 if $i,j$ are directly linked). It's 1
when two linked nodes share all neighbors, 0 when they share none — high for nodes in
the same dense neighborhood. Then merge communities by **average linkage** (average
$x_{ij}$ across the two groups), building the dendrogram bottom-up.

![The Ravasz Algorithm](http://networksciencebook.com/images/ch-09/figure-9-9.jpg)
*Image 9.9 — topological overlap matrix; reordering rows/columns by overlap and
cutting the dendrogram recovers the built-in modules.*

![Cluster Similarity](http://networksciencebook.com/images/ch-09/figure-9-10.jpg)
*Image 9.10 — single vs complete vs average linkage for merging groups.*

### Divisive: the Girvan–Newman algorithm (top-down: cut)

Start with the whole network, repeatedly *remove* the links that bridge communities.
The bridging measure is **link betweenness** = the number of shortest paths running
through a link. Inter-community links carry many shortest paths (everything crossing
between the groups must funnel through them), so they have the highest betweenness.

Algorithm: compute betweenness of all links → remove the highest → **recompute** (the
recomputation is essential) → repeat until the network falls apart, recording the
dendrogram.

Applied to Zachary's karate club, it recovered the real post-split factions with only
*one* node misclassified.

![Centrality Measures](http://networksciencebook.com/images/ch-09/figure-9-11.jpg)
*Image 9.11 — link betweenness (fast, $O(LN)$) vs random-walk betweenness (slower).*

![The Girvan-Newman Algorithm](http://networksciencebook.com/images/ch-09/figure-9-12.jpg)
*Image 9.12 — removing the three highest-betweenness links peels the network into
three communities; the dendrogram and the modularity curve pick the best cut.*

**Both produce a whole dendrogram — which cut is "the" answer?** That's what
modularity decides (next). Complexity: Ravasz and Girvan–Newman are both roughly
$O(N^3)$ on sparse networks — too slow for millions of nodes.

### Hierarchy and the scale-free property

A puzzle: how can a scale-free network have separable communities if hubs link many
communities at once? The **hierarchical network model** resolves it — a deterministic
construction (replicate a small module, connect copies through a central node,
repeat) that is simultaneously scale-free *and* modular. It has:
- **Scale-free** degree distribution with $\gamma = 1 + \frac{\ln 5}{\ln 4} = 2.161$.
- **Scaling clustering:** the clustering coefficient of a degree-$k$ node falls as
  $$ C(k) \sim k^{-1} $$
  This is the signature of hierarchical modularity: small nodes sit in small dense
  communities (high $C$), hubs bridge many communities (low $C$).

**$C(k)$ is a hierarchy test.** For ER and BA, $C(k)$ is flat (no hierarchy). For 9 of
10 real reference networks $C(k)$ *decreases* with $k$ (only the power grid is flat),
so **most real networks are hierarchically modular** — and this survives
degree-preserving randomization only in the model, confirming $C(k)$ captures
structure beyond $p_k$.

![Hierarchical Network](http://networksciencebook.com/images/ch-09/figure-9-13.jpg)
*Image 9.13 — the iterative construction of the deterministic hierarchical network.*

![Scaling in Hierarchical Networks](http://networksciencebook.com/images/ch-09/figure-9-14.jpg)
*Image 9.14 — the model is scale-free ($\gamma=2.16$) and has $C(k)\sim k^{-1}$;
randomization destroys the $C(k)$ scaling.*

---

## 9.4 Modularity — measuring partition quality

**H3 — Random Hypothesis:** *randomly wired networks have no community structure.* So
a real community is a subgraph with *more* internal links than a random network with
the same degrees would have. Quantify that excess.

**Modularity** compares actual internal links $L_c$ to the expected number under the
degree-preserving null model $p_{ij} = \frac{k_i k_j}{2L}$:
$$ M = \sum_{c=1}^{n_c} \left[ \frac{L_c}{L} - \left(\frac{k_c}{2L}\right)^2 \right] $$
where $L_c$ = links inside community $c$ and $k_c$ = total degree of its nodes.
Reading it:
- $M > 0$: more internal links than chance → real community structure. **Higher $M$ =
  better partition** (max $M < 1$).
- $M = 0$: the whole network as one community, or connectivity fully explained by
  degrees.
- $M < 0$: e.g. every node its own community.

![Modularity](http://networksciencebook.com/images/ch-09/figure-9-16.jpg)
*Image 9.16 — the same network at four partitions: optimal ($M=0.41$), suboptimal
($M=0.22$), single community ($M=0$), all-singletons ($M=-0.12$).*

**H4 — Maximal Modularity Hypothesis:** *the partition with maximum $M$ is the best
community structure.* This turns community detection into an **optimization** problem.

### The greedy algorithm & Louvain

Brute-force $M$-maximization is infeasible (too many partitions), so:
- **Greedy (Newman):** start with each node alone; repeatedly merge the pair of
  communities that increases $M$ most; stop at max $M$. $O(N^2)$-ish; the fast version
  reaches $O(L)$, scaling to millions of nodes.
- **Louvain:** the workhorse in practice. Local greedy $M$-optimization, then collapse
  each community into a super-node and repeat on the coarsened network. Extremely fast
  and near-linear, which is why it's the default for huge networks.

![The Greedy Algorithm](http://networksciencebook.com/images/ch-09/figure-9-17.jpg)
*Image 9.17 — greedy modularity merging.*

### The limits of modularity (crucial caveats)

- **Resolution limit:** modularity maximization *cannot see* communities smaller than
  a scale set by $\sqrt{2L}$ — it forcibly merges small real communities into larger
  ones. So max-$M$ can hide genuine fine structure.
- **The modularity plateau (Good–de Montjoye–Clauset):** many *structurally very
  different* partitions have modularity very close to the maximum. So the max is not
  unique or robust — a slightly sub-max partition may be the "true" one. Don't
  over-trust a single max-$M$ answer.

![Modularity Maxima](http://networksciencebook.com/images/ch-09/figure-9-18.jpg)
*Image 9.18 — the high-modularity "plateau": a rugged landscape of near-optimal
partitions, so the global max is not clearly the right answer.*

---

## 9.5 Overlapping communities — nodes in several groups

Real nodes belong to *many* communities at once (you're in a family, a workplace, a
hobby group). The partition methods above force each node into exactly one — wrong for
most real systems.

![Overlapping Communities](http://networksciencebook.com/images/ch-09/figure-9-19.jpg)
*Image 9.19 — a node legitimately shared among several communities.*

### Clique percolation (CFinder)

Define a community as the union of **overlapping $k$-cliques**:
- Two $k$-cliques are *adjacent* if they share $k-1$ nodes.
- A $k$-clique community = all $k$-cliques reachable from one another by such
  adjacency ("rolling" a clique across the network).
- A node can sit in several communities → overlaps handled naturally.

Classic example: the word *bright* belongs simultaneously to a light community
(*glow, dark*), a color community (*yellow, brown*), an astronomy community (*sun,
ray*), and an intelligence community (*gifted, brilliant*) — partition methods would
wrongly force it into just one.

**Null-model check:** $k$-clique communities appear in dense random networks by
chance, above the threshold
$$ p_c(k) = \frac{1}{[(k-1)N]^{1/(k-1)}} $$
($k=2$ recovers the ER giant-component threshold $1/N$; $k=3$ gives $1/\sqrt{2N}$). So
always compare CFinder output to the degree-randomized network to be sure the overlaps
are real.

![The Clique Percolation Algorithm (CFinder)](http://networksciencebook.com/images/ch-09/figure-9-20.jpg)
*Image 9.20 — rolling a triangle ($k=3$) across the network to grow clique
communities; overlaps share nodes (orange).*

![Overlapping Communities: bright](http://networksciencebook.com/images/ch-09/figure-9-21.jpg)
*Image 9.21 — the four overlapping meanings of "bright" recovered by CFinder.*

### Link clustering

An alternative: cluster the **links** instead of the nodes. Every link belongs to one
community, but a *node* inherits all the communities of its links — so nodes overlap
automatically. Elegant way to get overlaps from a partition-style method.

![Link Communities](http://networksciencebook.com/images/ch-09/figure-9-24.jpg)
*Image 9.24 — partitioning links, so nodes end up in multiple communities.*

---

## 9.6 Testing communities — accuracy and speed

With many algorithms and no ground truth in real networks, we test on **benchmarks**
with known planted communities.

- **Girvan–Newman (GN) benchmark:** small networks with tunable community strength
  (parameter $\mu$ = fraction of a node's links going outside its community). As $\mu$
  rises, communities blur; good algorithms hold accuracy longer.
- **LFR benchmark:** more realistic — planted communities on a network with
  *scale-free* degree and community-size distributions. The standard modern test.
- **Accuracy** is measured by **normalized mutual information (NMI)** between the found
  and planted partitions.

![Testing Accuracy with the NG Benchmark](http://networksciencebook.com/images/ch-09/figure-9-25.jpg)
*Image 9.25 — GN benchmark: accuracy vs community fuzziness $\mu$.*

![LFR Benchmark](http://networksciencebook.com/images/ch-09/figure-9-26.jpg)
*Image 9.26 — the more realistic LFR benchmark with scale-free structure.*

![Testing Against Benchmarks](http://networksciencebook.com/images/ch-09/figure-9-27.jpg)
*Image 9.27 — relative accuracy of the major algorithms across benchmarks.*

**Speed** matters as much as accuracy at scale. Complexities range from $O(N^3)$
(Girvan–Newman) down to near-linear (Louvain), determining which algorithm is even
usable on million-node networks.

![The Running Time](http://networksciencebook.com/images/ch-09/figure-9-28.jpg)
*Image 9.28 — running time of the major algorithms vs network size; Louvain and
Infomap scale best.*

**No universal winner:** algorithms differ in speed, accuracy, and whether they handle
overlaps/hierarchy/weights. The right choice depends on network size and what you need.

---

## 9.7 Characterizing communities — the empirical laws

What do real communities look like?
- **Community size distribution** is often **fat-tailed** (roughly power-law): many
  small communities, a few very large ones — echoing the scale-free theme.
- **Communities and link weights (Granovetter's "weak ties"):** links *inside*
  communities are strong (high weight); links *between* communities are weak. Society's
  strong ties are local; weak ties bridge groups. Empirically confirmed in the mobile
  call network.
- **Community evolution:** communities are born, grow, merge, split, and die over time;
  large communities persist by *changing* members, small ones persist by *keeping*
  them.

![Community Size Distribution](http://networksciencebook.com/images/ch-09/figure-9-29.jpg)
*Image 9.29 — fat-tailed community sizes.*

![Communities and Link Weights](http://networksciencebook.com/images/ch-09/figure-9-30.jpg)
*Image 9.30 — strong ties within, weak ties between communities (Granovetter).*

![Evolving Communities](http://networksciencebook.com/images/ch-09/figure-9-31.jpg)
*Image 9.31 — growth, merging, splitting, birth, and death of communities over time.*

---

## 9.8 Summary

The logic chain of the chapter:
1. Communities are locally dense connected subgraphs (H2), encoded in the wiring (H1).
2. We can't enumerate all partitions (Bell number) → need heuristics.
3. **Hierarchical clustering** (Ravasz agglomerative, Girvan–Newman divisive) builds a
   dendrogram; **$C(k)\sim k^{-1}$** reveals hierarchical modularity in most real
   networks.
4. **Modularity $M$** scores partitions (H3, H4); **greedy/Louvain** maximize it fast —
   but beware the resolution limit and the near-degenerate modularity plateau.
5. **Overlapping** methods (clique percolation/CFinder, link clustering) handle nodes
   in multiple communities.
6. **Benchmarks** (GN, LFR) + NMI test accuracy; complexity governs scalability.
7. Real communities are fat-tailed in size, bounded by weak ties, and evolve in time.

The meta-message for a thesis: community detection is **ill-posed** — there's no single
correct definition or algorithm, so always state your definition, validate against a
null model / benchmark, and treat any single partition with appropriate skepticism.

> **Advanced Topics:** 9.A (deriving $\gamma$ and $C(k)$ for the hierarchical model),
> 9.B (hierarchical modularity math), 9.C (fast algorithms — **Louvain** and
> **Infomap**, the entropy/map-equation method), 9.D (the clique-percolation
> threshold). Louvain and Infomap in 9.C are the two you'll actually run.

---

## Figure index (for the slide stage)

- **Meaningful to SIMULATE (live):**
  - **Girvan–Newman in action** — a network where you remove highest-betweenness links
    and watch communities separate. **Centerpiece.**
  - A **modularity demo** — try different partitions of a small two-community network
    and see $M$ update (optimal / single / singletons).
  - A **community-detection playground** — a network with planted communities, colored
    by a detected partition.
- **EMBED book image (non-reproducible real data / schematics):** 9.1 (Belgium), 9.2
  (karate club), 9.3 (metabolic), 9.5 (community definitions), 9.7 (Bell number), 9.9
  (Ravasz), 9.12 (Girvan–Newman steps), 9.13/9.14 (hierarchical model), 9.16
  (modularity), 9.18 (modularity plateau), 9.20/9.21 (CFinder), 9.27 (benchmarks),
  9.30 (weak ties).

Tell me when you want slides.
