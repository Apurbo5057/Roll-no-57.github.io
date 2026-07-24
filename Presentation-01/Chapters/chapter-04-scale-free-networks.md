# Chapter 4 — The Scale-Free Property (Study Guide)

This is your thesis chapter, so this guide is exhaustive: every section, every
equation with its *meaning*, every figure (embedded inline so you never open the
book), and all advanced topics (4.A–4.C), which here contain material you'll
actually use — the distribution zoo, correct power-law plotting, and statistical
γ-fitting.

**One-sentence core:** ==a *scale-free network* is one whose degree distribution
follows a power law $p_k \sim k^{-\gamma}$ — a fat tail containing hubs — and that
single fact reshapes almost everything about the network.==

---

## 4.1 Introduction — the WWW as the discovery ground

- The **WWW** is a *directed* network: nodes = documents, links = URLs. Estimated
  $N\approx10^{12}$ — the largest network ever built, bigger even than the brain
  ($\sim10^{11}$ neurons).
- A **crawler** maps it: start at a page, read its outgoing URLs, download those,
  recurse. This is how Google/Bing index the Web, and how Hawoong Jeong built the
  first purpose-made map (the `nd.edu` domain, ~300k nodes, ~1.5M links) in 1998.
- The *1998 expectation*: the Web would be **random** (Erdős–Rényi), since each
  author's links reflect idiosyncratic interests and might look randomly placed.
- **What they found instead:** hubs — many small nodes coexisting with a few
  enormously connected ones. A random network effectively *forbids* hubs. That
  mismatch is the entire chapter.

![The Topology of the World Wide Web](https://networksciencebook.com/images/ch-04/figure-4-1.jpg)
*Image 4.1 — The 1998 WWW map, zoomed in progressively. Nodes with >50 links are
red, >500 purple. The visual point: hubs are everywhere.*

---

## 4.2 Power laws and scale-free networks — the core definition

If the WWW were random, degrees would be Poisson. They're not. On a **log-log
plot** the degree distribution is an approximate **straight line** — the signature
of a power law:
$$ p_k \sim k^{-\gamma} $$
$\gamma$ is the **degree exponent**. Why a straight line? Take logs:
$$ \log p_k \sim -\gamma \log k $$
so $\log p_k$ is linear in $\log k$ with slope $-\gamma$. **This is the single most
important plotting fact of the chapter:** power law ⇔ straight line on log-log, and
the slope *is* the exponent.

Because the WWW is directed, it has **two** degree distributions, each its own
power law:
$$ p_{k_{in}} \sim k_{in}^{-\gamma_{in}}, \qquad p_{k_{out}} \sim k_{out}^{-\gamma_{out}} $$
with in general $\gamma_{in}\neq\gamma_{out}$ (WWW: $\gamma_{in}\approx2.1$,
$\gamma_{out}\approx2.45$). The scaling held over **~4 orders of magnitude** — that
earns the "scale-free" label.

**Definition (memorize):** *A scale-free network is a network whose degree
distribution follows a power law.*

![The Degree Distribution of the WWW](https://networksciencebook.com/images/ch-04/figure-4-2.jpg)
*Image 4.2 — In- (a) and out- (b) degree distributions of the WWW on log-log axes.
Symbols = data (straight line = power law, $\gamma_{in}=2.1$, $\gamma_{out}=2.45$);
green line = the Poisson prediction, which fits terribly.*

### The two formalisms (you'll use both)

**Discrete** — degrees are integers $k=1,2,3,\dots$:
$$ p_k = C k^{-\gamma}, \qquad \sum_{k=1}^{\infty} p_k = 1 $$
Normalizing: $C\sum_k k^{-\gamma}=1$, and $\sum_{k=1}^\infty k^{-\gamma}=\zeta(\gamma)$
(the **Riemann zeta function**), so
$$ p_k = \frac{k^{-\gamma}}{\zeta(\gamma)} $$
This diverges at $k=0$, so handle $p_0$ separately if isolated nodes exist.

**Continuum** — treat $k$ as real (for calculus):
$$ p(k) = C k^{-\gamma}, \qquad \int_{k_{min}}^{\infty} p(k)\,dk = 1
\;\Rightarrow\; C = (\gamma-1)k_{min}^{\gamma-1} $$
$$ p(k) = (\gamma-1)\,k_{min}^{\gamma-1}\,k^{-\gamma} $$
**Crucial difference:** discrete $p_k$ *is* the probability of exactly degree $k$;
continuum $p(k)$ is a *density* — only $\int_{k_1}^{k_2}p(k)\,dk$ (probability degree
falls in $[k_1,k_2]$) is meaningful. Don't read $p(k)$ as a probability.

> **Box 4.1 — Pareto / 80-20.** The power law's first sighting was Pareto's 1890s
> income finding: a few people earn most of the money. "80% of X from 20% of Y."
> In networks: ~80% of Web links point to ~15% of pages; 80% of citations to ~38%
> of scientists. The "1%" of 2009 Occupy is the same income tail. Good talk hook.

---

## 4.3 Hubs — where random and scale-free diverge

The difference lives in the **tail** (large $k$). Comparing Poisson vs power law at
the same $\langle k\rangle$:

1. **Small $k$:** power law is *above* Poisson → more tiny-degree nodes.
2. **Around $\langle k\rangle$:** Poisson is above → excess of "typical" nodes.
3. **Large $k$:** power law is *far* above → hubs are orders of magnitude more
   likely. On log-log this gap is enormous.

**The numbers.** $p_{100}$: under Poisson $\approx10^{-94}$; under power law
$\approx4\times10^{-4}$. For the whole WWW ($N\approx10^{12}$, $\langle k\rangle=4.6$):
random → $\sim10^{-82}$ nodes with $k\ge100$ (**zero**); scale-free ($\gamma_{in}=2.1$)
→ $\sim4\times10^{9}$ (**four billion**). That $\sim10^{91}$ gap is why "hubs are
forbidden in random networks" is literal.

![Poisson vs. Power-law Distributions](https://networksciencebook.com/images/ch-04/figure-4-4.jpg)
*Image 4.4 — (a) Poisson vs power law, linear axes; (b) same on log-log (the tail
gap is obvious); (c) a random net (all degrees ≈ mean); (d) a scale-free net (node
size ∝ degree — a few big hubs, many small nodes).*

### The largest hub (natural cutoff $k_{max}$)

Real networks are finite → a largest hub. Estimate it by requiring **at most one
node** above $k_{max}$, i.e. probability of exceeding $k_{max}$ is $1/N$:
$$ \int_{k_{max}}^{\infty} p(k)\,dk = \frac{1}{N} $$

**Exponential** $p(k)=Ce^{-\lambda k}$ →
$$ k_{max} = k_{min} + \frac{\ln N}{\lambda} $$
grows only *logarithmically* — biggest hub barely exceeds smallest node.

**Scale-free** →
$$ \boxed{k_{max} = k_{min}\,N^{\frac{1}{\gamma-1}}} $$
grows as a **power of $N$** — bigger network ⇒ dramatically bigger hubs, huge
smallest-to-largest separation. This is the key result of the section.

**Concrete** (WWW sample, $N\approx3\times10^5$, $k_{min}=1$): exponential predicts
$k_{max}\approx14$; scale-free ($\gamma=2.1$) predicts $\approx95{,}000$. Actual
largest in-degree = 10,721 — scale-free territory, nowhere near 14.

![Hubs are Large in Scale-free Networks](https://networksciencebook.com/images/ch-04/figure-4-5.jpg)
*Image 4.5 — $k_{max}$ vs $N$: scale-free (polynomial) towers over random
(logarithmic); the linear line is the complete-graph reference.*

**The analogy to internalize:**
- **Random network ≈ highway system**: cities have comparable numbers of highways;
  none has hundreds, none has zero.
- **Scale-free network ≈ air-traffic system**: most airports tiny, a few (Chicago,
  LA) massive hubs. Boston→LA routes *through a hub*. Hubs change how you navigate —
  the seed of the ultra-small-world result.

![Random vs. Scale-free Networks](https://networksciencebook.com/images/ch-04/figure-4-6.jpg)
*Image 4.6 — the highway (random, Poisson) vs airport (scale-free, power-law)
analogy, side by side.*

---

## 4.4 The meaning of "scale-free" — via the moments of $p_k$

Why the *name*. It hinges on the **moments**:
$$ \langle k^n \rangle = \sum_k k^n p_k \approx \int_{k_{min}}^{\infty} k^n p(k)\,dk $$
- $n=1$: mean $\langle k\rangle$.
- $n=2$: gives variance $\sigma^2=\langle k^2\rangle-\langle k\rangle^2$ (degree spread).
- $n=3$: skewness (asymmetry).

For a scale-free network, integrating $k_{min}\to k_{max}$:
$$ \langle k^n \rangle = C\,\frac{k_{max}^{\,n-\gamma+1} - k_{min}^{\,n-\gamma+1}}{n-\gamma+1} $$
As the network grows $k_{max}\to\infty$. The fate of each moment depends on the sign
of $n-\gamma+1$:
- $n-\gamma+1\le0$ (i.e. $n\le\gamma-1$): the $k_{max}$ term vanishes → **finite**.
- $n-\gamma+1>0$ (i.e. $n>\gamma-1$): the $k_{max}$ term blows up → **diverges**.

**For the common $2<\gamma<3$:** $\langle k\rangle$ finite, but **$\langle k^2\rangle$
diverges** (and all higher moments). *This divergence is the whole reason for the
name.* The logic:

- **Random networks have a scale.** Poisson: $\sigma_k=\langle k\rangle^{1/2}<\langle
  k\rangle$. Degrees sit in a tight band $\langle k\rangle\pm\langle k\rangle^{1/2}$.
  The mean is a meaningful "typical size" — a **scale**.
- **Scale-free networks lack a scale.** With $\gamma<3$, $\sigma_k$ diverges. Pick a
  random node and you genuinely can't say what to expect — degree could be 1 or a
  million. No "typical" degree, no internal scale → "**scale-free**."

WWW ($\langle k\rangle=4.6$, $\gamma\approx2.1$): expected in-degree of a random
document is "$4.6\pm\infty$" in the limit. 74% of nodes are below the mean, yet you
might hit google.com. The average tells you almost nothing.

Even *finite* nets show it: WWW $k_{in}=4.6\pm1546$. Exceptions confirm the rule —
the **power grid** has $\sigma\approx\langle k\rangle^{1/2}$ (not scale-free); the
phone network has large $\gamma$ (looks random).

![Lack of an Internal Scale](https://networksciencebook.com/images/ch-04/figure-4-7.jpg)
*Image 4.7 — for a bounded (Poisson/Gaussian) distribution the degree of a random
node sits near $\langle k\rangle$, so $\langle k\rangle$ is the scale. For a power
law the second moment can diverge, so a random node's degree can be wildly far from
$\langle k\rangle$ — no intrinsic scale.*

![Standard Deviation is Large in Real Networks](https://networksciencebook.com/images/ch-04/figure-4-8.jpg)
*Image 4.8 — $\sigma$ vs $\langle k\rangle$ for the reference networks. All sit
above the random-network line $\sigma=\langle k\rangle^{1/2}$ (green dashed) — real
networks have far bigger degree spread. The lone exception is the (non-scale-free)
power grid.*

---

## 4.5 Universality — everywhere, but not everything

- **WWW ≠ Internet** (often confused): WWW is an *information* network (documents +
  URLs; linking Boston→Budapest is free); the **Internet** is *physical
  infrastructure* (routers + cables; a transatlantic link is hugely expensive).
  Both are scale-free anyway.
- Scale-free structure appears across unrelated domains: infrastructure (Internet),
  biology (protein interactions, 4 billion years old), communication (email),
  science (citations). Shared structure across such diversity → **universal**.
- **How to tell if scale-free?** Quick check: are smallest and largest degrees
  separated by orders of magnitude? If yes, likely scale-free. But since $\gamma$
  drives everything, use proper tools to plot $p_k$ and fit $\gamma$ (4.B, 4.C) —
  never eyeball a log-log slope.

![The topology of the Internet](https://networksciencebook.com/images/ch-04/figure-4-9.jpg)
*Image 4.9 — the iconic CAIDA Internet map: a few high-degree routers hold together
a mass of low-degree ones. A real rendering (not a plottable curve).*

![Many Real Networks are Scale-free](https://networksciencebook.com/images/ch-04/figure-4-10.jpg)
*Image 4.10 — degree distributions of the Internet, protein interactions, email,
and citations. Each deviates from Poisson (green dotted) and is better fit by a
power law.*

> **Box 4.3 — NOT all networks are scale-free.** For hubs to form, nodes must be
> *able* to acquire arbitrarily many links. Where that's capped, no scale-free
> property: **materials** (a carbon atom bonds to ≤4 others — chemistry caps
> degree), the **C. elegans** neural net, the **power grid** (fits an exponential).
> Links needn't be simultaneous (you don't talk to all 1000 acquaintances at once);
> the property fails only when *maximum possible* degree is limited.

---

## 4.6 The ultra-small-world property — hubs shrink distances

Hubs make distances *even smaller* than the random small-world result. Scaling of
average distance vs $\gamma$:
$$ \langle d \rangle \sim \begin{cases}
\text{const.} & \gamma = 2 \\
\ln\ln N & 2 < \gamma < 3 \\
\dfrac{\ln N}{\ln\ln N} & \gamma = 3 \\
\ln N & \gamma > 3
\end{cases} $$

The four regimes:
- **$\gamma=2$ (anomalous):** $k_{max}\sim N$ — the biggest hub connects to a finite
  fraction of *all* nodes → **hub-and-spoke**, everyone one hop from the hub, so
  $\langle d\rangle$ **doesn't grow with $N$**.
- **$2<\gamma<3$ (ultra-small world):** $\langle d\rangle\sim\ln\ln N$ — *far* slower
  than random's $\ln N$. Hubs act as super-shortcuts. Society ($N\approx7\times10^9$):
  random gives $\ln N\approx22.7$, ultra-small gives $\ln\ln N\approx3.1$. **This is
  the regime most real networks — and your thesis — live in.**
- **$\gamma=3$ (critical):** second moment stops diverging; $\ln N$ returns but with a
  $\ln\ln N$ correction still shrinking distances.
- **$\gamma>3$ (small world):** $\langle k^2\rangle$ finite; hubs too small/rare to
  matter; ordinary $\langle d\rangle\sim\ln N$.

**Takeaway:** smaller $\gamma$ (more pronounced hubs) → shorter distances. Most
scale-free nets aren't just "small," they're **ultra-small**.

![Distances in Scale-free Networks](https://networksciencebook.com/images/ch-04/figure-4-12.jpg)
*Image 4.12 — (a) the four $\langle d\rangle$-vs-$N$ scaling curves; (b–d) distance
distributions at $N=10^2,10^4,10^6$ for various $\gamma$. Key lesson: at small $N$
the regimes overlap; at large $N$ they separate dramatically.*

> **Box 4.4 — "we're always close to hubs."** Karinthy (1929) noticed it's easier to
> reach a famous person than an obscure one — hubs are near everyone, and most
> shortest paths *run through* hubs. (Oddly, in online six-degrees experiments people
> *avoid* messaging hubs — they assume hubs are too busy.)

---

## 4.7 The role of the degree exponent γ

Two facts drive this: $\gamma$ varies across systems, and real $\gamma$ is almost
always **> 2** — why never below 2? The regimes (Box 4.5):

- **Anomalous, $\gamma\le2$:** exponent $1/(\gamma-1)>1$ in $k_{max}\sim
  N^{1/(\gamma-1)}$, so the biggest hub grows *faster than the network* — eventually
  needing more links than there are nodes. Also $\langle k\rangle$ diverges. Symptoms
  of a real impossibility: large *simple* scale-free nets with $\gamma<2$ can't exist
  (Box 4.6).
- **Scale-free, $2<\gamma<3$:** first moment finite, second diverges → ultra-small.
  Hub "market share" $k_{max}/N\sim N^{-(\gamma-2)/(\gamma-1)}$ shrinks with size.
  **Holds the interesting physics** — robustness & spreading anomalies (later chapters).
- **Random, $\gamma>3$:** both moments finite; behaves like a random net of same
  size. Hard to distinguish from random. To *see* a power law you need 2–3 decades of
  scaling ($k_{max}/k_{min}\gtrsim10^2$–$10^3$); inverting the $k_{max}$ formula gives
  the needed size:
  $$ N = \left(\frac{k_{max}}{k_{min}}\right)^{\gamma-1} $$
  For $\gamma=5$ over two decades → $N>10^8$, bigger than most maps. So many
  high-$\gamma$ networks may be scale-free but too small to prove it.

> **Box 4.6 — why $\gamma<2$ nets aren't "graphical."** A degree sequence is
> **graphical** if it can be wired into a *simple* graph (no self-loops/multi-links).
> Not all are: an odd total number of stubs always leaves one unmatched. The
> **Erdős–Gallai** theorem tests graphicality; for scale-free sequences the fraction
> graphical **drops to zero for $\gamma<2$** — matching the $k_{max}\sim N$ problem
> (the biggest hub runs out of distinct nodes once its degree exceeds $N-1$).

---

## 4.8 Generating networks with an arbitrary degree distribution

Erdős–Rényi only makes Poisson nets. To *study* scale-free networks — and to test
whether a property comes from $p_k$ alone or something extra — you must *generate*
nets with a prescribed $p_k$. Three standard thesis tools.

### (1) Configuration model

Build a network with an exact **degree sequence**:
1. Give each node the right number of **stubs** (half-links) — from a target $p_k$ or
   copied from a real net. Total stubs must be **even**.
2. Randomly pick two stubs, connect; repeat until all paired.

- Different pairings → different nets with the *same* $p_k$ ("random net with fixed
  degree sequence").
- Link probability between $i$ and $j$:
  $$ p_{ij} = \frac{k_i k_j}{2L-1} $$
  ($i$'s stub can hit any of $2L-1$ others; $k_j$ belong to $j$; $i$ has $k_i$ tries).
  This clean formula is *why* it's the analytics favorite.
- **Allows self-loops and multi-links.** You could reject them but risk getting stuck
  and breaking $p_{ij}$; their fraction → 0 as $N\to\infty$, so usually tolerate them.

![The Configuration Model](https://networksciencebook.com/images/ch-04/figure-4-15.jpg)
*Image 4.15 — assign stubs from the degree sequence, then randomly pair them.
Different orders give cycles (b), self-loops (c), or multi-links (d).*

> **Box 4.7 — generating a power-law degree sequence.** Given $p_k\sim k^{-\gamma}$,
> form cumulative $D(k)=\sum_{k'\ge k}p_{k'}$ (runs 1→0). Draw $N$ uniform randoms
> $r_i\in(0,1)$; read off $k_i=D^{-1}(r_i)$. Result follows $p_k$ (inverse-transform
> sampling; not unique).

### (2) Degree-preserving randomization

Randomize *wiring* while keeping **every node's degree identical**. Use it to ask
"is this property explained by $p_k$ alone?"
- **Method:** pick links $(S_1\!-\!T_1)$, $(S_2\!-\!T_2)$; swap to $(S_1\!-\!T_2)$,
  $(S_2\!-\!T_1)$. All four degrees unchanged. Repeat until every link rewired.
- **Contrast — full randomization** rewires *without* preserving degrees → destroys
  hubs → turns any net into Erdős–Rényi/Poisson.
- Figure's bottom line: from a scale-free net, **full** randomization erases hubs
  (→ random); **degree-preserving** keeps them (→ still scale-free).

![Degree Preserving Randomization](https://networksciencebook.com/images/ch-04/figure-4-17.jpg)
*Image 4.17 — full randomization (rewire one endpoint, degrees change) vs
degree-preserving (swap two links, degrees fixed). Bottom: full → hubs gone;
degree-preserving → hubs stay.*

### (3) Hidden-parameter model

Avoids the configuration model's self-loops/multi-links.
- Give each node a hidden parameter $\eta_i$ from $\rho(\eta)$; connect $i,j$ with
  probability $p(\eta_i,\eta_j)=\dfrac{\eta_i\eta_j}{\langle\eta\rangle N}$.
- Degree distribution: $p_k = \int e^{-\eta}\frac{\eta^k}{k!}\rho(\eta)\,d\eta$ (each
  node's degree is Poisson around its own $\eta$).
- **To make it scale-free:** use deterministic $\eta_i = c\,i^{-\alpha}$. Then for
  large $k$,
  $$ p_k \sim k^{-(1+1/\alpha)}, \qquad \gamma = 1 + \tfrac{1}{\alpha}. $$
  Tune $\alpha$ for $\gamma$, and $\langle\eta\rangle$ for $\langle k\rangle$ (since
  $\langle k\rangle=\langle\eta\rangle$). This independent tunability beats the
  configuration model.

![Hidden Parameter Model](https://networksciencebook.com/images/ch-04/figure-4-18.jpg)
*Image 4.18 — assign each node a hidden parameter, connect pairs with probability
∝ $\eta_i\eta_j$. Same $\eta$-sequence → different realizations (b, c).*

### Choosing between them

![Choosing a Generative Algorithm](https://networksciencebook.com/images/ch-04/figure-4-20.jpg)
*Image 4.20 — the decision tree.*
- Start from a **real net / known degree sequence**, want a *simple* graph →
  **degree-preserving randomization**.
- Start from a **known $p_k$**, tolerate self/multi-links → **configuration model**.
- Want a scale-free net with **independently tunable $\langle k\rangle$** →
  **hidden-parameter model** with $\eta_i=c\,i^{-\alpha}$.

**Limitations (state in a thesis):** none explain *why* a real net has its $p_k$
(that's Ch. 5–6, growth models). And randomization destroys higher-order structure —
clustering (Ch. 9) and degree correlations (Ch. 7) are lost.

> **Box 4.8 — the right way to test small-worldness.** Comparing a real net's
> $\langle d\rangle$ to the *random* small-world formula (3.19) is wrong — that
> assumes Poisson degrees. Proper test: compare to a **degree-preserving randomized**
> version of itself. On the protein net: original $\langle d\rangle=5.61$; **full**
> randomization $7.13$ (bigger — because it removed the hubs, misleading);
> **degree-preserving** $5.08$ (comparable — the honest reference). A plain random net
> *overestimates* distances because it lacks hubs. Great methodological point.

---

## 4.9 Summary — two classes of networks

Rather than obsessing over a *perfect* power-law fit (rare in real data), classify
by the behavior of $\langle k^2\rangle$:

- **Exponentially bounded (thin-tailed):** $p_k$ decays exponentially or faster.
  $\langle k^2\rangle$ comparable to $\langle k\rangle$ → little variation, no
  outliers. Poisson, Gaussian, exponential. Models: ER, Watts–Strogatz. Real: power
  grid, highways. **Random net is a fine model.**
- **Fat-tailed:** power-law tail. $\langle k^2\rangle\gg\langle k\rangle$ → big
  variation, hubs expected. Real: WWW, Internet, protein interactions, most
  social/online nets. **Scale-free net is the right model.**

**Operational signal is $\langle k^2\rangle$:** large → behaves scale-free; small
(≈ $\langle k\rangle(\langle k\rangle+1)$) → behaves random. Cleaner than fighting
over the exact fitted $\gamma$.

The chapter's open question — *why are so many real networks scale-free?* — is
answered by the Barabási–Albert model in Chapter 5.

> **Box 4.9 "At a Glance"** collects the must-knows: discrete/continuum $p_k$,
> $k_{max}=k_{min}N^{1/(\gamma-1)}$, moment behavior for $2<\gamma\le3$ vs $\gamma>3$,
> and the four-regime distance scaling.

---

## Advanced Topic 4.A — Power laws & the distribution zoo

Genuinely useful for a thesis, because real degree data is often *not* a pure power
law and you'll need to name what it is.

**Thin-tailed / exponentially bounded:** decay $\sim e^{-x}$ or faster. Largest value
after $N$ draws grows like $\log N$ or slower → outliers effectively forbidden.
Members: exponential, Poisson (and binomial), Gaussian.

**Fat-tailed:** decay slower than exponential. Largest value after $N$ draws grows as
a power of $N$ → outliers appear often and can *dominate* the system. Power law is the
archetype (degrees, link weights, betweenness all follow power laws; models predict
them).

**Crossover distributions** (data between power law and exponential):
- **Power law with exponential cutoff:** $p(x)=Cx^{-\gamma}e^{-\lambda x}$. Logs:
  $\ln p = \ln C - \gamma\ln x - \lambda x$. For $x\ll1/\lambda$ the $-\gamma\ln x$
  term dominates (power law); for $x\gg1/\lambda$ the $-\lambda x$ dominates
  (exponential cutoff). **The most common realistic form for real degree data** — a
  power-law body with a fast top-end drop.
- **Stretched exponential (Weibull):** $p(x)\propto x^{\beta-1}e^{-(\lambda x)^\beta}$.
  $\beta=1$ → plain exponential; $0<\beta<1$ → "stretched," spans decades and can
  masquerade as a power law; $\beta>1$ → "compressed."
- **Log-normal:** $\ln x$ is normal; arises when a quantity is a *product* of many
  positive factors. For a range of $\sigma$ it mimics a power law over several
  decades — which is why "power law vs log-normal?" never fully settles with data
  alone.

**Honest thesis position:** with finite data you often *cannot* separate power law,
stretched exponential, and log-normal. Only a **mechanistic model** that *predicts*
the form settles it — which Ch. 5–6 provide.

![Distributions Visualized](https://networksciencebook.com/images/ch-04/figure-4-21.jpg)
*Image 4.21 — each distribution in Table 4.2 shown linear and log-log. A handy
reference for recognizing shapes.*

---

## Advanced Topic 4.B — How to PLOT a power law (you will need this)

Getting the plot right is half the battle; a wrong plot fabricates or hides the
scaling.

1. **Always log-log.** Linear axes crush small-$k$ nodes into the left edge and make
   the tail look like zero. On log-log a power law is a straight line.

2. **Never linear-bin the tail.** Raw $p_k=N_k/N$ (bin width 1) produces a spurious
   **plateau** at large $k$: up there you usually have $N_k=0$ (not shown, since
   $\log0=-\infty$) or $N_k=1$, giving $p_k=1/N$ for *every* hub — a flat noise line.
   Worse, this corrupts the fitted $\gamma$, because the high-$k$ region (which most
   determines $\gamma$) is now garbage. Bigger bins don't help.

3. **Use logarithmic binning.** Let bin widths grow with $k$ so each holds a
   comparable count (widths $1,2,4,8,\dots$; bin $n$ covers $2^{n-1}$ to $2^n-1$).
   Then $p_{\langle k_n\rangle}=N_n/b_n$ (count ÷ width) at the bin's average degree.
   Restores clean scaling *into* the tail.

4. **Or use the cumulative** $\bar p_k=\sum_{q>k}p_q$, which also kills the plateau.
   If $p_k\sim k^{-\gamma}$ then $\bar p_k\sim k^{-\gamma+1}$ (exponent shifts by 1) —
   extended clean scaling, better $\gamma$ estimate.

![Plotting a Degree Distribution](https://networksciencebook.com/images/ch-04/figure-4-22.jpg)
*Image 4.22 — the SAME data plotted four ways: (a) linear-linear (useless); (b)
log-log linear-binned (plateau); (c) log-log log-binned (clean); (d) log-log
cumulative (clean). The best single illustration of why binning matters — I'll
rebuild this as a live 4-way toggle for the slides.*

> **Box 4.10 — real $p_k$ isn't a pure power law.** Two common deviations: **low-degree
> saturation** (flattening below $k_{sat}$ — fewer tiny nodes; explained in Ch. 6) and
> **high-degree cutoff** (fast drop above $k_{cut}$ — fewer giant hubs, e.g. people
> can't maintain unlimited ties). A fit capturing both:
> $$ p_k = a\,(k+k_{sat})^{-\gamma}\,e^{-k/k_{cut}} $$
> and you can rescale $\tilde p_k = p_k e^{k/k_{cut}}$ vs $(k+k_{sat})$ to straighten
> it. **Key point for the thesis:** these cutoffs do **not** mean "not scale-free."
> Almost all scale-free properties are insensitive to low-degree saturation; only the
> *high-degree cutoff* matters, because it caps the divergence of $\langle k^2\rangle$.

---

## Advanced Topic 4.C — How to FIT the degree exponent γ (the real methodology)

Eyeballing a log-log slope is **biased and wrong**. The proper procedure
(Clauset–Shalizi–Newman) — exactly the methods section a thesis needs.

**Step 1 — ML estimate of γ given a lower cutoff $K_{min}$** (scaling rarely holds
over the whole range; assume it holds for $k\ge K_{min}$):
$$ \gamma = 1 + N\left[\sum_{i=1}^{N}\ln\frac{k_i}{K_{min}-\tfrac12}\right]^{-1} $$

**Step 2 — assume the fitted form** $p_k = k^{-\gamma}/\zeta(\gamma,K_{min})$ (Hurwitz
zeta), CDF $P_k = 1-\zeta(\gamma,k)/\zeta(\gamma,K_{min})$.

**Step 3 — Kolmogorov–Smirnov distance** (max gap between data CDF $S(k)$ and model):
$$ D = \max_{k\ge K_{min}} |S(k)-P_k| $$

**Step 4 — scan $K_{min}$**, pick the one **minimizing $D$**. Gives optimal
$(\gamma,K_{min})$ and a standard error $\sigma_\gamma$. Worked example (APS citation
net): $K_{min}=49$, $\gamma=2.79(3)$.

**Step 5 — goodness-of-fit (the part people skip).** A best fit isn't necessarily a
*good* fit:
- Compute $D_{real}$ for the best fit.
- Generate many ($M\gg1$) synthetic sequences *from the fitted model*, compute
  $D_{synthetic}$ each → distribution $p(D_{synthetic})$.
- **p-value** = fraction of synthetic $D$'s exceeding $D_{real}$:
  $$ p = \int_{D_{real}}^{\infty} p(D_{synthetic})\,dD_{synthetic} $$
  $p$ near 1 → deviation consistent with noise → power law plausible. $p$ small →
  reject. Convention: accept if $p>0.01$.

**Cautionary result:** for the citation net the *pure* power law gives $p<10^{-4}$ →
**rejected**, despite citations being "famously" power-law. Why? Forcing $K_{min}=49$
discards 96% of data and ignores low-/high-$k$ structure. Refitting with the
**saturation+cutoff** form $p_k\propto(k+k_{sat})^{-\gamma}e^{-k/k_{cut}}$ over the
whole range gives $k_{sat}=12$, $k_{cut}=5691$, $\gamma=3.03$, and $p=0.69$ →
excellent. **Fit the right functional form.**

![Maximum Likelihood Estimation](https://networksciencebook.com/images/ch-04/figure-4-24.jpg)
*Image 4.24 — (a) citation-net $p_k$ with the pure-power-law fit; (b) KS distance $D$
vs $K_{min}$ (minimum at 49); (c) $p(D_{synthetic})$ with $D_{real}$ marked (grey) —
$D_{real}$ sits outside, so the pure power law is rejected.*

![Estimating Scaling Parameters for Citation Networks](https://networksciencebook.com/images/ch-04/figure-4-25.jpg)
*Image 4.25 — refit with saturation+cutoff: (a) $D$ vs $k_{sat}$ (min at 12), inset
$D$ vs $k_{cut}$ (min at 5691); (b) the fit now captures the whole curve, not just
the tail; (c) $D_{real}$ now sits inside $p(D_{synthetic})$ → $p=0.69$, accepted.*

**Systematic pitfalls (for a defense):**
- A pure power law is an idealization; real $p_k$ is shaped by many processes (Ch. 6).
  A failed fit usually means "wrong functional form," not "not scale-free."
- KS is sensitive to a *single* outlier. The **actor network** has a spurious spike at
  $k=1287$ from one 1956 movie (*Around the World in 80 Days*) that listed all 1,288
  usually-uncredited extras; that one point breaks the KS test though the distribution
  is clearly power-law otherwise.
- The method often forces discarding huge data fractions (up to ~99%) to reach
  significance, sometimes yielding a "significant" fit that looks absurd next to the
  full data.

**Honest closing:** estimating $\gamma$ is *not yet an exact science*. The real
improvement is *deriving* the expected $p_k$ from a mechanistic model (Ch. 6), so you
fit the correct form rather than blindly fitting a power law.

---

