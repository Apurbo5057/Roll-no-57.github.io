# Chapter 7 — Degree Correlations (Study Guide)

Chapters 4–6 were all about the *degree distribution* $p_k$ — how many links each
node has. This chapter asks the next question: **who links to whom?** Do hubs
connect to other hubs, or do they avoid each other? That pattern — **degree
correlations** — is a second layer of structure that $p_k$ alone cannot capture, and
it measurably changes how a network behaves. Book figures embedded inline.

**The one-line idea:** networks come in three flavours —
- **Assortative:** hubs link to hubs (and small nodes to small nodes). Typical of
  *social* networks.
- **Neutral:** nodes link regardless of degree (what BA and ER produce).
- **Disassortative:** hubs link to small nodes, avoiding each other. Typical of
  *biological/technological* networks.

---

## 7.1–7.2 Assortativity and disassortativity

The motivating contrast: two networks can have the *identical* degree distribution
yet look completely different, because the hubs are arranged differently.

![Hubs Dating Hubs](https://networksciencebook.com/images/ch-07/figure-7-1.jpg)
*Image 7.1 — an assortative network: hubs sit at the center connected to each other.*

![Hubs Avoiding Hubs](https://networksciencebook.com/images/ch-07/figure-7-2.jpg)
*Image 7.2 — a disassortative network: hubs are pushed apart, each surrounded by
small nodes (a hub-and-spoke feel).*

The full information about correlations is in the matrix $e_{ij}$ = the probability
that a randomly chosen link connects a degree-$i$ node to a degree-$j$ node. It's
normalized ($\sum_{ij} e_{ij} = 1$) and its marginal $q_k = \sum_{k'} e_{kk'}$ is the
probability that one end of a random link has degree $k$. For a **neutral** network,
$e_{ij}$ factorizes: $e_{ij} = q_i q_j$ — the degrees at the two ends are
independent. Deviations from this factorization *are* the correlations.

![Degree Correlation Matrix](https://networksciencebook.com/images/ch-07/figure-7-3.jpg)
*Image 7.3 — the $e_{ij}$ matrix visualized; hot spots off the "neutral" pattern
reveal assortative or disassortative tendencies.*

![Perfect Assortativity](https://networksciencebook.com/images/ch-07/figure-7-4.jpg)
*Image 7.4 — a perfectly assortative network: nodes only ever link to others of the
exact same degree, so the network splits into degree-based cliques.*

The $e_{ij}$ matrix is complete but hard to read (it's a whole matrix per network).
The rest of the chapter builds *summary* measures.

---

## 7.3 Measuring degree correlations — the $k_{nn}(k)$ function

The workhorse measure. For each node $i$, compute the **average degree of its
neighbors**:
$$ k_{nn}(k_i) = \frac{1}{k_i}\sum_j A_{ij}\,k_j $$
Then average over all nodes of degree $k$:
$$ k_{nn}(k) = \sum_{k'} k'\,P(k'\mid k) $$
where $P(k'\mid k)$ is the probability that following a link from a degree-$k$ node
lands on a degree-$k'$ node. **In plain terms: $k_{nn}(k)$ answers "if I have $k$
links, how well-connected are my neighbors on average?"** The *shape* of this curve
tells you the correlation type:

- **Neutral:** $k_{nn}(k)$ is **flat** (independent of $k$). Analytically it sits at
  $$ k_{nn}(k) = \frac{\langle k^2 \rangle}{\langle k \rangle} $$
  a constant set only by global quantities. (This constant being *bigger* than
  $\langle k \rangle$ is the **friendship paradox** — your friends have more friends
  than you do, on average, because you're more likely to be linked to a hub.)
- **Assortative:** $k_{nn}(k)$ **increases** with $k$ — high-degree nodes have
  high-degree neighbors. (Science collaboration network.)
- **Disassortative:** $k_{nn}(k)$ **decreases** with $k$ — hubs have low-degree
  neighbors. (Metabolic network.)

Fit it to a power law to get a single number, the **correlation exponent $\mu$**:
$$ k_{nn}(k) = a\,k^{\mu} $$
- $\mu > 0$ → assortative (collaboration: $\mu = 0.37$)
- $\mu = 0$ → neutral (power grid: $\mu = 0.04 \approx 0$)
- $\mu < 0$ → disassortative (metabolic: $\mu = -0.76$)

![Degree Correlation Function](https://networksciencebook.com/images/ch-07/figure-7-6.jpg)
*Image 7.6 — $k_{nn}(k)$ for three real networks: rising (collaboration,
assortative), flat (power grid, neutral), falling (metabolic, disassortative). The
horizontal line is the neutral prediction $\langle k^2\rangle/\langle k\rangle$.*

---

## 7.4 Structural cutoffs — why big networks look disassortative "for free"

A subtle but important complication: in a **simple** network (at most one link
between any two nodes), the scale-free property and *neutrality* actually conflict.

Here's the tension. In a neutral network the *expected* number of links between a
degree-$k$ hub and a degree-$k'$ hub is
$$ E_{kk'} = \frac{k\,k'}{\langle k\rangle N} $$
For two big hubs (say $k=55$, $k'=46$ in a modest network) this can come out to
$E_{kk'} = 2.8$ — the neutral pattern *wants* two or three links between them. But a
simple network allows only **one**. The hubs physically can't connect as much as
neutrality demands.

The degree above which this conflict bites is the **structural cutoff**:
$$ k_s(N) \sim (\langle k\rangle N)^{1/2} $$
Above $k_s$, hubs are *forced* to connect to smaller nodes simply because there
aren't enough other hubs (or enough allowed links) to satisfy neutrality. The result
is **structural disassortativity** — an apparent hub-avoidance that is an artifact of
the simple-graph constraint, not a genuine organizing principle. This is why many
large scale-free networks measure as disassortative even when nothing is actively
pushing hubs apart.

![Structural Disassortativity](https://networksciencebook.com/images/ch-07/figure-7-7.jpg)
*Image 7.7 — a scale-free network where the two biggest hubs "should" share multiple
links but can't, forcing disassortativity.*

![Natural and Structural Cutoffs](https://networksciencebook.com/images/ch-07/figure-7-8.jpg)
*Image 7.8 — $k_s(N)$ vs the natural cutoff; above $k_s$ the neutral pattern is
unrealizable in a simple graph.*

**Thesis-relevant caution:** when you measure disassortativity in a real scale-free
network, always ask whether it's *structural* (an artifact of $k_s$) or *genuine*.
Comparing against a degree-preserving randomized version (Ch. 4) tells you which.

---

## 7.5 Correlations in real networks

Measuring all ten reference networks and using **degree-preserving randomization** as
the neutral baseline (crucial — it strips correlations while keeping $p_k$):

- **Social networks are assortative** (collaboration, actors, mobile calls) — people
  cluster with similarly-connected people.
- **Biological and technological networks are disassortative** (metabolic, protein,
  some of it structural).
- The randomized versions are neutral by construction, confirming the correlations in
  the originals are real structure, not a byproduct of $p_k$.

![Randomization and Degree Correlations](https://networksciencebook.com/images/ch-07/figure-7-9.jpg)
*Image 7.9 — the randomization procedure that produces the neutral reference.*

![Randomization and Degree Correlations](https://networksciencebook.com/images/ch-07/figure-7-10.jpg)
*Image 7.10 — $k_{nn}(k)$ for real networks vs their randomized (neutral) versions;
the gap is the genuine correlation. Note the trend often reverses at large $k$ due to
the structural cutoff.*

---

## 7.6 Generating correlated networks

Two questions: do standard models *have* correlations, and how do we *tune* them?

- **Static models** (configuration, hidden-parameter) are neutral by design — but
  large simple ones pick up *structural* disassortativity above $k_s$.
- **Evolving models** (BA, Bianconi–Barabási) develop mild correlations
  spontaneously. BA is asymptotically neutral; fitness models can be weakly
  disassortative.

![Correlations in the Bianconi-Barabási Model](https://networksciencebook.com/images/ch-07/figure-7-12.jpg)
*Image 7.12 — the fitness model's built-in degree correlations.*

**To deliberately tune correlations: the Xulvi-Brunet & Sokolov algorithm.** Pick two
links, look at the four endpoints, and rewire them either to *connect similar
degrees* (drives assortative) or *connect dissimilar degrees* (drives
disassortative), with probability $p$. Repeating this lets you dial a network from
strongly assortative to strongly disassortative while keeping $p_k$ fixed — the
standard tool for isolating the *effect* of correlations.

![Xulvi-Brunet & Sokolov Algorithm](https://networksciencebook.com/images/ch-07/figure-7-13.jpg)
*Image 7.13 — the rewiring step: reconnect the four endpoints by degree similarity
(assortative) or dissimilarity (disassortative).*

![Tuning Degree Correlations](https://networksciencebook.com/images/ch-07/figure-7-14.jpg)
*Image 7.14 — dialing $p$ moves a network across the full assortative–disassortative
range at fixed $p_k$.*

---

## 7.7 The impact of degree correlations — why we care

Correlations aren't academic; they shift real network properties.

**Giant component / phase transition** (recall $\langle k\rangle=1$ from Ch. 3):
- **Assortative** → the transition moves to *lower* $\langle k\rangle$; a giant
  component forms *more easily* (hubs seeking each other seed it fast). But at large
  $\langle k\rangle$ the giant component is *smaller* (hubs bond to each other instead
  of pulling in the small nodes).
- **Disassortative** → the transition is *delayed*; harder to form a giant component
  (hubs waste their links on leaves).

![Degree Correlations and the Phase Transition Point](https://networksciencebook.com/images/ch-07/figure-7-15.jpg)
*Image 7.15 — assortative networks form a giant component earlier; disassortative
ones later.*

**Downstream consequences (each a later chapter):**
- **Epidemics (Ch. 10):** social assortativity means hubs form a tight core that acts
  as a disease *reservoir*, sustaining an epidemic even when the average density is
  too low for the virus to persist.
- **Robustness (Ch. 8):** in assortative networks hub removal does *less* damage (hubs
  are redundant, clustered together); in disassortative networks hub removal is
  *devastating* (each hub holds many leaves that fall off when it goes).
- **Path lengths:** assortative networks have *shorter* average path length but a
  *larger* diameter — assortativity creates long chains of $k=2$ nodes that stretch
  $d_{max}$.
- Also affects synchronization, controllability, and the vertex-cover problem.

![Degree Correlations and Path Lengths](https://networksciencebook.com/images/ch-07/figure-7-16.jpg)
*Image 7.16 — as you go disassortative → assortative, the distance distribution's
peak shifts left (shorter $\langle d\rangle$) but the tail extends (larger $d_{max}$).*

---

## 7.8 Summary + the alternative measure

**History/terminology:** correlations were found on the Internet in 2001
(Pastor-Satorras–Vázquez–Vespignani, who introduced $k_{nn}(k)$ and the exponent
$\mu$); Newman introduced the assortative/neutral/disassortative language in 2003,
borrowed from "assortative mating" in sociology (people marry similar people).
Disassortative mixing is common too — sexual networks (mostly different-gender
links), trade (baker doesn't sell to baker).

![Politics is Never Neutral](https://networksciencebook.com/images/ch-07/figure-7-18.jpg)
*Image 7.18 — the US political blogosphere: liberal blogs (blue) link to liberal,
conservative (red) to conservative, almost never across — strong assortative mixing
by attribute, not just degree.*

**The degree correlation coefficient $r$** (Newman) — a single number in $[-1, 1]$,
essentially the Pearson correlation of the degrees at the two ends of a link. $r>0$
assortative, $r=0$ neutral, $r<0$ disassortative. Convenient, but the chapter is
frank about its **limitations**:
- $r$ assumes $k_{nn}(k)$ is *linear* in $k$ ($k_{nn} \sim rk$), whereas the real
  dependence is a power law $k^\mu$ — so $r$ force-fits a line to a curve and often
  fits poorly.
- It ignores the structural-cutoff trend reversal at large $k$.
- For large $N$, $r$ can vanish even when strong correlations remain — it's bad at
  detecting correlations in big networks.

Still, $r$ and $\mu$ agree in *sign*: derivation shows $\mu<0 \Rightarrow r<0$,
$\mu=0 \Rightarrow r=0$, $\mu>0 \Rightarrow r>0$. So they classify the same way even
if $r$ is a crude magnitude. (Table 7.1 lists both for all ten networks — e.g. actor
$r=0.31, \mu=0.34$ assortative; metabolism $r=-0.25, \mu=-0.76$ disassortative.)

**Why care, in three bullets (the chapter's own framing):**
1. Degree correlations are present in most real networks.
2. Once present, they change the network's behavior (phase transition, robustness,
   spreading, path length).
3. They force us **beyond the degree distribution** — they're real structure that
   $p_k$ cannot see.

> **Advanced Topics 7.A** (the exact $r$–$\mu$ relationship and directed-network
> correlations) and **7.B** (the structural-cutoff derivation $k_s \sim (\langle
> k\rangle N)^{1/2}$) contain the rigorous versions. 7.B is worth reading for a
> thesis if you'll measure correlations on real scale-free data, since structural
> disassortativity is a classic trap.

---

## Figure index (for the slide stage)

- **Meaningful to SIMULATE (live):**
  - An **assortative ↔ disassortative toggle** on the same network (Xulvi-Brunet
    style rewiring) — the clearest way to *show* what the three flavours look like.
    **Centerpiece.**
  - The **$k_{nn}(k)$ curve** live — rising / flat / falling for the three types.
  - The **friendship-paradox** micro-demo (pick a node vs. pick a neighbor).
  - Optionally the **giant-component shift** vs. correlation type.
- **EMBED book image (non-reproducible real data / schematics):** 7.1, 7.2 (the two
  network styles), 7.3 (the $e_{ij}$ matrix), 7.6 ($k_{nn}$ for real nets), 7.7/7.8
  (structural cutoff), 7.13/7.14 (the tuning algorithm), 7.15/7.16 (impact plots),
  7.18 (political blogosphere).

Tell me when you want slides.
