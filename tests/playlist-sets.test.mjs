import test from "node:test";
import assert from "node:assert/strict";
import {
  comparePlaylists,
  playlistA,
  playlistB,
  tracks,
} from "../lib/playlist-sets.mjs";

test("the live example has seven combined, two shared, and three A-only tracks", () => {
  assert.equal(comparePlaylists(playlistA, playlistB, "union").length, 7);
  assert.deepEqual(comparePlaylists(playlistA, playlistB, "intersection"), [
    "signal",
    "orbit",
  ]);
  assert.deepEqual(comparePlaylists(playlistA, playlistB, "difference"), [
    "midnight",
    "street",
    "blue",
  ]);
  const ids = new Set(tracks.map((track) => track.id));
  assert.ok([...playlistA, ...playlistB].every((id) => ids.has(id)));
});

test("set queries deduplicate IDs, preserve discovery order, and leave input untouched", () => {
  const a = Object.freeze(["b", "a", "b"]);
  const b = Object.freeze(["c", "b", "c"]);
  assert.deepEqual(comparePlaylists(a, b, "union"), ["b", "a", "c"]);
  assert.deepEqual(comparePlaylists(a, b, "intersection"), ["b"]);
  assert.deepEqual(comparePlaylists(a, b, "difference"), ["a"]);
});

test("empty and disjoint collections behave as sets", () => {
  assert.deepEqual(comparePlaylists([], [], "union"), []);
  assert.deepEqual(comparePlaylists(["a"], [], "intersection"), []);
  assert.deepEqual(comparePlaylists([], ["a"], "difference"), []);
  assert.deepEqual(comparePlaylists(["a"], ["b"], "difference"), ["a"]);
  assert.deepEqual(comparePlaylists(["a"], ["a"], "difference"), []);
  assert.throws(() => comparePlaylists([], [], "typo"), RangeError);
});

test("shared and A-only results partition A across every subset of a small universe", () => {
  const universe = ["a", "b", "c", "d"];
  const subsets = Array.from({ length: 16 }, (_, bits) =>
    universe.filter((_, i) => bits & (1 << i)),
  );
  for (const a of subsets)
    for (const b of subsets) {
      const shared = comparePlaylists(a, b, "intersection");
      const only = comparePlaylists(a, b, "difference");
      const union = comparePlaylists(a, b, "union");
      assert.deepEqual(new Set([...shared, ...only]), new Set(a));
      assert.ok(shared.every((id) => !only.includes(id)));
      assert.equal(union.length, a.length + b.length - shared.length);
      assert.deepEqual(
        new Set(union),
        new Set(comparePlaylists(b, a, "union")),
      );
    }
});
