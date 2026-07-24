# Chapter 0 — A Personal Introduction (Study Guide)

Keeping this one light, as you said — there's no mathematics here. It's Barabási's
first-person account of how network science actually emerged, told honestly as a
sequence of **five failures** punctuated by one thunderbolt discovery in 1999. Its
value for you is narrative, not technical: it's the human story that opens your
presentation, and a few of these beats make excellent talking points. Book figures
embedded inline.

**The chapter's own thesis:** scientific discovery is *not* the straight path
textbooks imply. The field that now has journals, conferences, PhD programs, and
hundreds of millions in funding grew out of rejected papers, dead ends, and a lucky
fifteen-minute walk.

---

## The arc, in order

**1994–95 — the first network paper.** A postdoc at IBM's T. J. Watson Research
Center, Barabási spends the holiday break in the library reading computer science and
notices that the **minimal spanning tree** algorithm (Kruskal) maps onto **invasion
percolation** from statistical physics. He publishes it in *Physical Review Letters* —
his entry point into networks.

![1994-1995: My First Take on Networks](https://networksciencebook.com/images/ch-0/figure-0-1.jpg)
*Image 0.1 — the first paper, bridging a computer-science algorithm and a physics
model.*

**FAIL 1 (1995) — the paper that was never published.** Living in New York and
imagining the tangle of cables under Manhattan, he doubts graph theory's assumption
that such networks are wired *randomly*. His second paper asks how changing a network's
topology changes the dynamics running on it — the observation that **you cannot
interpret a system's behavior without accounting for the network behind it**. It was
rejected by *four* journals and he eventually gave up. His own diagnosis, in
hindsight: not bad science, a **framing problem** — he asked questions physicists
cared about but aimed the paper at neuroscientists.

![1995: Order or Randomness?](https://networksciencebook.com/images/ch-0/figure-0-2.jpg)
*Image 0.2 — the books that shaped the early thinking: Bollobás on random graphs
(theorem-driven mathematics) and Kauffman on biological networks (unbounded
imagination). Two worlds that hadn't met.*

**FAIL 2 (1996) — mapping the Web.** An early attempt to get real data on the WWW's
structure, which didn't work out.

**Reboot (1997–98) — Asimov.** Commuting between Chicago and Notre Dame, he listens to
Asimov's *Foundation* on tape and is gripped by Hari Seldon's ability to forecast the
future of a society. The question that pulls him back to networks: *could you actually
write equations that predict the behavior of something as complex as a society?*

![1997: Reboot](https://networksciencebook.com/images/ch-0/figure-0-5.jpg)
*Image 0.5 — the science fiction that restarted the research program.*

**The recruitment (1998).** He takes his best graduate student, **Réka Albert**, to
lunch and asks her to abandon a successful line of research — she'd just made the cover
of *Nature* — for networks, a subject with "no community, no journal, and no funding,"
and a supervisor whose last paper on it had been rejected four times. She says yes.
(His estimate that they'd wrap up the topology question in six months was, he notes,
"completely off the mark.")

**FAIL 3 (1998) — Watts & Strogatz publish first.** The small-world paper appears in
*Nature*, and reading it makes his own framing failure obvious: the same random-network
paradigm, but Watts and Strogatz rooted their questions in **sociology** and used *six
degrees* as the narrative. He also notes the striking disciplinary gap of that era —
the social-network community (small worlds, weak ties, communities) and the graph
theorists (phase transitions, giant components, the $N \to \infty$ limit) were working
in parallel with **almost no awareness of each other**.

**1998 — the crawler.** Postdoc **Hawoong Jeong** builds a web crawler. The original
question was modest: has the WWW passed its **percolation threshold** — is it one giant
component or still fragmented? To answer it they needed the degree distribution.

**The surprise.** The data showed **not a Poisson distribution but a power law**.
Nothing in the literature described such a network; both the random-graph and
social-network traditions had simply assumed the Poisson form. The power law implied
**hubs** — nodes with enormous numbers of links, outliers that a random universe
forbids, and that no existing model could produce.

Having learned the framing lesson, he hid the real discovery inside a Trojan horse:
the paper was titled *"Diameter of the World Wide Web"* and led with the catchy result
that on the Web, six degrees is really **nineteen**.

![1999: The 19 Degrees Team](https://networksciencebook.com/images/ch-0/figure-0-6.jpg)
*Image 0.6 — Réka Albert, Hawoong Jeong, and the author around the WWW paper.*

**The discovery (June 1999) — the fifteen-minute walk.** While traveling in Portugal,
an email from Réka arrives with an almost throwaway final line: the tail of the degree
distribution follows a power law in *almost all* the systems she'd checked — a computer
chip, the Hollywood actor network, the power grid. If networks as different as the Web
and Hollywood share the same distribution, then the property is **universal**, and the
explanation must be **fundamental and simple**.

He leaves the workshop to think. On the fifteen-minute walk to the seminary, he has
it: **growth** and **preferential attachment**. He faxes Réka the calculations; hours
later her simulations confirm the model works.

![1999: Scale-free Fax](https://networksciencebook.com/images/ch-0/figure-0-7.jpg)
*Image 0.7 — the handwritten fax containing the Barabási–Albert model.*

**FAIL 4 (1999) — funding**, and **FAIL 5 — "comically wrong."** Even after the
discovery, funding agencies weren't interested, and at least one reviewer dismissed the
work in those terms. The field's success was anything but immediate.

---

## What to take from it

Three things worth carrying into the presentation:

1. **Framing matters as much as content.** The same idea, aimed at the wrong audience,
   went unpublished for years; aimed well, it launched a field. (A useful thing to
   remember when writing a thesis.)
2. **The discovery was empirical, not theoretical.** Nobody predicted power-law degree
   distributions — the data forced the idea into existence. Network science is
   fundamentally data-driven, which is exactly the point Chapter 1 makes formally.
3. **Universality was the real thunderbolt.** The Web alone was a curiosity. The Web
   *and* Hollywood *and* a computer chip *and* the power grid, all with the same
   distribution — that's what demanded a general mechanism, and that mechanism (growth
   + preferential attachment) is Chapter 5.

Everything in the rest of the book is the mature, rigorous version of what happened on
that walk in Porto.

---

## Figure index (for the slide stage)

Everything here is a **photograph or document scan** — nothing to simulate. Good
embeds if you want to enrich your opening chapter: 0.1 (first paper), 0.2 (the two
books), 0.5 (Asimov), 0.6 (the team), 0.7 (the fax with the model on it). The fax
(0.7) is the single most evocative image in the book — the actual handwritten birth of
the BA model — and would land well on your title or introduction slide.

Your Chapter 0 slides already carry the timeline and the robustness simulation; these
images and the "five failures → one walk" narrative are optional enrichment if you
want a more human opening.
