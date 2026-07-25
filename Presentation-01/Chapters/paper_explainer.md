# Understanding "Generating Scale-Free Caterpillar and Series-Parallel Networks"
### A detailed walkthrough for literature review (Kamal, Das & Rahman, ICCA 2024)

> **Why this paper matters to you:** This is your thesis's direct predecessor. It solves the "scale-free + specific graph class" problem for **two** graph classes (caterpillars, series-parallel graphs). Your job is to solve the same style of problem for **planar graphs**. So the real goal of this document isn't just "understand the paper" — it's "extract the *template* this paper uses, so you can see exactly which pieces you'll need to redo for planar graphs, and which pieces are specific to caterpillars/series-parallel and won't transfer directly."

---

## 1. The big picture: what problem is this paper solving?

### 1.1 Two separate ideas that get combined

There are two independent concepts in network science that this paper mashes together:

1. **Scale-free networks** — a *statistical* property of a graph's degree sequence.
2. **Graph classes** (caterpillar, series-parallel) — a *structural* property of a graph (its shape/topology).

Normally these are studied separately. A huge body of work (Barabási–Albert and its many descendants) tells you how to grow a scale-free graph in general, with no constraint on what "shape" of graph it ends up being. Separately, graph theory has well-studied structural classes like trees, planar graphs, outerplanar graphs, caterpillars, series-parallel graphs, etc.

**The gap this paper (and the earlier outerplanar paper by Rafid et al., its direct predecessor) identifies:** almost nobody has asked "can I generate a graph that is *simultaneously* scale-free *and* guaranteed to belong to a specific structural class?" That's a much harder, more constrained generation problem, because the structural class restricts what degree sequences are even *possible*, and you need the randomness of the power-law draw to still respect that structural constraint.

### 1.2 What "scale-free" actually means (precise definition)

A network is scale-free if the **degree distribution** follows a power law:

$$P(k) \propto k^{-\gamma}, \quad \text{typically } 2 < \gamma < 3$$

In words: the probability that a randomly chosen vertex has degree $k$ is proportional to $k^{-\gamma}$. Normalizing this into a proper probability distribution (so probabilities sum to 1) gives:

$$P(k) = \frac{k^{-\gamma}}{\sum_{k=k_{min}}^{\infty} k^{-\gamma}}$$

The denominator is just a normalizing constant — call it $\zeta(\gamma)$ when $k_{min}=1$ (this is literally the Riemann zeta function evaluated at $\gamma$, restricted to positive integers, which is why they reuse that symbol).

**Intuition:** most vertices have very low degree, and a small number of vertices (the "hubs") have very high degree. On a log-log plot of "number of vertices with degree $k$" vs "$k$", this shows up as roughly a straight line — that's the classic visual signature of scale-free-ness, and it's exactly what Figures 5 and 8 in the paper are showing you as empirical validation.

If there are $n$ vertices total, the *expected number* of vertices with exactly degree $k$ is:

$$N(k) = n \cdot P(k)$$

This $N(k)$ formula is the workhorse of the whole paper — every derivation of $\gamma$ comes from setting up an equation using $N(k)$.

### 1.3 What the two target graph classes are

**Caterpillar** (Figure 1 in the paper): a tree where, if you strip away all the leaves, what's left is a simple path. That remaining path is called the **spine** (or "stalk"). So every vertex is either:
- **on the spine** (the "backbone" path), or
- a **leaf** hanging directly off a spine vertex.

No vertex is two or more steps away from the spine. This is a very restrictive tree shape — think of an actual caterpillar insect: a central body line with legs sticking straight out.

**Series-parallel graph** (Figure 2): defined *recursively*, with two designated terminal vertices called source ($s$) and sink ($t$):
- **Base case:** a single edge between $s$ and $t$.
- **Series composition:** take two series-parallel graphs $G_1$ (with terminals $s_1,t_1$) and $G_2$ (with terminals $s_2,t_2$), and glue $t_1$ to $s_2$. The new graph's terminals are $s=s_1$ and $t=t_2$.
- **Parallel composition:** take $G_1$ and $G_2$ and glue $s_1=s_2$ (call it $s$) and $t_1=t_2$ (call it $t$).

Series-parallel graphs are important in circuit theory (hence the name — think resistors in series vs. in parallel), and a huge number of NP-hard graph problems become polynomial-time solvable when restricted to series-parallel graphs, which is part of why they're a well-studied class.

**Where "planar" fits in, for your context:** both caterpillars and series-parallel graphs happen to be planar (they can always be drawn without edge crossings), but "planar" as a class is far broader — it's *any* graph drawable without crossings, with no constraint on how it's built recursively or what its spine looks like. This is going to matter a lot for you (see Section 6).

---

## 2. The general degree-sequence generation recipe (Section 2, end)

Before getting into class-specific work, the paper gives you the generic method for producing *a* power-law-distributed degree sequence of size $n$:

1. Choose $k_{min}$, $k_{max}$, and $\gamma$.
2. For every integer $k$ from $k_{min}$ to $k_{max}$, compute $P(k)$ using the formula above.
3. Randomly draw $n$ degree values from this distribution (i.e., sample $n$ times, where the probability of drawing value $k$ is $P(k)$).
4. The resulting ordered list of $n$ numbers is your **degree sequence**.

This step alone does *not* guarantee the degree sequence is realizable as a graph of your target class — that's the hard part the rest of the paper solves. Think of this step as "draw raw material"; the class-specific algorithm's job is "sculpt that raw material into a legal graph of the right shape, adjusting where necessary."

---

## 3. Part A: Scale-free Caterpillar Networks (Section 3)

This is the cleaner, easier-to-digest half of the paper. Read this section closely — it's the one most structurally similar to what you'll need to do for trees-adjacent planar work, and it's the gentler on-ramp before series-parallel.

### 3.1 Step 1 — Derive the required value of γ (Lemma 3.1)

This is the paper's core theoretical contribution for caterpillars. The logic:

**Setup.** Split the vertex set into:
- $U$ = non-leaf vertices (degree $\geq 2$) — these sit **on the spine**.
- $V$ = leaf vertices (degree exactly 1) — these hang off the spine.

**Key structural fact about caterpillars.** Every spine vertex of degree $k>2$ uses exactly 2 of its edges to connect to its two neighbors *on the spine* — and the remaining $k-2$ edges must go to leaves. The two spine vertices at the very ends of the spine only need 1 spine-neighbor each, so they have one extra "free" edge-slot each, contributing the "+2" you'll see below. So:

$$\text{(total leaves needed)} = 2 + \sum_{u \in U}(\deg(u) - 2) = |V|$$

This is a **pure counting/combinatorial identity** — it's true for *any* caterpillar, scale-free or not. It just says: total leaf-slots supplied by spine vertices = total number of actual leaves.

**Now bring in the power law.** Using $N(k) = \frac{n k^{-\gamma}}{\zeta(\gamma)}$:
- Number of leaves (degree-1 vertices): $|V| = N(1) = \frac{n}{\zeta(\gamma)}$
- For each degree $k \geq 2$, the "open slots" contributed by all degree-$k$ vertices is $(k-2)\cdot N(k) = (k-2)\frac{nk^{-\gamma}}{\zeta(\gamma)}$

Substituting into the counting identity from before:

$$2 + \sum_{k=2}^{\infty}(k-2)\frac{nk^{-\gamma}}{\zeta(\gamma)} = \frac{n}{\zeta(\gamma)} \tag{Eq. 2}$$

This equation has $\gamma$ as the only unknown (once you fix $n$, or actually — note $n$ cancels out asymptotically, which is why a single fixed $\gamma$ works for a caterpillar of *any* size). There's no closed-form algebraic solution, so they solve it **numerically using the bisection method**, and the answer is:

$$\boxed{\gamma \approx 2.47}$$

**Why this matters for you:** this is the template move — "write down a purely structural/combinatorial identity that must hold for any graph in your class, substitute the power-law expected counts $N(k)$ into it, and solve for $\gamma$." For planar graphs, the structural identity you'd substitute into is different (you'd likely lean on Euler's formula $n - m + f = 2$ and the planarity bound $m \le 3n-6$ for simple planar graphs, or handle general planar graphs' degree-sum constraints) — see Section 6.

### 3.2 Step 2 — Algorithm 1: build the actual graph

Given: $n$ (vertex count) and a degree sequence drawn from the power law with $\gamma=2.47$.

Plain-English walkthrough:

1. Start with $n$ isolated vertices (a "null graph," notated $N_n$).
2. Split vertices into $U$ (degree $\geq 2$, will form the spine) and $V$ (degree $=1$, leaves).
3. **Sanity-fix step:** because the degree sequence was drawn *randomly*, the exact combinatorial identity from Lemma 3.1 ($2+\sum_{u\in U}(\deg(u)-2)=|V|$) might not hold exactly for this particular random draw. So the algorithm adjusts the degree of the **largest-degree vertex(es)** in $U$ just enough to force the identity to hold exactly. (This is a practical patch — the power law gives you the right *distribution* on average/asymptotically, but any one finite random sample needs a small correction to be exactly buildable.)
4. **Build the spine:** connect each consecutive pair of vertices in $U$ — this creates a simple path, which *is* the spine.
5. **Attach leaves:** walk through each spine vertex $u$, and for each of its "extra" degree slots (i.e., $\deg(u)-2$ of them), pop a leaf off $V$ and connect it.
6. **Handle the two spine endpoints:** each end of the spine gets one more leaf attached (this is the "+2" from the formula).
7. Return the graph.

### 3.3 Step 3 — Correctness and complexity proof (Theorem 3.2)

Two things need proving:

**(a) It's actually a caterpillar.** They show:
- Edge count works out to exactly $n-1$ (so it's tree-sized).
- No cycles are possible: spine vertices only connect to at most 2 other spine vertices (forming a simple path, not a cycle) and leaves have degree exactly 1 (can't be part of a cycle).
- $n-1$ edges + connected + acyclic = **it's a tree**.
- Removing all leaf (degree-1) vertices leaves exactly the spine, which is a path → **by definition, that makes it a caterpillar**.

**(b) It's scale-free.** Trivial once you accept the degree sequence itself was drawn from the power law with $2 < \gamma < 3$ — the graph's degree sequence *is* the power-law sequence (modulo the small adjustment step), so it satisfies the scale-free definition by construction.

**(c) Time complexity.** The first loop touches each of the $|U|$ spine vertices once; the second loop touches each of the $|V|$ leaves once. Total work is $O(|U|+|V|) = O(n)$ — **linear time**.

### 3.4 Experimental validation (Section 3.2)

They ran the algorithm at sizes $10^2$ to $10^4$ (and one run at $10^5$ for the log-log plot) and checked three things:

| Check | Result | Why it makes sense |
|---|---|---|
| Clustering coefficient | Always **0** | Trees have no triangles at all (clustering coefficient counts closed triangles), so this must be zero for *any* tree, caterpillar or not — it's really a sanity check that the output is a tree. |
| Avg. shortest path length vs. $n$ | **Linear relationship** (Figure 4) | The spine length grows linearly with $n$, and most shortest paths between leaves roughly track spine distance. |
| Degree distribution (log-log plot, Figure 5) | Straight-ish line | Confirms the power-law shape was preserved through the construction/adjustment process. |

---

## 4. Part B: Scale-free Series-Parallel Networks (Section 4)

This half is considerably more involved — series-parallel graphs are a richer class than caterpillars (they can have cycles, multiple edges conceptually, and more complex recursive structure), so the algorithm and its correctness proof are more intricate.

### 4.1 Two preliminary observations that shape the whole design

**Observation 1 — degree-1 vertices are essentially forbidden (except possibly the terminals).**
Because series-parallel graphs are built by *composition*, any vertex that isn't one of the two terminals $s,t$ gets touched by at least two "attachment points" during composition, so its degree is always $\geq 2$. This is why they set $k_{min}=2$ for the power law in this section (contrast with caterpillars, where leaves — degree 1 — were essential).

**Observation 2 — degree-2 vertices are "free" to insert anywhere.**
If $(v_1,v_2)$ is an edge anywhere in an existing series-parallel graph, you can always **subdivide** it: delete the edge, add a new vertex $v_x$, add edges $(v_1,v_x)$ and $(v_x,v_2)$. This is a *series* composition locally, and it provably preserves the series-parallel property of the whole graph. This gives them a huge simplification: **build the "skeleton" using only degree-$\geq 3$ vertices first, then sprinkle in all the degree-2 vertices as a trivial last step** by subdividing random existing edges.

This decomposition — "handle the hard high-degree structural vertices first, then handle the easy low-degree vertices as a cheap post-processing pass" — is the same basic move as caterpillars (spine first, then leaves), just adapted to a richer class.

### 4.2 The construction idea: an "open ports" / stack-based mental model

This is the trickiest part of the paper conceptually, so let's slow down.

**Think of each vertex's degree as a number of "ports" (available edge-slots) it needs to fill.** The algorithm processes vertices from **U** (degree $\geq 3$) in **non-increasing order of degree**: $u_0$ (largest), $u_1$, $u_2$, ....

- $u_0$ is treated as one of the two series-parallel terminals. Drawing it "opens" $\deg(u_0)$ ports.
- $u_1$ comes next. Instead of connecting *all* of $u_1$'s ports back to $u_0$ (which would make $u_1$ the *other* terminal too early, over-constraining the rest of the construction), the algorithm connects $\deg(u_1)-1$ of $u_1$'s edges to $u_0$, and leaves exactly **one port of $u_1$ open** for future vertices to attach to.
- Every subsequent vertex $u_i$ follows the same rule: it tries to close open ports belonging to the *most recently opened* still-open vertices first ($u_{i-1}$, then $u_{i-2}$, etc.), and if it still has ports left after that, it leaves **one of its own ports open** for the next vertex.

This "close the most recent open ports first" rule is exactly a **stack (LIFO)** discipline — which is why they implement it with an explicit stack $S$ in Algorithm 2. Read Figure 6 in the paper carefully; it walks through a concrete 5-vertex example step by step and is the fastest way to build real intuition for this mechanism.

**Why does this avoid edge crossings / guarantee planarity-preserving series-parallel structure?** Because at every step, a new vertex only ever connects to vertices that are "currently exposed" on the boundary of the graph built so far (i.e., on top of the stack), never reaching back arbitrarily into the interior. This nested/stack-like attachment pattern is exactly what keeps the recursive series/parallel structure intact (this is proven formally in Theorem 4.1's induction — see below).

### 4.3 Algorithm 2, translated to plain steps

1. Start with $n$ isolated vertices.
2. Split into $U$ = degree $>2$ vertices (sorted descending by degree) and $V$ = degree-exactly-2 vertices.
3. **Readjustment pass (lines 3–9):** simulate the port-closing process abstractly (without actually adding edges yet) to figure out how many ports will be left unclosed at the end, and dump all the leftover open-ness onto $U[0]$ (the largest vertex) to guarantee the whole thing balances out. This is analogous to the caterpillar algorithm's "readjust the largest-degree vertex" step — same philosophy, different arithmetic.
4. **Main construction (lines 10–23):** push $u_0$ onto the stack $\deg(u_0)$ times (representing its open ports). Then for each subsequent vertex $u_i$: pop up to $\deg(u_i)-1$ items off the stack and connect $u_i$ to each popped vertex (closing their open ports); if $u_i$ still has degree left over after that, push $u_i$ back onto the stack that many times (opening its own remaining ports for future vertices). At the very end, if anything is left on the stack, pop two remaining items and connect them directly (this closes out the graph and creates the "parallel edges between $s$ and $t$" structure mentioned in the proof).
5. **Insert degree-2 vertices (lines 24–25):** for each vertex in $V$, pick a random existing edge $(u_1,u_2)$ and subdivide it (replace with $(u_1,v),(v,u_2)$), per Observation 2.
6. Return the graph.

### 4.4 Correctness proof sketch (Theorem 4.1)

They prove correctness by **strong induction on the number of vertices**, using a clever reduction: strip out all the degree-2 vertices (by Observation 2, this doesn't change whether the *rest* of the graph is series-parallel), leaving a reduced graph $G'$ where every vertex has degree $\geq 3$. Then:

- **Base case:** $G'$ with $\leq 2$ vertices is trivially series-parallel (it's just an edge, or nothing).
- **Inductive step, Case 1:** if some vertex $u_x$ has more than one open port left over, then $G'$ splits cleanly into "everything before $u_x$" and "everything after $u_x$," connected only through $u_x$ — this is exactly a **series composition** of two smaller series-parallel graphs (each series-parallel by the induction hypothesis).
- **Inductive step, Case 2:** if no vertex has more than one open port left over, the graph reduces to having multiple parallel edges directly between the first vertex and the last vertex — a **parallel composition**, plus one series step to attach the very last vertex.

Either way, $G'$ decomposes into legal series/parallel compositions of smaller series-parallel graphs, so by induction, it is series-parallel. Re-inserting the degree-2 vertices (Observation 2) preserves this property, so the full graph $G$ is series-parallel too.

**Time complexity:** the vertex loop is $O(|U|)$, but the *push/pop* operations across the whole run add up to $O(m)$ (each edge causes one push and one pop, roughly), and the final degree-2 insertion loop is $O(|V|)$. Total: $O(n+m)$. Since in a scale-free network $m \gg n$ (a few hub vertices carry huge degree), this simplifies to $O(m)$ — **linear in the number of edges**.

### 4.5 An important honesty point: Theorem 4.2 — it's *not* always simple

This is a subtle and important result, and a good example of the kind of rigor your thesis will be expected to match. A **simple graph** has no repeated (parallel/multi-) edges between the same pair of vertices and no self-loops. The authors are upfront that **Algorithm 2 does not guarantee a simple graph** — because during the port-closing process, it's entirely possible for the *same pair* of vertices to end up connected more than once (e.g., if $u_1$ and $u_2$ both still have open ports and happen to get matched to each other more than once across different steps).

They actually **derive a formula (Equation 3)** comparing:
- the number of "guaranteed simple" edges available (roughly, one per degree-2 vertex, since those can be used to break up a repeated edge into two distinct edges via subdivision), against
- the expected number of repeated edges the process is likely to generate,

and show that **for no value of $\gamma$ in the valid range $(2,3)$ does the inequality hold** — i.e., there are never quite enough "spare" degree-2 vertices to fully de-duplicate all repeated edges. **Conclusion: the generated series-parallel network may be a multigraph**, and the paper explicitly flags this as a known limitation rather than hiding it.

This is a good model for your own thesis writing: when your algorithm has a limitation, prove it rigorously and state it plainly rather than glossing over it.

### 4.6 Experimental validation (Section 4.2)

- **Clustering coefficient vs. $\gamma$** (Figure 7): lower $\gamma$ → higher clustering coefficient. This matches known scale-free network theory — smaller $\gamma$ means a heavier tail (more/bigger hubs), and hub-heavy structures tend to create more closed triangles through the hub. (Contrast with the caterpillar case, where clustering was *always exactly zero* because trees can't have triangles at all — series-parallel graphs, unlike caterpillars, *can* contain cycles/triangles.)
- **Degree distribution log-log plot** (Figure 8, $n=10^5$): again roughly linear, confirming power-law shape survived construction.

---

## 5. Comparing the two halves side by side

| Aspect | Caterpillar (Section 3) | Series-Parallel (Section 4) |
|---|---|---|
| $k_{min}$ | 1 (leaves matter) | 2 (degree-1 vertices essentially forbidden) |
| Required $\gamma$ | Fixed constant, $\approx 2.47$, derived from one identity | Any $\gamma \in (2,3)$ works — no single "magic" value is forced |
| Core structural insight | Spine (path) + leaves attached | "Open port" stack-based recursive series/parallel composition |
| Data structure used | Two simple lists/queues ($U$, $V$) | An explicit stack $S$ |
| Skeleton-then-fill-in strategy | Build spine, then attach leaves | Build degree-$\geq3$ skeleton, then insert degree-2 vertices via edge subdivision |
| Time complexity | $O(n)$ | $O(m)$ |
| Guaranteed simple graph? | Yes (trees can't have multi-edges by construction here) | **No** — proven impossible for any valid $\gamma$ (Theorem 4.2) |
| Clustering coefficient | Always 0 (it's a tree) | Nonzero, varies with $\gamma$ |
| Correctness proof technique | Direct edge-count + acyclicity argument | Strong induction on vertex count with 2 cases |

**The one big reusable pattern underlying both:** *identify the "spine"/"skeleton" substructure that all vertices of degree $\geq$ some threshold must belong to, derive a structural identity (counting argument for caterpillars; recursive series/parallel decomposition for SP graphs) that any graph in the class must satisfy, plug the power-law expected counts $N(k)$ into that identity to pin down constraints on $\gamma$ (or show a range works), then build a linear-time constructive algorithm that (a) draws a random degree sequence, (b) minimally readjusts it to satisfy the exact structural identity, and (c) mechanically assembles the graph so it's provably a member of the class by construction.*

---

## 6. What this means for YOUR thesis (planar networks)

Since your target class is **planar graphs**, here's how the template above maps over — and where it clearly won't map cleanly, which is exactly where your novel contribution needs to live.

### 6.1 Where the template transfers reasonably well

- **The overall four-stage recipe** (structural identity → solve/characterize $\gamma$ → build skeleton → attach remainder) is a reasonable starting scaffold.
- **The "readjust the largest-degree vertex(es) to fix parity/count mismatches from random sampling" trick** will likely reappear in some form — any constructive algorithm from a randomly-sampled degree sequence needs a correction step, because degree sequences realizable in a given graph class are a strict subset of all possible sequences.
- **Reporting an explicit complexity bound and validating empirically with clustering coefficient + log-log degree plots + a structural sanity check** (like their "avg. shortest path grows linearly" check) is a good template for your own experiments section.
- **Being explicit about limitations** (à la Theorem 4.2) rather than hiding them will strengthen your thesis's rigor.

### 6.2 Where it will NOT transfer directly — your real challenges

1. **Planar graphs have no single canonical recursive decomposition the way series-parallel graphs do.** Series-parallel graphs are literally *defined* by a two-operation recursive grammar, which is what made the stack-based algorithm and the inductive proof possible. Planar graphs in general do **not** have such a clean universal recursive construction — you'll need a different proof strategy (candidates: incremental planar embedding / insertion algorithms with a "face" or "planar embedding" data structure, PQ-trees, or leaning on a known planar-graph generation model like preferential-attachment-on-a-planar-embedding, or building from *maximal planar graphs / triangulations* and removing edges).

2. **The relevant structural constraint for planar graphs is different.** For caterpillars it was a leaf-counting identity; for series-parallel it was recursive composition. For planar graphs, the natural constraint to lean on is **Euler's formula** ($n-m+f=2$ for connected planar graphs) combined with the **edge bound for simple planar graphs**, $m \leq 3n-6$ (for $n\geq 3$), and $m \le 2n-4$ if triangle-free. This bounds the *total* degree sum ($\sum \deg(v) = 2m \leq 6n-12$), which will directly constrain what values of $\gamma$ are even feasible — likely via an inequality rather than the caterpillar's exact equality, since planarity is a much less restrictive class than "caterpillar" (many different degree sequences and many different edge counts $m$ are planar-realizable for the same $n$, unlike a caterpillar which is forced to have exactly $n-1$ edges).

3. **You should decide early: are you targeting general planar graphs, or a planar subclass** (maximal planar/triangulated, outerplanar — note this is already done by Rafid et al. 2022, maximal outerplanar — also done, or something like "planar and 2-connected")? The existing literature (this paper + the outerplanar predecessor) has now covered: trees→caterpillar, 2-terminal recursive graphs→series-parallel, maximal outerplanar. A clean gap that would make a strong thesis contribution is **general planar graphs** or a not-yet-covered planar subclass (e.g., planar bipartite, k-outerplanar, or maximal planar/triangulations specifically). Worth a quick literature check to see exactly what's still open.

4. **Multigraph issue may resurface.** Just like Theorem 4.2 found that series-parallel construction couldn't avoid repeated edges for any valid $\gamma$, you should check early whether your planar construction method risks creating multi-edges or self-loops, and whether that's avoidable for planar graphs specifically (simple planar graphs are extremely well-studied, so there may be existing degree-sequence-realizability results for planar graphs you can lean on — e.g., work on "planar graphic sequences" — worth a targeted search).

5. **Algorithm complexity target:** they hit $O(n)$ and $O(m)$ for their two classes. Planar graph algorithms often naturally support linear-time construction/embedding (e.g., planarity testing itself is $O(n)$ via Hopcroft–Tarjan), so an $O(n)$ or $O(m)$ target for your generator is a reasonable and consistent goal to state upfront.

### 6.3 Concrete next steps I'd suggest for your lit review

- Read the **Rafid et al. (2022) outerplanar paper** (reference [32] in this paper) closely too — it's the *direct* predecessor to this one and will show you the same template applied to a third class, which will help you triangulate what's genuinely reusable vs. class-specific.
- Look up **planar graphic sequence characterization** results (analogous to Erdős–Gallai for general graphs) — this is likely the mathematical tool you'll need for your Lemma-3.1-equivalent.
- Consider whether your proof strategy will be **constructive/algorithmic** (build while proving, like this paper) or **existence-then-construction** (prove a sequence is planar-realizable via a known theorem, then give a separate construction algorithm) — the second approach may suit planar graphs better given point 6.2.1 above.

---

## 7. Quick glossary (terms you'll want fluent recall of)

- **Degree sequence**: ordered list of vertex degrees in a graph.
- **Power law / scale-free**: $P(k) \propto k^{-\gamma}$, $2<\gamma<3$ typically.
- **$\zeta(\gamma)$**: the normalizing constant $\sum_{k=1}^\infty k^{-\gamma}$ (Riemann zeta function).
- **Spine**: the path left after removing all leaves from a caterpillar.
- **Terminal (source/sink)**: the two designated special vertices in a series-parallel graph.
- **Series composition**: chaining two series-parallel graphs end to end (sink of one = source of next).
- **Parallel composition**: merging two series-parallel graphs' matching source and sink vertices.
- **Simple graph vs. multigraph**: simple = no repeated edges/self-loops; multigraph = repeats allowed.
- **Clustering coefficient**: measures triangle density around vertices; 0 for any tree.
- **Bisection method**: numerical root-finding technique used here to solve for $\gamma$ since Eq. 2 has no closed form.
- **$O(n)$ vs $O(m)$**: linear in vertex count vs. linear in edge count — equivalent-ish for sparse graphs but $m\gg n$ for scale-free hub-heavy graphs, so quoting $O(m)$ is the more honest bound when hubs dominate.

---

*This document is a study aid for your literature review — not a citable source. When you write your thesis, cite the original paper directly (Kamal, Das & Rahman, ICCA 2024, doi:10.1145/3723178.3723189) and, where relevant, work through the proofs (especially Lemma 3.1 and Theorem 4.1's induction) independently in your own notes to make sure you can reproduce them without this guide.*
