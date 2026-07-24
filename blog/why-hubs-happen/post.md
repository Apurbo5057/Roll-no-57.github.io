Take every airport in the world and draw a line between two of them whenever a direct
flight connects the pair. Most airports turn out to have a handful of connections. A few
— Atlanta, Heathrow, Dubai — have hundreds. Nobody planned that asymmetry, and no
committee approved it.

The interesting part is that the standard mathematical model of a network says it should
not be there at all. Not "unlikely." Not "rare." *Impossible*, by a margin so wide the
number needs scientific notation to write down.

## The model that says hubs can't exist

The default way to build a random network is due to Erdős and Rényi: take $N$ nodes,
consider every possible pair, and connect each pair independently with probability $p$.
That is the whole recipe.

Because each of a node's $N-1$ possible links is an independent coin flip, its degree $k$
follows a binomial distribution:

$$
p_k = \binom{N-1}{k}\, p^k (1-p)^{N-1-k}
$$

For a large, sparse network — many nodes, few links each — this collapses into the Poisson
form, which depends on nothing but the average degree $\langle k \rangle$:

$$
p_k = e^{-\langle k \rangle}\, \frac{\langle k \rangle^{\,k}}{k!}
$$

That factorial in the denominator is doing something violent. Plotted, the distribution
has a clear peak at the average and then falls off a cliff:

```chart
{
  "type": "line",
  "title": "Poisson degree distribution — a network has a typical node",
  "caption": "Erdős–Rényi degrees cluster tightly around the mean. Shift the average and the whole peak moves; the shape never grows a tail.",
  "height": 300,
  "x": { "label": "degree k" },
  "y": { "label": "p(k)" },
  "data": [
    { "name": "⟨k⟩ = 3", "points": [[0,0.04979],[1,0.14936],[2,0.22404],[3,0.22404],[4,0.16803],[5,0.10082],[6,0.05041],[7,0.0216],[8,0.0081],[9,0.0027],[10,0.00081],[11,0.00022],[12,0.00006],[13,0.00001],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0],[20,0]] },
    { "name": "⟨k⟩ = 10", "points": [[0,0.00005],[1,0.00045],[2,0.00227],[3,0.00757],[4,0.01892],[5,0.03783],[6,0.06306],[7,0.09008],[8,0.1126],[9,0.12511],[10,0.12511],[11,0.11374],[12,0.09478],[13,0.07291],[14,0.05208],[15,0.03472],[16,0.0217],[17,0.01276],[18,0.00709],[19,0.00373],[20,0.00187]] }
  ]
}
```

This is a distribution with a **scale**. It says: there is such a thing as a typical node,
the average describes it, and deviations are small and symmetric. Human height works this
way. Nobody is thirty metres tall.

Now put a number on the airport. Suppose the average airport has $\langle k \rangle = 3$
direct connections. What does Poisson say about one with 5000?

$$
p_{5000} \approx 10^{-13941}
$$

For scale, there are roughly $10^{80}$ atoms in the observable universe. A model whose
prediction is off by thirteen thousand orders of magnitude is not slightly wrong. It is
answering a different question than the one being asked.

## What the data actually looks like

Measure a real network — the web, citations, protein interactions, the power grid — and
the degree distribution does not fall off a cliff. It decays as a power of $k$:

$$
p_k \sim k^{-\gamma}
$$

with the exponent $\gamma$ usually landing between 2 and 3. The difference only becomes
obvious on log–log axes, where a power law is a straight line and a Poisson is a wall:

```chart
{
  "type": "line",
  "title": "Poisson vs. power law, log–log",
  "caption": "Same average degree, radically different tails. At k = 20 the two models already disagree by six orders of magnitude, and the gap keeps widening.",
  "height": 340,
  "x": { "label": "degree k", "scale": "log" },
  "y": { "label": "p(k)", "scale": "log", "domain": [1e-11, 1] },
  "data": [
    { "name": "power law γ=2.5", "points": [[1,0.7455],[2,0.1318],[3,0.04782],[4,0.0233],[5,0.01334],[7,0.00575],[10,0.002357],[15,0.0008554],[20,0.0004167],[30,0.0001512],[50,0.00004217],[100,0.000007455],[200,0.000001318],[500,1.334e-7],[1000,2.357e-8]] },
    { "name": "Poisson ⟨k⟩=3", "points": [[1,0.1494],[2,0.224],[3,0.224],[4,0.168],[5,0.1008],[7,0.0216],[10,0.0008102],[15,5.463e-7],[20,7.135e-11]] }
  ]
}
```

The Poisson curve simply stops — it runs out of probability. The power law keeps going.
Under a power law, that 5000-connection airport has probability around $4 \times 10^{-10}$:
rare, but in a network of a few thousand airports, entirely expected to show up.

This is why these networks are called **scale-free**. There is no typical node, and the
average stops being a useful summary. The mean degree of the web is about 5; nobody thinks
a page with 5 links is representative of anything.

<div class="note">
<span class="note-label">Aside</span>
<p>For $\gamma < 3$ the variance of the distribution diverges as the network grows. That is
the precise sense in which "average degree" stops meaning much — the second moment, which
is what would tell you how far from the mean to expect nodes to sit, has no finite limit.</p>
</div>

## The two things Erdős–Rényi left out

So what does the random model get wrong? Two assumptions, both of them quiet.

**It assumes the network is static.** All $N$ nodes exist from the start, and you decide
the links afterwards. Real networks are not assembled — they *grow*. The web had one page
before it had a billion. Every citation network starts empty.

**It assumes attachment is uniform.** Every pair gets the same probability $p$. But a new
web page does not pick its links by dice roll; it links to pages it has already heard of,
and it has heard of them precisely because other pages link to them.

Barabási and Albert's insight was that fixing both at once is enough. Their model is two
rules:

1. **Growth.** At each step add one new node carrying $m$ links.
2. **Preferential attachment.** The new node picks its targets with probability
   proportional to how many links they already have:

$$
\Pi(k_i) = \frac{k_i}{\sum_j k_j}
$$

That is it. No hub is designated in advance, no node has special properties. The rich get
richer purely because being connected makes you easier to find.

## Why that gives you an exponent of exactly 3

The result falls out with surprisingly little work. Treat degree as continuous. At time
$t$ the network has $t$ nodes and $mt$ links, so $\sum_j k_j = 2mt$. Node $i$ gains degree
at the rate that new nodes choose it:

$$
\frac{\partial k_i}{\partial t} = m \, \Pi(k_i) = m\,\frac{k_i}{2mt} = \frac{k_i}{2t}
$$

Separate and integrate, with node $i$ born at time $t_i$ with degree $m$:

$$
k_i(t) = m \left( \frac{t}{t_i} \right)^{\!1/2}
$$

Two things fall out of that square root. First, **every** node grows — but older nodes
(small $t_i$) grow faster, forever. Age is the whole advantage. Second, working the
distribution of $t_i$ through this expression gives

$$
p_k \sim k^{-3}
$$

An exponent of 3, with no free parameters. Not fitted to anything — just what growth plus
proportional preference produces on its own.

## Watch it happen

Here it is running. Each new node arrives with $m$ links and chooses where to attach in
proportion to existing degree. Nothing is seeded; the hubs below are not planted, they are
whatever the first few nodes happened to be.

<div class="sim" data-sim="ba-growth"></div>

Run it a few times. Two things are worth noticing:

- **Which** nodes become hubs is pure luck — it is decided in the first dozen steps and
  never revisited. Restart and a different set wins.
- **That** hubs appear is not luck at all. The degree histogram takes the same lopsided
  shape every single run.

That gap between the two — arbitrary winners, inevitable winning — is most of what makes
these networks interesting.

## What it costs

Hubs are not free. Because most nodes have small degree, deleting nodes at random almost
always deletes an unimportant one, and the network shrugs: scale-free networks tolerate
random failure remarkably well. But the same structure means a small number of nodes hold
everything together. Remove the hubs deliberately — in descending order of degree — and
the network shatters after only a few percent are gone.

Robust to accident, fragile to attack, and both for exactly the same reason. That trade-off
is worth its own post.

---

*The maths and figures here follow Barabási's [Network Science](https://networksciencebook.com/),
chapters 3–5. I've built [an interactive walkthrough of the whole book](../../Presentation-01/)
if you want the long version.*
