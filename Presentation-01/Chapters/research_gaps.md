# Research Landscape & Gaps: Scale-Free Network Generation for Specific Graph Classes
### Literature review map for thesis topic selection

---

## 0. How to read this document

The single most important thing I found is this: **your niche is not one field, it is four separate research communities that barely cite each other.** Most of the "is my idea novel?" confusion in this area comes from not realizing that. Section 1 maps them. Sections 2–5 cover what exists. Section 6 is the ranked list of gaps you could actually work on. Section 7 is a warning about your currently-stated topic (planar) that you should read before committing.

---

## 1. The field map — four communities working on overlapping problems

| # | Community | What they optimize for | Typical venue | Cites the others? |
|---|---|---|---|---|
| **A** | **Graph-theoretic class-constrained generation** (your basis paper's lineage — BUET Graph Drawing Lab) | Guaranteed class membership + prescribed power law + linear-time algorithm + formal proof | ICCA, ICS, graph-drawing/algorithms venues | Cites B rarely, C almost never |
| **B** | **Degree-sequence realizability theory** (Bar-Noy, Böhnlein, Peleg, Ran, Rawitz; and classical: Erdős–Gallai, Hakimi) | Exact characterization of *which* sequences are realizable in a class | MFCS, IWOCA, JCSS, Discrete Math | Doesn't engage with power laws at all |
| **C** | **Statistical-physics scale-free network models** (Barabási lineage, Comellas, Zhang, Miralles) | Reproducing real-world network statistics via growth mechanisms | Phys. Rev. E, Physica A, EPL | Doesn't care about formal class guarantees |
| **D** | **Scalable/parallel network generation engineering** (Yoo & Henderson, Alam & Perumalla, Meyer & Penschuck, Hadian & Nobari) | Raw throughput — billions of vertices, GPU/parallel | SIGMOD, ALENEX, SC | Ignores class constraints entirely |

**Why this matters enormously for you:** your basis paper lives in community **A**. Its literature review cites community **C** and **D** heavily (Barabási, Yoo, Alam, Hadian etc.) but **barely touches community B** — and community B is where the actual mathematical machinery for your problem lives. A thesis that bridges **A** and **B** is, on its own, a genuine contribution. That bridge is currently wide open.

---

## 2. Community A: the class-constrained generation line (your direct lineage)

This is a *small* and *very recent* body of work. Essentially it is a handful of papers, mostly from one lab:

| Year | Paper | Class(es) covered | Key result |
|---|---|---|---|
| 2022 | Rafid, Ibrat & Rahman, **"Generating Scale-Free Outerplanar Networks"** (ICS 2022, Springer CCIS 1723) | Outerplanar / maximal outerplanar | <cite index="24-1">An O(n) time algorithm for generating scale-free outerplanar networks, plus a negative result: the degree distribution of a maximal outerplanar graph cannot strictly fit a power-law distribution for a scale-free network</cite> |
| 2024 | Kamal, Das & Rahman, **"Generating Scale-Free Caterpillar and Series-Parallel Networks"** (ICCA 2024) — *your basis paper* | Caterpillar, Series-parallel | γ ≈ 2.47 forced for caterpillars; O(n) and O(m) algorithms; SP result not guaranteed simple |

**That is close to the entirety of the "guaranteed class membership + power law + proof" literature.** Two papers, three-and-a-bit classes. The framing in your basis paper is explicit that this is a gap area — <cite index="16-1">they note that while numerous models exist for generating scale-free networks with various properties, only a few focus on generating networks with specific graph class properties, and pose as an open question whether other classes of graphs exhibit scale-free properties and whether generative algorithms exist for producing scale-free networks with desired graph class properties</cite>.

**Read that sentence carefully — it is the authors of your basis paper explicitly inviting the exact thesis you're planning.** That's good news for framing, and it means "no one has done class X yet" is a defensible novelty claim for many choices of X.

### 2.1 The pattern of results so far (important for predicting your own outcome)

Notice something across these papers — **each one produces either a forced γ value or an impossibility result**:

- Outerplanar (maximal): power law **cannot** strictly fit → negative/impossibility result.
- Caterpillar: γ is **forced to a single value** ≈ 2.47 → very rigid.
- Series-parallel: γ free in (2,3), but **simplicity cannot be guaranteed** → limitation result.

**Prediction for your thesis:** whatever class you pick, expect the answer to be "γ is forced," "power law can't fit exactly," or "the graph can't be simple/connected." These are *publishable results*, not failures. Plan your thesis narrative so that a negative or restrictive result still counts as a contribution — because based on this track record, that is the likely outcome. This is genuinely important to internalize early so you don't panic in month four.

---

## 3. Community B: degree-sequence realizability (the missing mathematical toolkit)

This is the literature your basis paper under-uses, and it is where your rigor can come from. Core vocabulary:

A sequence $d=(d_1,\dots,d_n)$ of positive integers is called:
- **graphic** — if it's the degree sequence of *some* simple graph
- **forestic** — if realizable by a cycle-free graph
- **planaric** — if realizable by a simple planar graph
- **outer-planaric** — if realizable by an outerplanar graph

Key state of the art, from the MFCS 2024 invited survey by Bar-Noy, Böhnlein, Peleg, Ran & Rawitz:

- <cite index="31-1">The two extreme classes — graphic and forestic sequences — have full characterizations, with forestic having a particularly simple criterion: $d$ is forestic if and only if its volume $\sum d \le 2n-2$. In contrast, the problems of fully characterizing planaric and outer-planaric degree sequences remain open.</cite>

- The "volume" $\sum d = 2m$ is the master parameter. <cite index="30-1">For planar graphs, an immediate consequence of Euler's theorem is that an $n$-element sequence with $\sum d > 4n-6$ cannot be planaric.</cite>

- <cite index="32-1">A graphic sequence is guaranteed planaric when $\sum d \le 4n-4-2\omega_1$, where $\omega_1$ is the number of 1's in the sequence; conversely there exist graphic sequences with $\sum d = 4n-2\omega_1$ that are not planaric.</cite>

- <cite index="31-1">For outer-planaric: for a graphic sequence $d$, if $\omega_1 = 0$ then $d$ is outer-planaric when $\sum d \le 3n-3$; if $\omega_1 > 0$ then it is outer-planaric when $\sum d \le 3n-\omega_1-2$.</cite>

**Classes with known degree-sequence characterizations** (these are your "raw material" — a known characterization makes the scale-free version far more tractable):

| Class | Characterization reference |
|---|---|
| General graphs | Erdős–Gallai (1960), Hakimi (1962) |
| Forests / trees | $\sum d \le 2n-2$ (folklore/simple) |
| 2-trees | Bose, Dujmović, Krizanc, Langerman, Morin, Wood & Wuhrer, JGT 58 (2008) |
| $k$-trees | Lotker, Majumdar, Narayanaswamy & Weber, COCOON 2006 |
| Maximal outerplanar | Li & Zuo, Ars Comb. 140 (2018) |
| Cacti | Ramachandra Rao (1981) |
| Bipartite cacti | Degree Realization by Bipartite Cactus Graphs (2025) |
| Halin graphs | Bíyíkoglu, Ars Comb. 75 (2005) |
| Unicyclic | Boesch & Harary, Networks 8 (1978) |
| Planar bipartite biregular | Adams & Nikolayevsky, Discrete Math 342 (2019) |
| **Planar (general)** | **OPEN** |
| **Outerplanar (general)** | **OPEN** |

**This table is the most actionable thing in this document.** A class in the "known characterization" rows is one where you can plausibly complete a full thesis: you take the known characterization, substitute the power-law expected counts $N(k) = nP(k)$ into it (exactly like Lemma 3.1 in your basis paper), solve for feasible γ, and build a constructive algorithm. A class in the "OPEN" rows means you are attempting something that a strong theory group has publicly flagged as unsolved.

---

## 4. Community C: the physics line — and why "planar scale-free" already exists (sort of)

**This is the finding you most need to know about**, because your currently-stated target is planar.

There *is* existing work titled essentially "planar + scale-free":

| Work | What it does |
|---|---|
| **"Planar growth generates scale-free networks"** (arXiv 1602.03774) | A growth process on planar triangulations; <cite index="21-1">reports a degree distribution power-law fit over two orders of magnitude with estimated exponent ≈ 2.77 for a network of 5×10⁵ nodes, and notes that Euler's formula bounds the number of connections introduced with each new node at three</cite> |
| **Maximal planar Sierpinski networks** (Zhang et al., arXiv 0706.3490) | <cite index="23-1">Deterministically growing networks built iteratively from Sierpinski fractals, with analytical expressions derived for degree distribution, strength distribution, clustering coefficient and strength-degree correlation; the resulting networks are shown to be maximal planar graphs</cite> |
| **Planar unclustered scale-free graphs** (Miralles, Comellas, Chen & Zhang, arXiv 0912.4352) | <cite index="27-1">A two-parameter family of graphs that are deterministic, allowing exact analytic expressions for degree distribution, degree correlation, diameter and average distance, aimed at modelling technological and biological networks that are almost planar with low clustering</cite> |

### 4.1 How this differs from what you'd be doing — and why the gap survives

This is the crucial distinction to get right in your thesis's related-work section:

| Dimension | Physics line (C) | Community A line (yours) |
|---|---|---|
| **Input** | A growth rule / iteration count | **A prescribed degree sequence** drawn from a chosen γ |
| **γ** | *Emergent* — you get whatever exponent the rule produces (e.g. 2.77) and can't dial it | **Prescribed** — you choose γ, the algorithm must hit it |
| **Class guarantee** | Often maximal planar / a specific fractal family, by construction | Formal proof of membership in the target class |
| **Coverage of the class** | A narrow deterministic sub-family (Sierpinski-like, self-similar) | Aiming at the general class |
| **Output style** | One highly regular self-similar structure | Random instances across the whole class |

**So the honest novelty statement is:** planar scale-free *growth models* exist, but a **degree-sequence-driven generator with prescribed γ, formal planarity proof, and linear-time complexity** does not. That is a real and defensible gap — but you must cite and distinguish these three works explicitly, or a reviewer/examiner will say "this was done in 2007." **Do not let your thesis's related-work section omit them.**

---

## 5. Community D: scalable generation (mostly a non-competitor, but cite it)

Yoo & Henderson (parallel massive scale-free), Alam & Perumalla (multi-GPU), Hadian & Nobari (ROLL, in-memory BA), Meyer & Penschuck (resource-constrained massive scale-free), Batagelj & Brandes (efficient large random networks), and the survey *Recent Advances in Scalable Network Generation* (arXiv 2003.00736). None impose graph-class constraints. Cite these to establish that scale-free generation at scale is solved *without* class constraints, which sharpens your problem statement.

One genuinely relevant item from this community: **Meinert & Wagner, "An experimental study on generating planar graphs" (2011)** — planar generation exists as an engineering problem, just not tied to power laws. Worth reading if you go planar.

---

## 6. Ranked candidate problems you could work on

I've scored these on **novelty** (is it unclaimed?), **tractability** (can a Master's/undergrad thesis finish it?), and **impact** (would anyone care?).

### Tier 1 — best risk/reward

**6.1 Scale-free cactus networks** ⭐ *my top recommendation*
- **Novelty:** High. No scale-free cactus generator found. Cactus graphs are conspicuously absent from the BUET line despite being a natural next step.
- **Tractability:** High. Degree sequences of cacti were characterized by Rao (1981), and there's fresh 2025 work on bipartite cactus realization — so the mathematical groundwork exists for you to build on rather than invent.
- **Why it fits the template:** A cactus (every edge in at most one cycle) has a clean structural counting identity, much like the caterpillar's leaf-count identity. Deriving a forced γ or a feasible γ-range looks very achievable.
- **Bonus:** cacti are a superclass of trees and a subclass of planar — so it sits neatly between two things already studied, making the "why this class" motivation easy to write.

**6.2 Scale-free Halin networks**
- **Novelty:** High. Nothing found.
- **Tractability:** Good — Bíyíkoglu (2005) studied Halin degree sequences.
- **Structure:** A Halin graph is a planar tree (no degree-2 vertices) plus a cycle through its leaves. That decomposition ("tree part" + "cycle part") maps beautifully onto the skeleton-then-fill-in template from your basis paper. The leaf-cycle forces all leaves to degree 3, which will strongly constrain γ — likely giving you a crisp forced-γ result exactly like the caterpillar case.

**6.3 Scale-free $k$-tree / 2-tree networks**
- **Novelty:** Moderate-high. 2-tree degree sequences are fully characterized (Bose et al. 2008); *random* k-trees have been studied as complex-network models (Gao & Hobson; "The Degree Distribution of Random k-Trees") — so check carefully whether the power-law angle is already covered there.
- **Tractability:** High — the characterization is exact and constructive.
- **Caveat:** because random k-trees are already known to produce power-law-ish degree distributions, your novelty must be the *prescribed-γ, guaranteed-class* framing, not "k-trees can be scale-free."

### Tier 2 — good, with caveats

**6.4 Scale-free planar networks (your current stated topic)** — see Section 7 for a full risk assessment. Highest impact, highest risk.

**6.5 Scale-free bipartite / planar-bipartite networks**
- Adams & Nikolayevsky (2019) did planar bipartite biregular degree sequences; Bar-Noy et al. have work on bipartite realization. Bipartite scale-free networks matter for real applications (author-paper, user-item recommendation graphs), so motivation is easy.
- Risk: "bipartite scale-free" is a crowded phrase in community C — check carefully.

**6.6 Scale-free chordal or interval networks**
- **Novelty:** Appears wide open — I found no scale-free generator for either.
- **Tractability:** Lower. Interval/chordal degree-sequence characterization is less clean than for cacti or Halin.
- **Impact:** High if it works (chordal graphs matter for treewidth/algorithmics), but this is the riskiest tractability-wise in this list.

### Tier 3 — methodological gaps (alternative thesis shapes)

These aren't "pick a new class" — they're "fix something wrong with how the whole line works." Any of these could be a strong thesis *combined* with a modest class result.

**6.7 Fixing the simplicity problem.** Your basis paper proves (Thm 4.2) that its series-parallel generator cannot guarantee a simple graph for any γ ∈ (2,3). Producing a *simple* scale-free series-parallel generator — or proving no such algorithm can exist — is a well-defined, clearly-motivated open problem handed to you directly by the paper you're already reading.

**6.8 Connectivity guarantees.** None of these papers rigorously address whether the output is guaranteed *connected* (the caterpillar one gets it for free; series-parallel is murkier). Connectivity-guaranteeing variants are a real gap.

**6.9 Unifying framework.** Every paper so far re-derives everything from scratch per class. A *general theorem* of the form "for any graph class $\mathcal{C}$ whose degree sequences satisfy volume constraint $\sum d \le \alpha n + \beta$, the feasible γ range is [formula]" would subsume caterpillar, outerplanar, series-parallel, and future classes in one stroke. **This is the highest-impact idea in this document** and it's exactly the A↔B bridge from Section 1. It's ambitious but the pieces genuinely exist — the Bar-Noy volume-bound results are stated in precisely the right form to plug a power law into.

**6.10 Uniform sampling.** Current algorithms produce *a* graph in the class with *a* power-law degree sequence. They do not sample *uniformly* from the space of such graphs — which matters if the generated networks are used as experimental benchmarks (their stated motivation!). Nobody in line A has addressed this. Strong, well-motivated gap.

**6.11 Empirical rigor.** All these papers validate with an eyeballed log-log plot. The statistics community has shown eyeballed log-log fits are unreliable (see §8). Applying proper power-law fitting/goodness-of-fit testing (Clauset–Shalizi–Newman methodology) to validate class-constrained generators is a legitimate methodological contribution — and would make any class result you produce substantially more credible.

---

## 7. Risk assessment on "planar" specifically (read before committing)

You currently have planar as your topic. Honest assessment:

### Arguments for
- Highest impact — planar is *the* headline class, and it's the natural culmination of the outerplanar → series-parallel → planar progression the BUET lab is already walking.
- Your supervisor's lab (Rahman's group) has the outerplanar and SP results in hand, so the institutional knowledge is right there.
- Euler's formula gives you an immediate, clean volume constraint to work with ($\sum d \le 6n-12$ for simple planar, and the $4n-6$ bound cited above for the realizability framing).

### Arguments against (take these seriously)
1. **Full characterization of planaric degree sequences is a known open problem** flagged by a strong theory group (Bar-Noy/Peleg et al.) in an *invited MFCS survey*. If your thesis requires that characterization, you are attempting an open problem in combinatorics. That is not a Master's-scale deliverable.
2. **Prior art exists in community C** (Section 4) with titles that literally say planar + scale-free. You can distinguish yourself, but you must do so carefully and explicitly, and an examiner unfamiliar with the distinction may push back hard.
3. **Planarity is a "loose" constraint.** Caterpillar forces $m=n-1$ exactly, which is what made a single γ pop out. Planar allows any $m$ up to $3n-6$ — so instead of a crisp forced-γ theorem you'll likely get a feasibility *region*, which is a weaker and less quotable result.

### Recommended de-risking strategy
**Do not target general planar. Target a planar subclass with a known degree-sequence characterization, and frame it as progress toward planar.** Concretely:

> "Scale-free cactus networks" or "Scale-free Halin networks" — presented as *a step in the outerplanar → series-parallel → [your class] → planar programme*, with a discussion chapter on what would be needed for full planar.

This gives you: guaranteed-completable thesis, clean novelty, a natural framing that flatters the lab's existing programme, and an honest future-work section. If the core result lands early, you can *then* attempt general planar as a stretch chapter with nothing lost.

**Alternatively**, combine a Tier-1 class with methodological gap 6.9 (the unifying framework) — that's a genuinely strong thesis: one new class result + a general theorem that explains all the previous ones.

---

## 8. A critique of the whole field you should acknowledge

Your thesis will be stronger if it shows awareness of this rather than ignoring it:

- **Broido & Clauset, "Scale-free networks are rare," *Nature Communications* 10:1017 (2019)** — argues that rigorous statistical testing finds genuine power-law degree distributions far less commonly in real networks than the field assumed.
- **Li, Alderson, Doyle & Willinger, "Towards a Theory of Scale-Free Graphs" (Internet Mathematics, 2005)** — argues that graphs with identical power-law degree sequences can have wildly different structures, so degree distribution alone badly under-determines a network. <cite index="53-1">They emphasise that the degree distribution is the single graph feature that has received the most attention, and introduce a "scaling degree sequence" notion applying to any given graph without regard to how it was generated.</cite>
- **"Exactly scale-free scale-free networks"** (arXiv 1309.0961) — <cite index="5-1">makes the point that not all scale-free networks share the same properties, and that algorithms like preferential attachment neither capture the full richness of scale-free networks nor necessarily display properties typical of all of them.</cite>
- <cite index="52-1">There is ongoing debate that degree distributions in many real-world networks are not rigorously power law and that alternative distributions are statistically preferred, which has led some to propose that scale-freeness should be treated as an implicit property determined by generating mechanism rather than by apparent statistics on finite-size networks.</cite>

**How to use this rather than be damaged by it:** it actually *strengthens* your motivation. If degree distribution alone under-determines structure (Li et al.'s point), then generating graphs that are scale-free **and** constrained to a specific structural class is precisely the right response — you're adding back the structural information that a bare degree sequence throws away. Put that argument in your introduction; it turns the field's main critique into your thesis's justification. That's a genuinely strong opening move.

---

## 9. Suggested reading order

**Week 1 — your lineage (must read, in this order):**
1. Rafid, Ibrat & Rahman (2022), *Generating Scale-Free Outerplanar Networks* — ICS 2022, Springer CCIS 1723, doi:10.1007/978-981-19-9582-8_14. **Get this from your supervisor** — it's paywalled and it's your closest predecessor.
2. Kamal, Das & Rahman (2024) — your basis paper (already read).
3. Barabási & Albert (1999), *Emergence of scaling in random networks*, Science 286 — the foundational reference you must cite.

**Week 2 — the toolkit you're missing:**
4. Bar-Noy, Böhnlein, Peleg, Ran & Rawitz, *On Key Parameters Affecting the Realizability of Degree Sequences*, MFCS 2024 (invited) — **open access on Dagstuhl/LIPIcs vol. 306.** Read this closely; it's free and it's the single most useful paper for your method.
5. Bar-Noy et al., *Sparse Graphic Degree Sequences Have Planar Realizations*, MFCS 2024, LIPIcs 306:18 — also free.
6. The degree-sequence characterization for whichever class you pick (see §3 table).

**Week 3 — prior art you must distinguish yourself from:**
7. *Planar growth generates scale-free networks* (arXiv 1602.03774)
8. Miralles, Comellas, Chen & Zhang, *Planar unclustered scale-free graphs* (arXiv 0912.4352)
9. Zhang et al., *Maximal planar scale-free Sierpinski networks* (arXiv 0706.3490)

**Week 4 — critique & context:**
10. Broido & Clauset (2019), *Scale-free networks are rare*
11. Li, Alderson, Doyle & Willinger (2005), *Towards a Theory of Scale-Free Graphs*
12. *Recent Advances in Scalable Network Generation* (arXiv 2003.00736) — survey, for positioning

---

## 10. Search queries and venues for ongoing monitoring

**Queries that actually surface this niche** (most generic "scale-free network generation" searches drown you in community C/D noise):
- `"scale-free" "<class name>" degree sequence algorithm generation`
- `planaric OR "outer-planaric" degree sequence realization`
- `"graph class" "power law" generative algorithm linear time`
- Follow **citations of** Rafid et al. 2022 and Kamal et al. 2024 on Google Scholar — set alerts. Given how small line A is, anyone entering your niche will cite one of these two, so a citation alert is close to complete coverage.
- Follow the **Bar-Noy / Böhnlein / Peleg / Ran / Rawitz** author cluster — they're publishing steadily (MFCS 2024, IWOCA 2024, JCSS 2025, 2025 cactus work).

**Venues to watch:** MFCS, IWOCA, COCOON, ICS, ICCA, WALCOM (relevant — Rahman's community), Discrete Applied Mathematics, Journal of Graph Theory, Theoretical Computer Science.

---

## 11. Bottom line

1. **Your niche (community A) is genuinely tiny — two papers.** Novelty is easy to establish for most class choices. That's unusually good for a thesis.
2. **The biggest untapped asset is the realizability literature (community B).** Bridging it to your line is where both your rigor and your differentiation come from. Almost nobody has done this.
3. **General planar is high-risk** because full characterization of planaric degree sequences is a publicly open problem, *and* physics-community prior art exists under similar titles. Consider a planar subclass instead, framed as progress toward planar.
4. **Cactus and Halin graphs are my top two recommendations** — unclaimed, tractable, with existing degree-sequence characterizations to build on, and a clean structural decomposition that fits the caterpillar/SP template.
5. **Expect a restrictive or negative result** (forced γ, or impossibility). Every paper in this line got one. Plan your thesis narrative accordingly so that's a finding, not a crisis.
6. **Discuss the class choice with your supervisor early** — the outerplanar paper is unpublished-to-you and paywalled, and Rahman's lab will know exactly which classes are already being worked on internally by other students. That conversation could save you months.

---

*Search performed July 2026. Given how fast this niche moves relative to its size, re-run the citation alerts on the two core papers before finalizing your topic.*
