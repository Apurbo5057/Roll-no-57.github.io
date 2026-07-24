# Chapter 6 — Evolving Networks (Study Guide)

The BA model (Ch. 5) is a *minimal* model — it nails the core mechanism but has
three well-known limitations this chapter fixes:
1. It predicts only **$\gamma = 3$**, yet real exponents range from **2 to 5**.
2. It predicts a **pure** power law, yet real distributions show saturations and
   cutoffs.
3. It ignores obvious real processes — **fitness, internal links, node/link removal,
   aging, accelerated growth.**

This chapter does two things: (1) adds **fitness** (the Bianconi–Barabási model),
which explains how latecomers become hubs and leads to the striking **Bose–Einstein
condensation** result; and (2) systematically adds each missing process and shows
how each one *tunes $\gamma$*. For a thesis on scale-free networks this is the "how
real networks deviate from the ideal" chapter — very much worth the depth. Book
figures are embedded inline.

---

## 6.1 The problem: not all hubs arrived early

BA's "first-mover advantage" says the oldest node is always the biggest — degree is
purely a matter of age. But reality contradicts this: **Google arrived late and
overtook everyone; Facebook was a latecomer that became the Web's biggest hub.**
Some nodes have an intrinsic edge that lets them acquire links faster than their age
predicts. That edge is called **fitness**.

![Garment District](https://networksciencebook.com/images/ch-06/figure-6-1.jpg)
*Image 6.1 — a competitive marketplace: some players thrive, most don't, regardless
of when they entered.*

---

## 6.2 The Bianconi–Barabási (fitness) model

Fitness $\eta$ is a node's intrinsic ability to attract links — a person's knack for
turning encounters into friendships, a company's edge at winning customers, a page's
stickiness. The model modifies BA so attachment depends on **degree × fitness**:

**The model.** Each new node $j$ arrives with $m$ links and a fitness $\eta_j$ drawn
from a distribution $\rho(\eta)$ (fixed for life). A new link attaches to node $i$
with probability:
$$ \Pi_i = \frac{\eta_i k_i}{\sum_j \eta_j k_j} $$

So between two nodes of equal degree, the fitter one is more likely to win the link.
This lets a young, low-degree but high-fitness node acquire links rapidly and
overtake older nodes.

### Degree dynamics (the key new result)

The growth rate is $\partial k_i / \partial t = m\,\eta_i k_i / \sum_j \eta_j k_j$.
Assume each node grows as a power law with a **fitness-dependent exponent**:
$$ k(t, t_i, \eta_i) = m\left(\frac{t}{t_i}\right)^{\beta(\eta_i)} $$
Substituting gives
$$ \beta(\eta) = \frac{\eta}{C}, \qquad C = \int \rho(\eta)\,\frac{\eta}{1-\beta(\eta)}\,d\eta $$

**This is the heart of the model:** each node has its *own* dynamical exponent
$\beta(\eta)$, proportional to its fitness. Fitter nodes grow *faster* (steeper
curve), so given enough time a high-fitness latecomer overtakes low-fitness
old-timers — the **"fit-gets-rich"** dynamics, versus BA's pure "first-mover"
dynamics.

![Competition in the Bianconi-Barabási Model](https://networksciencebook.com/images/ch-06/figure-6-2.jpg)
*Image 6.2 — (a,b) in BA all nodes share $\beta=1/2$, so later nodes can never
overtake earlier ones. (c,d) in Bianconi–Barabási a high-fitness latecomer (purple)
climbs its own steeper curve and passes the earlier nodes.*

### Degree distribution

The distribution is now a **weighted sum of power laws**, one per fitness value:
$$ p_k \approx C \int d\eta\,\rho(\eta)\,\frac{1}{\eta}\left(\frac{m}{k}\right)^{\frac{C}{\eta}+1} $$
So the shape depends entirely on $\rho(\eta)$. Two cases:

- **Equal fitness** ($\rho(\eta)=\delta(\eta-1)$): reduces exactly to BA. $C=2$,
  $\beta=1/2$, $p_k \sim k^{-3}$.
- **Uniform fitness** ($\eta$ uniform on $[0,1]$): $C$ solves the transcendental
  equation $e^{-2/C} = 1 - 1/C$, giving $C^* = 1.255$. Each node gets
  $\beta(\eta_i) = \eta_i/C^*$, and the distribution becomes
  $$ p_k \sim \frac{k^{-(1+C^*)}}{\ln k} \;\Rightarrow\; \gamma = 2.255 $$
  with an inverse-log correction — so **fitness alone shifts $\gamma$ away from 3**
  and produces a not-quite-pure power law. This is one clean answer to "why isn't
  real $\gamma$ always 3?"

![Characterizing the Bianconi-Barabási Model](https://networksciencebook.com/images/ch-06/figure-6-3.jpg)
*Image 6.3 — (a) measured $\beta(\eta)$ matches $\eta/C^*$; (b) the numerical $p_k$
matches the log-corrected power law.*

---

## 6.3 Measuring fitness in real data

Fitness isn't just theoretical — you can extract it. The trick: a node's fitness
governs how fast its degree grows, so you fit each node's degree-vs-time trajectory.

- **Web documents (Image 6.4):** the WWW's fitness distribution is roughly
  **exponential** — most pages have modest fitness, a few are far stickier.
- **Research papers (Image 6.5):** citation "fitness" follows a **peaked**
  distribution — most papers cluster around a typical fitness, few are outliers.

![The Fitness Distribution of the WWW](https://networksciencebook.com/images/ch-06/figure-6-4.jpg)
*Image 6.4 — the WWW fitness distribution is exponential.*

![Fitness Distribution of Research Papers](https://networksciencebook.com/images/ch-06/figure-6-5.jpg)
*Image 6.5 — paper fitness is peaked around a typical value.*

The point: different systems have different $\rho(\eta)$, and — as the next section
shows — the *shape* of $\rho(\eta)$ can qualitatively change the whole network.

---

## 6.4 Bose–Einstein condensation (the spectacular result)

This is the chapter's showpiece — a surprising, exact mapping between the fitness
model and quantum physics.

**The mapping (fitness model → Bose gas):**
- **Fitness → energy:** $\varepsilon_i = \frac{1}{\beta_T}\ln\eta_i$ (higher fitness
  = lower energy; $\beta_T$ = inverse "temperature").
- **Links → particles:** each link into node $j$ = one particle at energy level
  $\varepsilon_j$.
- **Nodes → energy levels:** a new node adds a new level plus $m$ particles.

Following this through, the link populations obey **Bose statistics** — the network's
links literally behave like a quantum gas. The mapping is *exact* and predicts **two
phases**:

![Mapping Networks to a Bose Gas](https://networksciencebook.com/images/ch-06/figure-6-7.jpg)
*Image 6.7 — the network ↔ Bose gas dictionary: each node becomes an energy level,
each link a particle deposited on a level.*

**Scale-free phase (fit-gets-rich).** For most fitness distributions, degree is set
by fitness; the fittest node is the biggest hub but is *closely trailed* by a few
almost-as-big hubs. The degree distribution stays a power law — the network is
scale-free. (The uniform-fitness case of §6.2 lives here.)

**Bose–Einstein condensation (winner-takes-all).** For *some* fitness distributions,
a single fittest node grabs a **finite fraction of ALL links** — a super-hub — just
as, in a real Bose gas below a critical temperature, all particles collapse into the
lowest energy level. The network is **no longer scale-free**: it becomes a
**hub-and-spoke star**. The rich-get-richer process turns into a runaway
winner-takes-all.

**What decides which phase?** Crucially, the temperature $\beta_T$ cancels out of all
topological quantities — so **only the shape of $\rho(\eta)$ matters**. Condensation
occurs when the fitness distribution satisfies a specific integral condition
(essentially, when the Bose-gas chemical-potential equation has no valid solution).
A family that can be tuned through the transition is
$$ \rho(\eta) = (1-\zeta)(1-\eta)^\zeta $$
varying $\zeta$ moves the network between the scale-free and condensed phases.

![Bose-Einstein Condensation in Networks](https://networksciencebook.com/images/ch-06/figure-6-9.jpg)
*Image 6.9 — (a) scale-free phase vs (b) condensed phase (one dominant super-hub).
(c,d) the energy-level/particle picture — a hugely populated lowest level = the
condensate. (e,f) the two $\rho(\eta)$ shapes that produce each phase.*

**Why this matters for a thesis:** it's the sharpest example of the chapter's thesis
— *the microscopic rule ($\rho(\eta)$) determines the macroscopic topology.* And it
connects networks to one of the deepest results in statistical physics.

---

## 6.5 Evolving networks — tuning γ with elementary processes

Now the systematic part: add each real-world process to BA and watch how $\gamma$
moves. This is the toolkit that explains the full $2 \le \gamma \le 5$ range.

### Initial attractiveness — even isolated nodes get links

In BA, a $k=0$ node can *never* get a link ($\Pi(0)=0$). But real isolated nodes do
acquire links (every paper eventually gets its first citation). Fix: add a constant
$A$:
$$ \Pi_k \sim A + k $$
$A$ = "initial attractiveness" = the pull of a brand-new node. Consequences:
- **Raises the exponent:** $\gamma = 3 + \frac{A}{m}$. The random $A$ term favors
  small nodes and weakens preferential attachment → more homogeneous, smaller hubs.
- **Creates low-degree saturation:** $p_k = C(k+A)^{-\gamma}$ — the $A$ plays the
  role of $k_{sat}$ from Ch. 4, flattening $p_k$ for $k < A$. So this is the
  *mechanistic origin* of the saturation you fit empirically. Measured in real
  citation data: $A \approx 7$.

![Initial Attractiveness](https://networksciencebook.com/images/ch-06/figure-6-10.jpg)
*Image 6.10 — measured $\pi(k)$ for citations; the fit needs $A\approx7$ (solid),
not $A=0$ (dashed).*

### Internal links — links between existing nodes

Most new WWW/social links form between *pre-existing* nodes, not with newcomers.
Model internal links with double preferential attachment $\Pi(k,k') \sim
(A+Bk)(A+Bk')$. Two limits:
- **Double preferential ($A=0$):** new internal links prefer high-degree pairs →
  hubs link to hubs → **lowers** the exponent, $\gamma = 2 + \frac{m}{m+2n}$ (between
  2 and 3). More heterogeneous.
- **Random ($B=0$):** internal links join random pairs → **raises** it, $\gamma = 3 +
  \frac{2n}{m}$ ($\ge 3$). More homogeneous (mimics ER randomness).

So internal links can push $\gamma$ either way depending on whether they're
preferential or random.

### Node deletion — networks can shrink

Add a node each step, delete one at rate $r$. Three regimes:
- **$r < 1$ (growing):** still scale-free, but $\gamma = 3 + \frac{2}{1-r}$ — removal
  *raises* $\gamma$, homogenizing.
- **$r = 1$ (constant size):** $\gamma \to \infty$ — loses scale-free nature.
- **$r > 1$ (declining):** the network shrinks (e.g. the telegraph network's
  post-WWII decline; neuron loss in Alzheimer's).

Combined with initial attractiveness, node removal produces an actual **topological
phase transition** (Image 6.12): below a critical removal rate $r^*(A)$ → scale-free;
at $r^*$ → stretched exponential; above → exponential. A continuous knob (removal
rate) triggers a qualitative topology change.

![The Impossibility of Node Deletion](https://networksciencebook.com/images/ch-06/figure-6-11.jpg)
*Image 6.11 — retracted (fraudulent) papers keep getting cited: some nodes are
nearly impossible to delete from a citation network.*

![Phase Transitions Induced by Node Removal](https://networksciencebook.com/images/ch-06/figure-6-12.jpg)
*Image 6.12 — the $(r, A)$ phase diagram: scale-free → stretched-exponential →
exponential as removal rate rises.*

### Accelerated growth — links grow faster than nodes

If each new node brings $m(t) = m_0 t^\theta$ links ($\theta>0$, so average degree
rises over time — seen in the Internet, WWW, metabolic networks):
$$ \gamma = 3 + \frac{2\theta}{1-\theta} $$
Pushes $\gamma$ above 3 (more homogeneous); at $\theta=1$ ("hyper-accelerating")
$\gamma$ diverges and the scale-free property is lost.

### Aging — nodes fade over time

Nodes have finite lifespans (actors stop acting, scientists stop publishing). Model:
attachment decays with node age $t-t_i$:
$$ \Pi(k_i, t-t_i) \sim k_i\,(t-t_i)^{-\nu} $$
Three regimes in the aging exponent $\nu$:
- **$\nu < 0$:** new nodes prefer *old* nodes → strengthens preferential attachment →
  $\gamma$ drops *below* 3 (more heterogeneous); $\nu\to-\infty$ gives a
  hub-and-spoke star.
- **$0 < \nu < 1$:** new nodes prefer *younger* nodes → old hubs get shadowed →
  $\gamma$ rises, diverging as $\nu\to1$ (more homogeneous).
- **$\nu > 1$:** aging overwhelms preferential attachment → scale-free property lost;
  $\nu\to\infty$ makes the network a chain (each node links to its immediate
  predecessor).

![The Impact of Aging](https://networksciencebook.com/images/ch-06/figure-6-14.jpg)
*Image 6.14 — (a–d) topologies from hub-and-spoke (very negative $\nu$) to chain
(large positive $\nu$); (e) $\gamma$ vs $\nu$, diverging near $\nu=1$.*

![Elementary Processes Affecting the Network Topology](https://networksciencebook.com/images/ch-06/figure-6-15.jpg)
*Image 6.15 — the full menu of elementary processes and how each reshapes topology.*

---

## 6.6 Summary — the evolving-network paradigm

**The big table to remember** — how each process moves $\gamma$ (relative to BA's 3):

| Process | Effect on $\gamma$ | Effect on network |
|---|---|---|
| Initial attractiveness $A$ | $3 + A/m$ (↑) | more homogeneous, small-$k$ saturation |
| Internal links, preferential | $2 + \frac{m}{m+2n}$ (↓, 2–3) | more heterogeneous, bigger hubs |
| Internal links, random | $3 + \frac{2n}{m}$ (↑) | more homogeneous |
| Node deletion (rate $r<1$) | $3 + \frac{2}{1-r}$ (↑) | more homogeneous |
| Accelerated growth | $3 + \frac{2\theta}{1-\theta}$ (↑) | more homogeneous |
| Aging, $\nu<0$ | ↓ below 3 | more heterogeneous |
| Aging, $0<\nu<1$ | ↑ above 3 | more homogeneous |
| Fitness (uniform) | 2.255 (with log correction) | fit-gets-rich |

**Two takeaways for the thesis:**
- **Topological diversity is explained.** The observed $2 \le \gamma \le 5$ range and
  the deviations from pure power laws (saturations, cutoffs, stretched exponentials)
  are not mysteries — each is the fingerprint of a specific elementary process.
  Sublinear preferential attachment (Ch. 5) or critical node removal → stretched
  exponential; initial attractiveness → low-$k$ saturation; and so on.
- **Modeling philosophy.** The configuration/hidden-parameter models (Ch. 4) are
  *non-mechanistic* — they reproduce a given $p_k$ without explaining it. The
  evolving-network models here are *mechanistic* — they tell you *why* a network has
  the $p_k$ it does. If you want to *fit* a real degree distribution properly, first
  build the generative model that predicts its functional form; but often it's enough
  just to classify it as heavy-tailed vs. exponentially bounded (Ch. 4).

> **Advanced Topic 6.A** gives the full continuum-theory solution of the
> Bianconi–Barabási model (the derivation of $\beta(\eta)=\eta/C$ and the $p_k$
> integral). Worth reading in full for a thesis, since the self-consistent $C$
> equation and the Bose-gas mapping are the technically deepest results in this part
> of the book.

---

## Figure index (for the slide stage)

- **Meaningful to SIMULATE (live):**
  - Bianconi–Barabási growth with fitness (colour = fitness, size = degree) — the
    "fit-gets-rich, latecomer overtakes" demo. **The centerpiece.**
  - Fitness-dependent degree dynamics $k(t) = m(t/t_i)^{\eta/C}$ — curves with
    different slopes, a high-fitness latecomer crossing over an old node.
  - Bose–Einstein condensation — a $\zeta$ (or "fittest-node fitness") slider that
    tips the network from scale-free (many hubs) to a single super-hub star.
  - A "$\gamma$ tuner" — a small interactive plugging each process's formula
    ($A$, $r$, $\theta$, $\nu$) into a live $\gamma$ readout / distribution.
- **EMBED book image (non-reproducible renders, real data, schematics):** 6.1
  (marketplace), 6.4/6.5 (real fitness distributions), 6.7 (Bose-gas mapping), 6.10
  (initial attractiveness data), 6.11 (retracted-paper citations), 6.12 (phase
  diagram), 6.14 (aging topologies), 6.15 (process menu). 6.2/6.3/6.9 are
  plots/network drawings I can rebuild live.

Tell me when you want slides.
