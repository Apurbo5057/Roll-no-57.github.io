import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
from scipy import optimize

np.random.seed(42)

# ============================================================
# BOX 4.7 — Generate a power-law degree SEQUENCE
# (inverse-transform sampling, per the textbook recipe)
# ============================================================
def generate_power_law_sequence(N, gamma, k_min=2, k_max=None):
    """
    p_k ~ k^-gamma for k in [k_min, k_max]
    Uses inverse-transform sampling on the CONTINUOUS approximation,
    matching Box 4.7's D(k) = sum_{k'>=k} p_k'  idea.
    """
    if k_max is None:
        k_max = N  # natural cutoff
    r = np.random.uniform(0, 1, N)
    # Continuous power law inverse CDF:
    # For p(k) ~ k^-gamma normalized on [k_min,k_max],
    # CDF^-1(r) = [ (k_max^(1-g) - k_min^(1-g))*r + k_min^(1-g) ] ^ (1/(1-g))
    g = gamma
    a = k_min**(1-g)
    b = k_max**(1-g)
    ks = (a + (b - a) * r) ** (1/(1-g))
    ks = np.round(ks).astype(int)
    ks = np.clip(ks, k_min, k_max)
    return ks

def make_even(seq):
    """Configuration model needs an EVEN sum of stubs."""
    if sum(seq) % 2 != 0:
        seq = seq.copy()
        seq[np.argmax(seq)] += 1  # bump one stub onto the biggest node
    return seq

# ============================================================
# METHOD 1 — CONFIGURATION MODEL
# ============================================================
N = 5000
gamma_target = 2.5

deg_seq = generate_power_law_sequence(N, gamma_target, k_min=2, k_max=int(N**0.5))
deg_seq = make_even(deg_seq)

G_config = nx.configuration_model(deg_seq, seed=42)  # MultiGraph: allows self-loops/multi-edges
n_selfloops = nx.number_of_selfloops(G_config)
n_multi = sum(1 for u, v, k in G_config.edges(keys=True) if k > 0)  # parallel edges beyond the first

print("=== METHOD 1: CONFIGURATION MODEL ===")
print(f"N = {N}, target gamma = {gamma_target}")
print(f"Target <k> = {np.mean(deg_seq):.3f}")
actual_degrees = [d for n, d in G_config.degree()]
print(f"Realized <k> = {np.mean(actual_degrees):.3f}  (must match target exactly by construction)")
print(f"Self-loops: {n_selfloops}  ({100*n_selfloops/N:.3f}% of nodes)")
print(f"Parallel edges: {n_multi}  ({100*n_multi/G_config.number_of_edges():.3f}% of edges)")

# Convert to SIMPLE graph (strip self-loops & multi-edges) to test planarity
G_simple = nx.Graph(G_config)
G_simple.remove_edges_from(nx.selfloop_edges(G_simple))
is_planar, _ = nx.check_planarity(G_simple)
print(f"Is the (simplified) configuration-model graph planar? {is_planar}")
print()

# ============================================================
# HOW BADLY does the configuration model fail at planarity,
# as N grows? (directly relevant to your thesis motivation)
# ============================================================
print("=== PLANARITY FRACTION vs N (configuration model, gamma=2.5) ===")
for n_test in [20, 50, 100, 200, 500, 1000]:
    trials, planar_count = 30, 0
    for t in range(trials):
        ds = generate_power_law_sequence(n_test, gamma_target, k_min=2, k_max=int(n_test**0.5))
        ds = make_even(ds)
        g = nx.Graph(nx.configuration_model(ds, seed=1000+t))
        g.remove_edges_from(nx.selfloop_edges(g))
        if nx.check_planarity(g)[0]:
            planar_count += 1
    print(f"  N={n_test:5d}:  planar in {planar_count}/{trials} trials  ({100*planar_count/trials:.0f}%)")
print()

# ============================================================
# METHOD 2 — DEGREE-PRESERVING RANDOMIZATION vs FULL RANDOMIZATION
# ============================================================
print("=== METHOD 2: DEGREE-PRESERVING vs FULL RANDOMIZATION ===")
# Start from a clean simple scale-free-like graph (use configuration model, force-simplify)
G_base = nx.Graph(G_config)
G_base.remove_edges_from(nx.selfloop_edges(G_base))
G_base = nx.Graph(G_base)  # drop parallel edges automatically (Graph, not MultiGraph)
G_base.remove_nodes_from(list(nx.isolates(G_base)))
G_base = G_base.subgraph(max(nx.connected_components(G_base), key=len)).copy()
print(f"Base graph (largest component): N={G_base.number_of_nodes()}, L={G_base.number_of_edges()}")

deg_before = [d for n, d in G_base.degree()]
max_deg_before = max(deg_before)
print(f"Max degree BEFORE any randomization: {max_deg_before}")

# --- Degree-preserving randomization (double edge swap) ---
G_degpreserve = G_base.copy()
nx.double_edge_swap(G_degpreserve, nswap=5*G_base.number_of_edges(), max_tries=200000, seed=1)
deg_after_preserve = sorted([d for n, d in G_degpreserve.degree()])
print(f"Max degree AFTER degree-preserving randomization: {max(deg_after_preserve)}")
print(f"Degree sequences identical? {sorted(deg_before) == deg_after_preserve}")

# --- Full randomization (Erdos-Renyi with same N, L -> destroys hubs) ---
G_full_random = nx.gnm_random_graph(G_base.number_of_nodes(), G_base.number_of_edges(), seed=1)
deg_after_full = [d for n, d in G_full_random.degree()]
print(f"Max degree AFTER full randomization (Erdos-Renyi, same N & L): {max(deg_after_full)}")
print()

# Average path length comparison (Box 4.8 style check)
try:
    d_base = nx.average_shortest_path_length(G_base)
    d_preserve = nx.average_shortest_path_length(G_degpreserve)
    Gf_giant = G_full_random.subgraph(max(nx.connected_components(G_full_random), key=len)).copy()
    d_full = nx.average_shortest_path_length(Gf_giant)
    print("=== Box 4.8 STYLE CHECK: average path length ===")
    print(f"  Original scale-free-like graph:      <d> = {d_base:.3f}")
    print(f"  Degree-preserving randomized:         <d> = {d_preserve:.3f}  (should stay close)")
    print(f"  Fully randomized (hubs destroyed):    <d> = {d_full:.3f}  (should be LARGER)")
except Exception as e:
    print("path length calc skipped:", e)
print()

# ============================================================
# METHOD 3 — HIDDEN-PARAMETER MODEL
# eta_i = c * i^-alpha  =>  gamma = 1 + 1/alpha
# ============================================================
print("=== METHOD 3: HIDDEN-PARAMETER MODEL ===")
N3 = 5000
alpha = 0.6          # choose alpha ...
gamma_expected = 1 + 1/alpha   # ... predicts this gamma
mean_k_target = 6.0

i = np.arange(1, N3+1)
eta_raw = i ** (-alpha)
c = mean_k_target / np.mean(eta_raw)   # tune c so <eta> = target <k>  (since <k> = <eta>)
eta = c * eta_raw

print(f"alpha = {alpha}  ->  predicted gamma = 1 + 1/alpha = {gamma_expected:.3f}")
print(f"<eta> = {np.mean(eta):.3f}  (this should equal realized <k>)")

# Build graph: connect i,j with prob eta_i*eta_j / (<eta> * N)
mean_eta = np.mean(eta)
G_hidden = nx.Graph()
G_hidden.add_nodes_from(range(N3))

# Vectorized-ish sampling for speed: for each node, decide links to a random subsample
# (full O(N^2) is 25M pairs -- fine for N=5000, do it in chunks)
rng = np.random.default_rng(7)
denom = mean_eta * N3
batch = 500
for start in range(0, N3, batch):
    end = min(start+batch, N3)
    block = eta[start:end][:, None] * eta[None, :] / denom   # shape (batch, N3)
    block = np.clip(block, 0, 1)
    rand = rng.random(block.shape)
    edges_mask = rand < block
    for bi, gi in enumerate(range(start, end)):
        js = np.where(edges_mask[bi])[0]
        js = js[js > gi]  # avoid double-adding + self-loops
        for j in js:
            G_hidden.add_edge(gi, int(j))

realized_degrees = np.array([d for n, d in G_hidden.degree()])
print(f"Realized <k> = {realized_degrees.mean():.3f}")
print(f"Max degree (biggest hub) = {realized_degrees.max()}")
print(f"Self-loops present? {nx.number_of_selfloops(G_hidden)}  (should be 0 -- model avoids them)")

# Fit gamma using LOG-BINNING (standard practice -- raw linear bins are
# noisy/biased in the tail because high-k bins have very few samples)
degs = realized_degrees[realized_degrees > 0]
bins = np.logspace(np.log10(1), np.log10(degs.max()), 25)
hist, edges = np.histogram(degs, bins=bins, density=True)
centers = np.sqrt(edges[:-1] * edges[1:])
valid = hist > 0
logk = np.log(centers[valid])
logp = np.log(hist[valid])
slope, intercept = np.polyfit(logk, logp, 1)
print(f"Empirical fit (log-binned): gamma_fit = {-slope:.3f}  (target was {gamma_expected:.3f})")

vals, counts = np.unique(degs, return_counts=True)
pk = counts / counts.sum()
mask = valid
print()

# ============================================================
# PLOTS
# ============================================================
fig, axes = plt.subplots(1, 3, figsize=(16, 4.5))

# Plot 1: configuration model degree distribution (log-log)
d1 = np.array([d for n, d in G_config.degree()])
v1, c1 = np.unique(d1[d1>0], return_counts=True)
axes[0].loglog(v1, c1/c1.sum(), 'o', ms=4, color='#7b3ff2', alpha=0.7)
axes[0].set_title(f"Configuration Model\n(target γ={gamma_target})")
axes[0].set_xlabel("degree k"); axes[0].set_ylabel("p_k")

# Plot 2: degree preserved vs full randomization
v2a, c2a = np.unique(np.array(deg_before), return_counts=True)
v2b, c2b = np.unique(np.array(deg_after_full), return_counts=True)
axes[1].loglog(v2a, c2a/c2a.sum(), 'o', ms=4, label='original / degree-preserving', color='#7b3ff2')
axes[1].loglog(v2b, c2b/c2b.sum(), 's', ms=4, label='full randomization', color='#e8590c')
axes[1].set_title("Full randomization erases hubs")
axes[1].set_xlabel("degree k"); axes[1].set_ylabel("p_k"); axes[1].legend(fontsize=8)

# Plot 3: hidden parameter model with fitted line (log-binned)
axes[2].loglog(vals, pk, '.', ms=3, color='#adb5bd', alpha=0.5, label='raw p_k')
axes[2].loglog(centers[valid], hist[valid], 'o', ms=6, color='#0ca678', label='log-binned')
fit_line = np.exp(intercept) * centers[valid]**slope
axes[2].loglog(centers[valid], fit_line, '-', color='black', lw=1.5,
               label=f'fit γ={-slope:.2f}')
axes[2].set_title(f"Hidden-Parameter Model\n(target γ={gamma_expected:.2f})")
axes[2].set_xlabel("degree k"); axes[2].set_ylabel("p_k"); axes[2].legend(fontsize=8)

plt.tight_layout()
plt.savefig('sf_methods_comparison.png', dpi=140)
