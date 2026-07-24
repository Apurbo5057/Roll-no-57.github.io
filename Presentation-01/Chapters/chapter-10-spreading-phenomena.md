# Chapter 10 — Spreading Phenomena (Study Guide)

The final chapter, and the one where the whole book pays off. Diseases, ideas,
computer viruses, and memes all spread over networks — and the *structure* of the
network decides their fate. The headline result ties straight back to your thesis:
on a scale-free network the **epidemic threshold vanishes**, so even a barely
infectious pathogen can spread. This guide keeps the derivations (the compartmental
models, the degree-block approximation, and the vanishing-threshold argument are all
things you'll want to reproduce) and embeds every book figure inline.

**The one-line result:** because $\langle k^2\rangle$ diverges for scale-free
networks with $\gamma < 3$, the epidemic threshold $\lambda_c = \langle
k\rangle/\langle k^2\rangle \to 0$ — the same diverging second moment that made the
network robust (Ch. 8) now makes epidemics almost unstoppable.

---

## 10.1 Introduction — spreading is a network process

Real epidemics don't spread through a well-mixed soup; they spread through the
*contact network*, and a handful of **super-spreaders** (hubs) drive most of the
transmission. The same math describes computer viruses on the Internet, rumors on
social media, and innovations through a population.

![Super-spreaders](https://networksciencebook.com/images/ch-10/figure-10-1.jpg)
*Image 10.1 — a few highly-connected individuals (hubs) are responsible for a
disproportionate share of infections.*

![Pathogens](https://networksciencebook.com/images/ch-10/figure-10-3.jpg)
*Image 10.3 — the diversity of pathogens whose spread this framework describes.*

---

## 10.2 Epidemic modeling — the compartmental models

Classical epidemiology sorts the population into **compartments** by disease state
and writes rate equations for the flow between them, under the **homogeneous mixing
hypothesis** (any infected person can meet any susceptible one, everyone has $\langle
k\rangle$ contacts).

### SI model (susceptible → infected, no recovery)

The infected fraction $i$ grows because each infected person meets $\langle
k\rangle\, s$ susceptibles per unit time and transmits with probability $\beta$:
$$ \frac{di}{dt} = \beta \langle k\rangle\, i(1 - i) $$
Solving (logistic growth):
$$ i(t) = \frac{i_0\, e^{\beta\langle k\rangle t}}{1 - i_0 + i_0 e^{\beta\langle k\rangle t}} $$
Reading it:
- **Early on** $i$ grows *exponentially* (all your contacts are still susceptible).
- The **characteristic time** to reach a $1/e$ (~36%) fraction is
  $$ \tau = \frac{1}{\beta\langle k\rangle} $$
  Denser contacts or higher transmissibility → faster spread.
- **Eventually everyone is infected**: $i(\infty) = 1$. There's no recovery, so the
  disease can't die out.

![The Susceptible-Infected (SI) Model](https://networksciencebook.com/images/ch-10/figure-10-4.jpg)
*Image 10.4 — (a) the two-state SI compartment diagram; (b) the logistic $i(t)$:
exponential early, saturating at 1.*

### SIS model (recovery returns you to susceptible)

Add recovery at rate $\mu$ (colds, flu strains without lasting immunity):
$$ \frac{di}{dt} = \beta\langle k\rangle\, i(1-i) - \mu i $$
Now there are **two outcomes**, decided by whether infection outpaces recovery:
- **Endemic state** ($\mu < \beta\langle k\rangle$): a constant fraction stays
  infected forever. Set $di/dt = 0$:
  $$ i(\infty) = 1 - \frac{\mu}{\beta\langle k\rangle} $$
  Newly infected = newly recovered, so the level holds steady below 1.
- **Disease-free state** ($\mu > \beta\langle k\rangle$): recovery wins, $i$ decays
  *exponentially* to zero — the pathogen disappears.

![The Susceptible-Infected-Susceptible (SIS) Model](https://networksciencebook.com/images/ch-10/figure-10-5.jpg)
*Image 10.5 — (a) SIS adds a recovery arrow back to susceptible; (b) $i(t)$ plateaus
at the endemic level, or dies out if $\mu$ is large.*

### SIR model (recovery grants immunity)

For flu, SARS, measles, plague — recovered people become **immune** ("removed"),
neither infectable nor infectious:
$$ \frac{ds}{dt} = -\beta\langle k\rangle\, s\, i, \quad
\frac{di}{dt} = \beta\langle k\rangle\, s\, i - \mu i, \quad
\frac{dr}{dt} = \mu i $$
Everyone eventually passes S → I → R. The infected fraction **rises then falls** to
zero, leaving a fully-recovered population.

![The Susceptible-Infected-Recovered (SIR) Model](https://networksciencebook.com/images/ch-10/figure-10-6.jpg)
*Image 10.6 — the three SIR compartments and their rate equations.*

**Comparing the three** (Image 10.7): all agree early (exponential growth while $i$
is small), differ at long times — SI → everyone infected; SIS → endemic or die-out;
SIR → everyone recovered. The **basic reproductive number** $R_0$ (the average number
of secondary infections one case causes) predicts the fate: $R_0 > 1$ → outbreak,
$R_0 < 1$ → dies out.

![Comparing the SI, SIS and SIR Models](https://networksciencebook.com/images/ch-10/figure-10-7.jpg)
*Image 10.7 — the three models' $i(t)$ side by side: identical early, divergent late.*

---

## 10.3 Network epidemics — where topology enters

Homogeneous mixing is wrong: an infected person contacts only its network neighbors,
and **high-degree nodes are more likely to be infected** (more contacts = more
exposure). The fix is the **degree-block approximation**: group all nodes of the same
degree into a block and assume they behave identically. Then write a rate equation
*per degree*:
$$ i = \sum_k p_k\, i_k, \qquad \frac{di_k}{dt} = \beta(1 - i_k)\,k\,\Theta_k $$
where $i_k$ = infected fraction *among* degree-$k$ nodes, and $\Theta_k$ = the
**density function** = fraction of a susceptible degree-$k$ node's neighbors that are
infected. This replaces one equation with $k_{max}$ coupled equations — the price of
accounting for topology.

![Degree Block Approximation](https://networksciencebook.com/images/ch-10/figure-10-9.jpg)
*Image 10.9 — nodes are compartmentalized by *both* state (S/I) *and* degree, so each
degree class gets its own rate equation.*

### SI on a network — early-time behavior

Early on ($i_k$ small, drop the quadratic term), for an uncorrelated network
$\Theta_k$ becomes $k$-independent and:
$$ \tau_{SI} = \frac{\langle k\rangle}{\beta(\langle k^2\rangle - \langle k\rangle)} $$
$$ i_k = i_0\left(1 + \frac{k(\langle k\rangle - 1)}{\langle k^2\rangle - \langle k\rangle}\left(e^{t/\tau_{SI}} - 1\right)\right) $$
Two crucial reads:
- $i_k = g(t) + k\,f(t)$: the **higher a node's degree, the more likely it's
  infected**. Hubs get hit first and hardest.
- $\tau_{SI}$ depends on $\langle k^2\rangle$. For a scale-free network $\langle
  k^2\rangle \to \infty$, so **$\tau_{SI} \to 0$**: the pathogen spreads almost
  instantly, because it reaches a hub early and the hub broadcasts it everywhere.

![Fraction of Infected Nodes in the SI Model](https://networksciencebook.com/images/ch-10/figure-10-10.jpg)
*Image 10.10 — infection level by degree class: higher-degree nodes are infected
sooner and in greater proportion.*

### SIS on a network — the vanishing epidemic threshold (THE key result)

With recovery, the characteristic time becomes
$$ \tau_{SIS} = \frac{\langle k\rangle}{\beta\langle k^2\rangle - \mu\langle k\rangle} $$
Define the **spreading rate** — a pure property of the pathogen:
$$ \lambda = \frac{\beta}{\mu} $$
The pathogen persists only if $\lambda$ exceeds an **epidemic threshold** $\lambda_c$.
Requiring $\tau_{SIS} > 0$:

**Random network** (use $\langle k^2\rangle = \langle k\rangle(\langle k\rangle+1)$):
$$ \lambda_c = \frac{1}{\langle k\rangle + 1} > 0 $$
Always finite. Below $\lambda_c$ the pathogen dies out; above it, it reaches an
endemic state. This finite threshold is the entire basis of vaccination campaigns —
push $\lambda$ below $\lambda_c$ and the disease vanishes.

**Scale-free network** (general formula):
$$ \boxed{\lambda_c = \frac{\langle k\rangle}{\langle k^2\rangle}} $$
For $\gamma < 3$, $\langle k^2\rangle \to \infty$, so
$$ \lambda_c \to 0 $$
**Even a barely-infectious pathogen ($\lambda$ tiny but positive) spreads and
persists.** This is the second fundamental prediction of network epidemics, and it
follows directly from the hubs.

**Why the hubs do it:** in a random network all degrees are $\approx \langle
k\rangle$, so below threshold a weak pathogen has nowhere to go and fades. In a
scale-free network, even a weak pathogen that happens to infect a hub gets passed to
the hub's enormous number of contacts — giving it a permanent reservoir. The hubs
keep it alive.

![Epidemic Threshold](https://networksciencebook.com/images/ch-10/figure-10-11.jpg)
*Image 10.11 — $i(\lambda)$ for random (green, finite $\lambda_c$) vs scale-free
(purple, $\lambda_c = 0$). The scale-free curve rises from the origin: any $\lambda >
0$ produces an outbreak.*

![The Asymptotic Behavior of the SIS Model](https://networksciencebook.com/images/ch-10/figure-10-12.jpg)
*Image 10.12 — how $\lambda_c$, $\Theta(\lambda)$, and $i(\lambda)$ depend on $\gamma$.
Only for $\gamma > 4$ does a scale-free network recover the classical finite-threshold
behavior; for $2 < \gamma < 3$ the threshold vanishes.*

**Summary table (the chapter's centerpiece):** the SI/SIS/SIR models on a network
each have a characteristic $\tau$ and threshold $\lambda_c$ set by $\langle k\rangle$
and $\langle k^2\rangle$. For SI, $\lambda_c = 0$ always (no recovery → nothing to
overcome). For SIS/SIR, $\lambda_c = \langle k\rangle/\langle k^2\rangle$, which
vanishes for scale-free $\gamma < 3$.

---

## 10.4 Contact networks — which network carries which disease

Different pathogens ride different networks, and most of them are scale-free — which
is why the vanishing threshold matters in practice:
- **Sexually transmitted diseases** spread on the **sexual contact network**, which
  is scale-free (a few individuals with very many partners act as hubs).
- **Airborne diseases** spread on the **air-transportation network** (hub airports),
  turning local outbreaks into global pandemics in days.
- **Digital viruses** spread on the **email / Internet** networks — also scale-free,
  which is why they linger for years.

![The Sex Web](https://networksciencebook.com/images/ch-10/figure-10-13.jpg)
*Image 10.13 — the scale-free network of sexual contacts, the substrate for STDs.*

![Air Transportation Network](https://networksciencebook.com/images/ch-10/figure-10-15.jpg)
*Image 10.15 — the global air-travel network; hub airports let a pathogen jump
continents.*

![Face-to-face Interactions](https://networksciencebook.com/images/ch-10/figure-10-16.jpg)
*Image 10.16 — high-resolution contact data (RFID badges) used to reconstruct the
real contact network in a hospital or conference.*

---

## 10.5 Beyond the degree distribution — the realistic corrections

The models so far used only $p_k$. Real spreading is shaped by more, and each
correction matters for a thesis that cites the clean result honestly.

**Temporal networks.** Contacts have *timing* and *order*, not just existence. On the
aggregated (static) network, infection flows equally both ways between two nodes; but
if the contacts happened in a specific order, a pathogen starting at A can reach D
while one starting at D cannot reach A. **Ignoring temporality overestimates outbreak
speed and size.**

![Temporal Networks](https://networksciencebook.com/images/ch-10/figure-10-17.jpg)
*Image 10.17 — the *order* of contacts creates directed temporal paths that the
aggregated network hides.*

**Bursty contact patterns.** Real interevent times aren't exponential (Poisson) —
they follow a **power law**: bursts of frequent contact separated by long gaps.
Burstiness *increases* $\tau$, so infections decay *slower* than random-contact
models predict. Concretely: an email virus predicted to decay in $\tau \approx 1$ day
under Poisson timing actually persists $\tau \approx 21$ days, correctly recovered
only with power-law interevent times.

![Bursty Interactions](https://networksciencebook.com/images/ch-10/figure-10-18.jpg)
*Image 10.18 — Poisson (uniform) vs bursty (power-law interevent times) contact
sequences; burstiness slows the decay of an epidemic.*

**Degree correlations (Ch. 7).** Assortativity *lowers* $\lambda_c$, disassortativity
*raises* it — but crucially, **for a scale-free network with diverging $\langle
k^2\rangle$ the threshold still vanishes** whether assortative, neutral, or
disassortative. The core result survives.

**Link weights & communities (Ch. 9).** Strong ties within communities, weak ties
between them (Granovetter). A pathogen spreads fast *inside* a community but the weak
inter-community ties slow its jump between groups — trapping and slowing global
spread.

**Simple vs. complex contagion.** Diseases are **simple contagion**: one contact can
infect you. Many *social* behaviors are **complex contagion**: you need *multiple*
reinforcing exposures before you adopt (quitting smoking, joining a protest). Complex
contagion spreads very differently — hubs matter less, and wide "bridges" between
communities matter more. Important caveat for anyone applying epidemic models to
information spread.

![Simple vs. Complex Contagion](https://networksciencebook.com/images/ch-10/figure-10-20.jpg)
*Image 10.20 — simple contagion (one contact suffices) vs complex contagion (needs
multiple reinforcing sources).*

---

## 10.6 Immunization — fighting the vanishing threshold

**Random immunization.** Vaccinate a random fraction $g$; immunized nodes are
invisible to the pathogen, so the effective spreading rate drops to $\lambda(1-g)$.
The coverage needed to push $\lambda$ below threshold:
$$ g_c = 1 - \frac{\mu}{\beta}\frac{\langle k\rangle}{\langle k^2\rangle} $$
- **Random network:** reduces to $g_c = 1 - \frac{\mu}{\beta}\frac{1}{\langle
  k\rangle + 1}$ — a manageable fraction.
- **Scale-free network:** $\langle k^2\rangle \to \infty$ forces $g_c \to 1$. **You
  must immunize essentially everyone.** This matches reality: measles needs ~95%
  coverage; an email virus needs ~99.7% (the email network has $\langle k^2\rangle
  \approx 1271$) — practically impossible, which is why such viruses persist for
  years. Random immunization is *defeated by the vanishing threshold*.

**Targeted (hub) immunization.** The hubs *create* the large $\langle k^2\rangle$, so
immunize *them*: vaccinate all nodes above some degree $k'_{max}$. This slashes
$\langle k^2\rangle$, which *raises* $\lambda_c$ back to a finite value — and can push
it above the pathogen's $\lambda$, eradicating the disease. Equivalently, removing the
hubs **fragments the contact network** into small islands the pathogen can't cross.

![Immunizing the Hubs](https://networksciencebook.com/images/ch-10/figure-10-22.jpg)
*Image 10.22 — the smaller $k'_{max}$ (the more hubs immunized), the larger $\lambda_c$
grows, until the disease can no longer persist.*

**The attack–immunization duality (ties back to Ch. 8).** This is the same physics as
robustness, viewed from the other side:
- Vanishing epidemic threshold $\Leftrightarrow$ random-failure percolation threshold
  $f_c \to 1$ (you can't fragment a scale-free network by chance).
- Hub immunization $\Leftrightarrow$ targeted attack (removing a few hubs shatters
  it).

Both trace to the diverging $\langle k^2\rangle$. **Targeted immunization and
targeted attack are literally the same operation** — one framed as cure, one as
damage.

![Robustness and Immunizations](https://networksciencebook.com/images/ch-10/figure-10-23.jpg)
*Image 10.23 — immunizing the five biggest hubs fragments the contact network into
isolated islands, trapping the pathogen — identical to attacking the network.*

![Selective Immunization of Scale-free Networks](https://networksciencebook.com/images/ch-10/figure-10-24.jpg)
*Image 10.24 — targeted hub immunization restores a finite threshold where random
immunization fails.*

**The catch:** targeted immunization requires *knowing the hubs* — the full contact
network — which we rarely have (especially for STDs). A clever workaround is the
**"friendship paradox" trick**: immunize *random friends of random people*. Since a
random neighbor is likely to be a hub (Ch. 7's friendship paradox), this preferentially
hits hubs without ever mapping the network.

---

## 10.7 Epidemic prediction — from theory to forecasting

Modern frameworks (like **GLEAM**) combine the air-travel network with local
SIR-type dynamics in each city to *forecast* a pandemic's spread — successfully
reproducing the 2009 **H1N1** timeline.

![Modeling the 2009 H1N1 Pandemic](https://networksciencebook.com/images/ch-10/figure-10-26.jpg)
*Image 10.26 — GLEAM couples a metapopulation of cities (local epidemics) via the
mobility network.*

**Effective distance — the key idea.** Geographic distance is useless for air-borne
pandemics (Manhattan → London is "closer" than Manhattan → a nearby village). Replace
it with an **effective distance** built from travel flows. If $p_{ij}$ = fraction of
travelers leaving $i$ who go to $j$:
$$ d_{ij} = 1 - \ln p_{ij} $$
(the logarithm makes multi-step path probabilities *additive*). Effective distance is
**asymmetric** ($d_{ij} \neq d_{ji}$): a village near a metropolis is close *to* the
metropolis but far *from* it.

In effective-distance space, the messy geographic spread becomes a **clean circular
wave** expanding at constant speed (~250–300 km/day — "the speed of a sports car").
Arrival time factors beautifully:
$$ T_a = \frac{d_{eff}(P)}{V_{eff}(\beta, R_0, \gamma, \varepsilon)} $$
where $d_{eff}$ depends *only* on the mobility network and $V_{eff}$ *only* on the
pathogen. So **relative** arrival times ($T_a(j)/T_a(l)$) depend only on network
topology — which is why different models with different disease parameters converge
on the same predictions.

![Effective Distance](https://networksciencebook.com/images/ch-10/figure-10-31.jpg)
*Image 10.31 — in geographic space (bottom) the spread is a complex blotch; in
effective-distance space (top) it's a clean outward-moving wavefront.*

![Effective Distance and Arrival Time](https://networksciencebook.com/images/ch-10/figure-10-32.jpg)
*Image 10.32 — H1N1 arrival time is uncorrelated with geographic distance but tightly
correlated with effective distance.*

---

## 10.8 Summary — the whole book in one result

Spreading phenomena tie every thread of the book together, and every strand comes
back to the hubs and the diverging $\langle k^2\rangle$:
- Networks are everywhere and scale-free (Ch. 1–4).
- Growth + preferential attachment build the hubs (Ch. 5–6).
- The diverging $\langle k^2\rangle$ makes them robust to failure yet fragile to
  attack (Ch. 8).
- **The same $\langle k^2\rangle$ makes epidemics almost unstoppable — the epidemic
  threshold vanishes — unless we target the hubs.**

For a thesis, the clean takeaways: (1) $\lambda_c = \langle k\rangle/\langle
k^2\rangle$ vanishes for $\gamma < 3$; (2) this is *why* random immunization fails and
*why* targeted (hub) immunization works; (3) it's mathematically the same result as
network robustness under attack; and (4) the clean theory is modified — but not
overturned — by temporality, burstiness, correlations, communities, and complex
contagion.

> **Advanced Topics** carry the rigor: 10.A (microscopic derivation of the epidemic
> equations), 10.B (full analytic solutions of SI/SIS/SIR on networks and the $\tau$,
> $\lambda_c$ derivations), 10.C (targeted immunization math), 10.D (the exact
> SIR ↔ bond-percolation mapping). For a thesis, 10.B is the one to read in full — it
> derives every threshold quoted above.

---

## Figure index (for the slide stage)

- **Meaningful to SIMULATE (live):**
  - **Live epidemic spreading on a network** — SIR from a seed, scale-free vs random
    toggle, watch it rip through hubs. **Centerpiece.**
  - **SI/SIS/SIR curves** — $i(t)$ with $\beta, \mu$ sliders and a model switch.
  - **Vanishing threshold** — $i(\lambda)$ for random (finite $\lambda_c$) vs
    scale-free ($\lambda_c \to 0$).
  - Optionally a **random-vs-targeted immunization** demo (reuse the robustness sim).
- **EMBED book image (non-reproducible renders / real data / schematics):** 10.1
  (super-spreaders), 10.3 (pathogens), 10.4/10.5/10.6 (model diagrams), 10.9 (degree
  block), 10.13 (sex web), 10.15 (air travel), 10.16 (face-to-face), 10.17/10.18
  (temporal/bursty), 10.20 (simple vs complex), 10.22/10.23/10.24 (immunization),
  10.26 (H1N1), 10.31/10.32 (effective distance).

This closes the arc: the diverging $\langle k^2\rangle$ that defined the scale-free
property governs how these networks grow, break, and spread disease.
