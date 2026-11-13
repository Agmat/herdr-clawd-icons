// Who has which mascot. No imports, so `node assign.test.mjs` can run it.

/**
 * @param current  { [terminal address]: icon name } as last published
 * @param live     addresses of every terminal that exists now
 * @param claude   addresses of the terminals running Claude now
 * @param icons    every icon name
 * @returns the next map, or null when nothing changes
 */
export function assign(current, live, claude, icons, random = Math.random) {
  // Before herdr-core answers there are no terminals at all: forget nobody then.
  const alive = live.length ? new Set(live) : null;
  const known = new Set(icons); // a picture removed from the list is given up
  const next = {};
  for (const [address, icon] of Object.entries(current ?? {})) {
    if ((!alive || alive.has(address)) && known.has(icon)) next[address] = icon;
  }
  const taken = new Set(Object.values(next));
  for (const address of claude) {
    if (next[address]) continue;
    const free = icons.filter((i) => !taken.has(i));
    const pool = free.length ? free : icons; // more agents than pictures: share
    const icon = pool[Math.floor(random() * pool.length)];
    next[address] = icon;
    taken.add(icon);
  }
  const same =
    Object.keys(next).length === Object.keys(current ?? {}).length &&
    Object.entries(next).every(([a, i]) => current[a] === i);
  return same ? null : next;
}
