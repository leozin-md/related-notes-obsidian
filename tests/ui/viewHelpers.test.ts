import test from "node:test";
import assert from "node:assert/strict";
import { formatScore, getScoreTone, pathToWikilink } from "../../src/ui/viewHelpers";

test("formatScore rounds similarity scores for compact badges", () => {
  assert.equal(formatScore(0.9234), "92%");
  assert.equal(formatScore(0.005), "1%");
  assert.equal(formatScore(1), "100%");
});

test("getScoreTone classifies high, medium, and low similarity", () => {
  assert.equal(getScoreTone(0.82), "high");
  assert.equal(getScoreTone(0.62), "medium");
  assert.equal(getScoreTone(0.41), "low");
});

test("pathToWikilink creates readable Obsidian links", () => {
  assert.equal(pathToWikilink("Folder/My Note.md", "My Note"), "[[Folder/My Note|My Note]]");
  assert.equal(pathToWikilink("Loose Note.md", "Loose Note"), "[[Loose Note]]");
});
