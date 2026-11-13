// node mods/clawd-icons/assign.test.mjs
import assert from "node:assert/strict";
import { assign } from "./assign.js";

const icons = ["a", "b", "c"];

// New Claude terminals get distinct pictures; others get none.
let m = assign({}, ["t1", "t2", "t3", "sh"], ["t1", "t2", "t3"], icons);
assert.deepEqual(Object.keys(m).sort(), ["t1", "t2", "t3"]);
assert.equal(new Set(Object.values(m)).size, 3);

// Never one that is taken, whatever the dice say.
for (const r of [0, 0.5, 0.999]) {
  assert.equal(assign({ t1: "a", t2: "c" }, ["t1", "t2", "t3"], ["t1", "t2", "t3"], icons, () => r).t3, "b");
}

// Nothing new: no change to publish. An agent keeps its picture.
assert.equal(assign(m, ["t1", "t2", "t3", "sh"], ["t1", "t2", "t3"], icons), null);

// A closed terminal frees its picture for the next agent.
m = assign({ t1: "a", t2: "b", t3: "c" }, ["t1", "t3", "t4"], ["t1", "t3", "t4"], icons);
assert.deepEqual(m, { t1: "a", t3: "c", t4: "b" });

// A terminal that stopped running Claude keeps its picture while it lives.
assert.equal(assign({ t1: "a" }, ["t1"], [], icons), null);

// No terminals reported yet (core still connecting): keep everything.
assert.equal(assign({ t1: "a" }, [], [], icons), null);

// A picture that left the list is replaced by one that exists.
m = assign({ t1: "gone", t2: "a" }, ["t1", "t2"], ["t1", "t2"], icons);
assert.equal(m.t2, "a");
assert.ok(["b", "c"].includes(m.t1));

// More agents than pictures: share instead of failing.
m = assign({}, ["t1", "t2", "t3", "t4"], ["t1", "t2", "t3", "t4"], icons);
assert.equal(Object.keys(m).length, 4);

console.log("ok");
