# Clawd Icons

Every Claude Code agent shows a pixel-art variant of the Claude mascot (a
crown, a chef's hat, a wizard hat...) in place of the plain Claude icon,
picked from its terminal address. Agents become recognisable at a glance in
the sidebar and the tab bar.

![Clawd Icons](preview.png)

Unofficial fan project, not affiliated with or endorsed by Anthropic. The
Claude mascot is Anthropic's character. The art is adapted from
[clawd-pet](https://github.com/abderrahimghazali/clawd-pet) (MIT, licence in
`clawd-icons/LICENSE-clawd-pet.txt`).

## What you see

- In every patched mod, a Claude agent's icon is one of 39 mascot pictures in
  place of the plain Claude icon, at the size that mod already uses (16 px in
  a sidebar row, 14 px in a tab).
- The 39 variants, all with the body in Claude's orange `#D97757` and black
  eyes, numbered `0.svg` to `38.svg`: none, party-stripe, flames, debugger,
  pushing, party, beanie, cool, pairing, wizard, antenna, headphones,
  overheated, typing, fedora, star-wizard, trophy, oncall, tool-calling,
  santa, firefighter, paper-stack, merging, thinking, pirate, hardhat,
  data-block, meeting, sweeping, chef, helmet, box, juggling, rubber-duck,
  crown, pumpkin, horns, deploying, reviewing.
- Each picture is a static SVG of `<rect>`s on a 1-unit grid,
  `shape-rendering="crispEdges"`, in a square viewBox of 17 to 20 units: the
  mascot is 15 units wide with its feet on the bottom edge, the hat above.

## How it behaves

- A terminal's mascot is `hash(address) % 39`, with
  `hash = h * 31 + charCode` over the address, kept as an unsigned 32-bit int.
- The same address always gives the same mascot: across app restarts, and
  when Claude is quit and started again in that terminal.
- Two agents can share a mascot. Addresses are sequential (`t23`, `t24`), and
  the hash maps consecutive addresses to consecutive numbers, so terminals
  opened one after another usually differ.
- A new agent shows its mascot on the first frame.
- Agent status (working, blocked, done, idle) changes nothing here: the mascot
  is the same in every status, and the mod showing it keeps its own status mark.
- No clicks, keys or hovers. Nothing moves.

## Built from

- `clawd-icons/<n>.svg`, copied to `~/.config/herdr-app/clawd-icons/`. No mod,
  no shared state, no files written.
- In each mod that draws an agent's icon, before it draws `program.icon`
  (`address` is the agent's or the pane's terminal address):

  ```js
  if (program?.key === "claude" && address) {
    const n = [...address].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0) % 39;
    return image(`clawd-icons/${n}.svg`).w(size).h(size).flex_none();
  }
  ```

- Art: clawd-pet's SVGs with their `<style>` (the CSS animation), ground
  shadow, `<use>` particles and floating decorations removed, the body colour
  `#DE886D` replaced by `#D97757`, and the viewBox cropped to the mascot and
  its hat.

## Watch out

- Herdr takes an agent's icon from the program table, so every Claude agent
  resolves to the same "Claude Code" entry, and there is no per-terminal icon.
  The mascots appear only in mods patched with the lines above. Herdr's
  shipped mods (`agents`, `tabs`, `spaces`, `pane`) are restored on every
  start: clone one with `mod.clone` and point the layout at the clone before
  changing it.
- A mod cannot import from outside its own folder (`herdr-app check` rejects
  `../`), so the patch is copied into each mod rather than shared.
- Draw the mascot only when `program.key === "claude"`: a terminal that went
  back to a shell keeps its address.
- The `39` in the patch must match the number of SVGs. Changing it reshuffles
  every agent's mascot.
- Updating a patched mod overwrites the patch; the icons fall back to the
  plain one until it is added again.
- Built on Herdr 0.1.15, macOS, with Better Sidebar 3.3.0 and Better Tabs
  3.0.0 as the patched mods.

## Done when

- `~/.config/herdr-app/clawd-icons/` holds `0.svg` to `38.svg`.
- `herdr-app check` passes for each patched mod and `herdr-app status` lists
  no errors.
- With two or more Claude agents running, each shows a mascot in place of the
  plain Claude icon in every patched mod, the same one in the sidebar and the
  tab bar.
- A terminal running a shell shows its normal icon.
