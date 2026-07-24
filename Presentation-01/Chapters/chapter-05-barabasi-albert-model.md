# Chapter 5 — The Barabási–Albert Model (Study Guide)

Chapter 4 established *that* real networks are scale-free. This chapter answers
*why*: it builds the mechanism. The one-line answer is **growth + preferential
attachment**, and this chapter proves both ingredients are *necessary* and
*sufficient*. Since it's the sequel to your thesis chapter, this guide keeps the
derivations (the degree-dynamics integration and the continuum degree distribution
are things you'll want to reproduce), and embeds every book figure inline.

**The single most important sentence of the chapter:** *to understand the topology
of a complex system, we must describe how it came into being.* Earlier models (ER,
Watts–Strogatz, configuration, hidden-parameter) place links among a *fixed* set of
nodes — like photographing a painting. The BA model re-paints the painting: it
models the *process* that assembles the network.

---

## 5.1–5.2 The two missing ingredients

The random network model has two hidden assumptions that are both **wrong** for
real networks:

**(1) Real networks grow.** ER assumes $N$ is fixed; you sprinkle links among a
constant node set. But real networks *expand by adding nodes over time*:
- The WWW went from 1 page (1991, Berners-Lee) to $>10^{12}$ today.
- Citation/collaboration networks grow as new papers are published.
- The actor network grows as new movies are released.

![The Growth of Networks](https://networksciencebook.com/images/ch-05/figure-5-1.jpg)
*Image 5.1 — the WWW, citation, and actor networks all expand through continuous
node addition.*

**(2) New nodes prefer well-connected nodes.** ER assumes you pick link partners
*randomly*. But in reality new nodes attach preferentially to nodes that already
have many links — **preferential attachment**, the "rich get richer" rule. A new
webpage is more likely to link to Google than to an obscure page; a new paper is
more likely to cite an already-famous paper.

![Preferential Attachment: a Brief History](https://networksciencebook.com/images/ch-05/figure-5-2.jpg)
*Image 5.2 — the idea has been rediscovered repeatedly (Yule, Simon, Price,
Barabási–Albert) across biology, economics, and bibliometrics.*

---

## 5.3 The Barabási–Albert model — the definition

Start with $m_0$ nodes (each with at least one link). Then at every timestep:

1. **Growth.** Add one new node with $m$ ($\le m_0$) links.
2. **Preferential attachment.** Each new link connects to an existing node $i$ with
   probability *proportional to $i$'s degree*:
   $$ \Pi(k_i) = \frac{k_i}{\sum_j k_j} $$

That's the whole model. Read $\Pi$ carefully: a new node *can* link to anyone (hub
or leaf), but a degree-4 node is *twice* as likely to be chosen as a degree-2 node.
It's a probabilistic bias, not a hard rule.

After $t$ steps the network has $N = t + m_0$ nodes and $m_0 + mt$ links. The result
(derived below) is a **power law with degree exponent $\gamma = 3$**.

![Evolution of the Barabási-Albert Model](https://networksciencebook.com/images/ch-05/figure-5-3.jpg)
*Image 5.3 — nine steps of growth with $m=2$. Empty circles are the newly arriving
node choosing where to attach.*

**Why hubs emerge — the rich-get-richer loop:** preferential attachment means
high-degree nodes gain links faster, which raises their degree, which makes them
even more attractive. A few nodes run away with the links and become hubs — at the
expense of the small nodes.

![The Degree Distribution](https://networksciencebook.com/images/ch-05/figure-5-4.jpg)
*Image 5.4 — $p_k$ for a BA network ($N=10^5$, $m=3$). Linear-binned (purple) and
log-binned (green); the guide line has slope $\gamma = 3$.*

---

## 5.4 Degree dynamics — how a single node grows (KEY DERIVATION)

Track one node $i$ over time, treating its degree $k_i$ as a continuous variable.
Each new node brings $m$ links; node $i$ captures each with probability $\Pi(k_i)$.
So $i$'s growth rate is:
$$ \frac{dk_i}{dt} = m\,\Pi(k_i) = m\,\frac{k_i}{\sum_{j} k_j} $$

The denominator sums all degrees. At time $t$ there are $\approx mt$ links, so
$\sum_j k_j = 2mt - m \approx 2mt$. Substituting:
$$ \frac{dk_i}{dt} = m\,\frac{k_i}{2mt} = \frac{k_i}{2t} $$

Separate variables and integrate, using the initial condition $k_i(t_i) = m$ (node
$i$ arrives at time $t_i$ with $m$ links):
$$ \frac{dk_i}{k_i} = \frac{1}{2}\frac{dt}{t} \;\Longrightarrow\;
\boxed{k_i(t) = m\left(\frac{t}{t_i}\right)^{\beta}}, \qquad \beta = \frac{1}{2} $$

$\beta$ is the **dynamical exponent**. What this equation tells you (all important):
- **Every node grows by the same law**, a power of time with exponent $\beta=1/2$.
- Growth is **sublinear** ($\beta<1$): a node captures links more and more slowly,
  because it competes with an ever-growing pool of newer nodes.
- **Earlier = bigger.** Smaller $t_i$ (joined earlier) → larger $k_i(t)$. Hubs are
  hubs because they *arrived early* — the "**first-mover advantage**." (Not because
  they're intrinsically special — a point Chapter 6 complicates with fitness.)
- The attachment rate $dk_i/dt = \frac{m}{2}\frac{1}{\sqrt{t_i t}}$ decays as
  $t^{-1/2}$: older nodes still gain faster, but everyone slows down.

![Degree Dynamics](https://networksciencebook.com/images/ch-05/figure-5-6.jpg)
*Image 5.6 — (a) degree growth of nodes added at different times, all following
$t^{1/2}$; earlier nodes ride higher curves. (b) $p_k$ sharpening into a power law
as $N$ grows.*

---

## 5.5 Degree distribution — why γ = 3 (KEY DERIVATION)

**Continuum theory** turns the dynamics above into a distribution. The result:
$$ p(k) \approx 2m^{1/\beta}\,k^{-\gamma}, \qquad \gamma = \frac{1}{\beta} + 1 = 3 $$

The relationship $\gamma = 1/\beta + 1$ is beautiful and worth stressing in a
thesis: it ties a **topological** quantity ($\gamma$, the shape of $p_k$) to a
**dynamical** one ($\beta$, how a node grows in time). Structure and evolution are
two views of the same process.

Continuum theory gets $\gamma$ right but the *prefactor* wrong. The **exact**
degree distribution (from the master-equation / rate-equation / LCD methods,
Advanced Topic 5.A) is:
$$ \boxed{p_k = \frac{2m(m+1)}{k(k+1)(k+2)}} $$

Its implications:
- For large $k$, $p_k \sim k^{-3}$ — recovering $\gamma = 3$.
- **$\gamma = 3$ is independent of $m$ and $m_0$.** Changing how many links each new
  node brings does not change the exponent.
- **$p_k$ is independent of $t$ and $N$** — the model reaches a **stationary
  scale-free state**. This is crucial: it explains why real networks of wildly
  different ages and sizes all show the same power law. The distribution is
  time-invariant.
- The prefactor scales as $m(m+1) \approx m^2$ — confirmed numerically.

![Probing the Analytical Predictions](https://networksciencebook.com/images/ch-05/figure-5-7.jpg)
*Image 5.7 — (a) $p_k$ for $m=1,3,5,7$ are parallel lines (slope −3) → $\gamma$
independent of $m$; the inset collapses them by dividing by $2m^2$. (b) $p_k$ for
$N=50k, 100k, 200k$ overlap → stationary, size-independent.*

---

## 5.6 Are BOTH ingredients necessary? (the necessity proof)

Test each ingredient by removing the other.

**Model A — growth, but NO preferential attachment.** New nodes attach to random
existing nodes ($\Pi$ constant, independent of $k$). Continuum theory gives a
*logarithmic* degree growth $k_i(t) = m\ln(e\,\frac{m_0+t-1}{m_0+t_i-1})$ — far
slower than the power law — and an **exponential** degree distribution:
$$ p(k) = \frac{e}{m}\,\exp\!\left(-\frac{k}{m}\right) $$
Exponential decays fast → **no hubs**. Without the rich-get-richer bias, all nodes
gain links equally and no winner emerges. **Preferential attachment is essential.**

**Model B — preferential attachment, but NO growth.** Fixed $N$ nodes; keep adding
links preferentially. Degrees grow *linearly*, $k_i(t) \approx \frac{2}{N}t$. Early
on (few links) it briefly mimics BA with a power-law tail, but $p_k$ is **not
stationary** — it keeps shifting, develops a peak, and eventually the network
becomes a **complete graph** ($p_k = \delta(N-1)$, everyone connected to everyone).
**Growth is essential** for a stable scale-free state.

![Model A and Model B](https://networksciencebook.com/images/ch-05/figure-5-8.jpg)
*Image 5.8 — (a) Model A: exponential $p_k$ (straight on lin-log), no hubs. (b)
Model B: $p_k$ drifts and is non-stationary, converging toward a complete graph.*

**Conclusion:** neither ingredient alone works. Growth + preferential attachment are
*jointly* required. (Together with 5.5, this makes them *necessary and sufficient*.)

---

## 5.7 Measuring preferential attachment in real data

Preferential attachment makes two testable claims:
- **Hypothesis 1:** attachment probability *depends on* degree $k$ (vs. random,
  where it doesn't).
- **Hypothesis 2:** that dependence is *linear* in $k$.

**How to measure it.** Take two snapshots of a network at $t$ and $t+\Delta t$. For
each node, measure how many new links it gained, $\Delta k_i$. Then:
$$ \frac{\Delta k_i}{\Delta t} \sim \Pi(k_i) $$
gives the attachment function directly. ($\Delta t$ small enough that degrees barely
change, but large enough to see differences.)

Raw $\Delta k / \Delta t$ is noisy, so plot the **cumulative** version:
$$ \pi(k) = \sum_{k_i = 0}^{k} \Pi(k_i) $$
Then the shape reveals the mechanism:
- **No preferential attachment** ($\Pi$ constant) → $\pi(k) \sim k$.
- **Linear preferential attachment** ($\Pi \sim k$) → $\pi(k) \sim k^2$.

![Detecting Preferential Attachment](https://networksciencebook.com/images/ch-05/figure-5-9.jpg)
*Image 5.9 — comparing two time-separated maps; nodes that gained links from the new
arrivals reveal $\Pi(k)$. A linear $\Pi$ shows as $\Delta k/\Delta t$ rising
linearly with $k$.*

**What real data shows.** Fit $\Pi(k) \sim k^\alpha$:
- Internet, citations: $\alpha \approx 1$ (**linear** — Hypotheses 1 & 2 hold).
- Co-authorship, actors: $\alpha \approx 0.9 \pm 0.1$ (**sublinear** — H1 holds, H2
  violated).

So preferential attachment is real and detectable, but *not always exactly linear*.

![Evidence of Preferential Attachment](https://networksciencebook.com/images/ch-05/figure-5-10.jpg)
*Image 5.10 — $\pi(k)$ for citations, Internet, collaboration, actors. All rise
faster than $k$ (so H1 holds); (c) and (d) rise slower than $k^2$ (sublinear).*

---

## 5.8 Nonlinear preferential attachment — what if $\Pi \sim k^\alpha$?

Replace linear $\Pi$ with $\Pi(k) \sim k^\alpha$ and see how the topology changes.
Three regimes:

- **$\alpha = 0$** — no bias → back to Model A → **exponential** $p_k$, no hubs.
- **Sublinear, $0 < \alpha < 1$** — weak bias, *not enough* to make a power law.
  Degrees follow a **stretched exponential** (the crossover distribution from Ch. 4).
  The largest hub grows only *logarithmically* with $N$ (much slower than the
  power-law $N^{1/(\gamma-1)}$), so **hubs are suppressed**.
- **Superlinear, $\alpha > 1$** — bias too strong → **winner-takes-all**. Almost all
  links condense onto one or a few **super-hubs** that connect to nearly every node;
  the rest stay tiny. A near-star topology.

![The Growth of the Hubs](https://networksciencebook.com/images/ch-05/figure-5-11.jpg)
*Image 5.11 — largest-hub size vs $\alpha$: suppressed for $\alpha<1$, explosive for
$\alpha>1$.*

**Key thesis point:** $\Pi(k)$ must be **exactly linear** ($\alpha=1$) to get a
*pure* power law. Since some real systems (collaboration, actors) are sublinear,
this is one concrete reason real degree distributions deviate from a clean power law
— they're better fit by a stretched exponential.

![Nonlinear Preferential Attachment](https://networksciencebook.com/images/ch-05/figure-5-12.jpg)
*Image 5.12 — networks generated with sublinear ($\alpha<1$), linear, and
superlinear ($\alpha>1$) attachment. Only linear gives a scale-free structure.*

---

## 5.9 Where does preferential attachment COME FROM?

Preferential attachment can feel like it needs new nodes to somehow "know" every
node's degree. It doesn't. Three models generate it *without building it in* — it
*emerges* from simpler local rules. This section is conceptually rich and good
thesis material.

### Link selection model (the simplest)
Grow the network; each new node picks a **random link** and connects to one of its
two endpoints. Why does this give preferential attachment? Because a high-degree
node sits on *more* links, so it's *more likely* to be at the end of a randomly
chosen link. The probability of reaching a degree-$k$ node is exactly $\propto k$ —
linear preferential attachment, for free, with no global degree knowledge.

![Link Selection Model](https://networksciencebook.com/images/ch-05/figure-5-13.jpg)
*Image 5.13 — pick a random link, attach to an endpoint. High-degree nodes are
over-represented among link endpoints → $\Pi \sim k$.*

### Copying model (webpages / genes)
A new node picks a random existing node $u$, then with probability $p$ links to $u$,
or with probability $1-p$ links to a *random node that $u$ points to* (copies one of
$u$'s links). The copying step lands on high-degree nodes more often (they're
pointed to by more nodes) → preferential attachment. This models real mechanisms:
new webpages copy links from related pages; gene duplication copies interaction
partners. This is the mechanism behind the Web's scale-free structure and behind
protein-network evolution.

![Copying Model](https://networksciencebook.com/images/ch-05/figure-5-14.jpg)
*Image 5.14 — copy a link from a randomly chosen node → effectively preferential.*

### Optimization model (luck vs. reason)
Each new node $i$ chooses where to connect by *minimizing a cost* that trades off two
things: physical distance $d_{ij}$ to a target vs. that target's "centrality"
$h_j$ (its network distance to the center):
$$ \min_j \left[ \delta\, d_{ij} + h_j \right] $$
Depending on $\delta$ (and $N$), three topologies emerge:
- Small $\delta$ → a **star** (distance irrelevant, everyone joins the center).
- Large $\delta$ → a **random-like** bounded network (only nearest node matters).
- Intermediate $\delta$ → a **scale-free** network — and here, measured $\Pi(k)$
  turns out **linear**, because each node has a "basin of attraction" whose size
  correlates with its degree, so bigger nodes catch more new nodes.

![Optimization Model](https://networksciencebook.com/images/ch-05/figure-5-15.jpg)
*Image 5.15 — the cost trade-off, the three phases (star / scale-free / random), and
the basins of attraction that produce preferential attachment.*

![Scaling in the Optimization Model](https://networksciencebook.com/images/ch-05/figure-5-16.jpg)
*Image 5.16 — the scale-free phase shows linear $\Pi(k)$; the star and exponential
phases don't.*

**The big picture (Image 5.17):** preferential attachment can arise from two very
different origins — **randomness** (link selection, copying) or **optimization**
(nodes balancing competing goals). Either way, they all produce *linear* $\Pi(k)$.
And empirically, *every known scale-free model or real system has preferential
attachment* — strong evidence it's the universal origin of the scale-free property.

![Luck or Reason: an Ancient Fight](https://networksciencebook.com/images/ch-05/figure-5-17.jpg)
*Image 5.17 — the "luck (randomness) vs. reason (optimization)" dichotomy, both
roads leading to preferential attachment.*

---

## 5.10 Diameter and clustering

**Diameter.** For $m>1$ and large $N$, the BA diameter grows as:
$$ \langle d \rangle \sim \frac{\ln N}{\ln \ln N} $$
Slower than the random network's $\ln N$ — so BA networks are even *more* compact.
The $\ln\ln N$ correction only becomes visible for large $N$ ($\gtrsim 10^4$); below
that, plain $\ln N$ describes the scaling well. (This is the $\gamma=3$ case of the
ultra-small-world regimes from Ch. 4.)

![Average Distance](https://networksciencebook.com/images/ch-05/figure-5-18.jpg)
*Image 5.18 — $\langle d\rangle$ vs $N$; BA (solid) dips below the random prediction
(dotted) as $N$ grows.*

**Clustering coefficient.**
$$ \langle C \rangle \sim \frac{(\ln N)^2}{N} $$
Compare to the random network's $\langle C\rangle \sim 1/N$: the $(\ln N)^2$ factor
makes BA networks **more locally clustered** than random ones of the same size —
though still far below what many real networks show (which motivates later models).

![Clustering Coefficient](https://networksciencebook.com/images/ch-05/figure-5-19.jpg)
*Image 5.19 — BA clustering (solid) sits above the random $1/N$ line (dotted).*

---

## 5.11 Summary — structure and evolution are inseparable

The deepest message: **you cannot separate a network's structure from its history.**
ER, Watts–Strogatz, configuration, and hidden-parameter models all arrange links
among a *fixed* node set — a photo of the painting. The BA model re-paints it,
modeling genesis. To *explain* (not just reproduce) a network property, you need a
model of how the network came to be.

The necessary-and-sufficient argument, in full:
- **Necessary:** remove growth or remove preferential attachment and the scale-free
  property (or stationarity) is lost (Models A, B).
- **Sufficient:** with both present, you provably get $\gamma=3$ scale-free networks.
- **Universality of the mechanism:** even models with no explicit $\Pi(k)$ (link
  selection, copying, optimization) turn out to *generate* linear preferential
  attachment. Every known scale-free system has it.

**What the BA model does NOT explain** (sets up later chapters): real $\gamma$ varies
(BA gives only 3); some nodes become hubs *despite arriving late* (fitness, Ch. 6);
real clustering is often higher; sublinear attachment produces stretched
exponentials, not pure power laws. BA is the foundational skeleton; Chapter 6 adds
the flesh.

> **Box 5.1** gives a mathematically self-consistent restatement of the model.
> **Advanced Topics 5.A** (exact $p_k$ via master/rate equations & the LCD model),
> **5.B** (nonlinear $\Pi$ regimes), and **5.C** (clustering derivation) contain the
> rigorous versions of the results quoted above — worth reading 5.A in full for a
> thesis, since the master-equation method is a standard tool.

---

## Quick figure index (for the slide stage)

Applying your rule — simulate what's meaningful and reproducible, embed the rest:

- **Meaningful to SIMULATE (interactive/live):**
  - BA growth with preferential attachment (already have `createBAGrowthSim`) — the
    centerpiece "watch hubs emerge" demo.
  - Degree dynamics $k_i(t) = m(t/t_i)^{1/2}$ — a plot of several nodes' growth
    curves (earlier = higher).
  - The $\Pi(k) \sim k^\alpha$ regimes (sublinear / linear / superlinear) — a slider
    on $\alpha$ showing hub size change.
  - Model A vs BA degree distribution (exponential vs power law) — a toggle.
  - Diameter / clustering scaling vs $N$ — generated plots.
- **EMBED book image (non-reproducible renders or multi-panel data figures):** 5.1
  (network growth photos), 5.2 (history), 5.9 (two-snapshot method schematic), 5.10
  ($\pi(k)$ for four real nets), 5.13/5.14/5.15/5.16 (the origin-model schematics),
  5.17 (luck-vs-reason). The rest (5.3, 5.4, 5.6, 5.7, 5.8, 5.11, 5.12, 5.18, 5.19)
  are plots/network drawings I can regenerate live.

Tell me when you want slides.
