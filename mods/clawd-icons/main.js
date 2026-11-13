// Clawd Icons: every Claude agent gets its own mascot, picked at random from the
// ones no living terminal has. It draws nothing itself. It publishes
//   shared("clawd-icons") = { [terminal address]: "mods/clawd-icons/icons/<name>.svg" }
// and the mods that list agents (Better Sidebar, Better Tabs) draw that picture
// in place of the program's icon. A terminal keeps its picture until it closes.
import { View, div } from "gpui-kit";
import { terminals, shared, setShared } from "herdr";
import { ICONS } from "./icons.js";
import { assign } from "./assign.js";

const KEY = "clawd-icons";
const PICTURES = ICONS.map((name) => `mods/clawd-icons/icons/${name}.svg`);
// A new agent shows the plain Claude icon until the next look.
const LOOK_EVERY_MS = 1500;

export default class ClawdIcons extends View {
  init(_props, cx) {
    this.look();
    // A timer, not render(): this copy sits in a 0 px block and is never drawn.
    cx.timer.every(LOOK_EVERY_MS, () => this.look());
  }

  look() {
    const all = terminals();
    // ponytail: a machine that goes offline loses its terminals here, so its agents
    // get new pictures when it comes back. Keep them per machine if that matters.
    const next = assign(
      shared(KEY),
      all.map((t) => t.address),
      all.filter((t) => t.program?.key === "claude").map((t) => t.address),
      PICTURES,
    );
    if (next) setShared(KEY, next);
  }

  render() {
    return div();
  }
}
