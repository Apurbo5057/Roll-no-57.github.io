/* ============================================================
   POST MANIFEST — the one place a post gets registered.

   Read by blog/index.html, by each post page (for title, meta and
   prev/next), and by the homepage's "Writing" section, so adding
   an entry here surfaces the post everywhere at once.

   To publish a new post:
     1. cp -r blog/_template blog/<your-slug>
     2. Write blog/<your-slug>/post.md
     3. Add an entry to the TOP of this array
     4. Commit and push

   Fields:
     slug        folder name under blog/  (also the URL)
     title       shown everywhere
     date        YYYY-MM-DD — sorting key, newest first
     summary     one or two sentences for the cards and list
     tags        first tag shows on the homepage card
     readingTime free text, e.g. "8 min read"
     sim         true ONLY if the folder has a sim.js to load
   ============================================================ */

window.POSTS = [
  {
    slug: 'why-hubs-happen',
    title: 'Why Hubs Happen',
    date: '2026-07-24',
    summary: 'Random graphs say the biggest airport should be impossible. It exists anyway. ' +
             'A look at what breaks when you let a network grow instead of assembling it all at once.',
    tags: ['Network science', 'Simulation'],
    readingTime: '9 min read',
    sim: true
  }
];
