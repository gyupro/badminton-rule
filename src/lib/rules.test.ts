import { test } from "node:test";
import assert from "node:assert/strict";
import {
  INITIAL_STATE,
  getGamePhase,
  getGameWinner,
  getReceiverId,
  getServerId,
  playRallies,
  playRally,
  type MatchState,
} from "./rules.ts";
import { TUTORIAL_STEPS } from "../data/tutorial-steps.ts";

test("0:0 — a1 serves from the right to b2 (diagonal)", () => {
  assert.equal(getServerId(INITIAL_STATE), "a1");
  assert.equal(getReceiverId(INITIAL_STATE), "b2");
});

test("serving side scores: serving team swaps, same server keeps serving", () => {
  const { state, event } = playRally(INITIAL_STATE, "A");
  assert.equal(event, "point");
  assert.deepEqual(state.sides, { a1: "left", a2: "right", b1: "left", b2: "right" });
  assert.equal(getServerId(state), "a1");
  assert.equal(getReceiverId(state), "b1");
});

test("service over: nobody moves, player on the score-parity side serves", () => {
  const before = playRallies(["A", "A"]);
  const { state, event } = playRally(before, "B");
  assert.equal(event, "service-over");
  assert.deepEqual(state.sides, before.sides);
  assert.equal(state.servingTeam, "B");
  assert.equal(getServerId(state), "b1"); // B has 1 (odd) → B's left court
});

test("tutorial steps match the narrated servers", () => {
  const servers = TUTORIAL_STEPS.filter((s) => s.kind === "play").map((s) => getServerId(s.state));
  assert.deepEqual(servers, ["a1", "a1", "a1", "b1", "b1", "a2", "a2"]);
  const last = TUTORIAL_STEPS.at(-1)!.state;
  assert.equal(`${last.scoreA}:${last.scoreB}`, "4:2");
});

const at = (scoreA: number, scoreB: number): MatchState => ({ ...INITIAL_STATE, scoreA, scoreB });

test("game end: 21 with 2-point lead, deuce, 30 cap", () => {
  assert.equal(getGameWinner(at(21, 19)), "A");
  assert.equal(getGameWinner(at(21, 20)), null);
  assert.equal(getGameWinner(at(22, 20)), "A");
  assert.equal(getGameWinner(at(29, 30)), "B");
  assert.equal(getGamePhase(at(20, 20)), "deuce");
  assert.equal(getGamePhase(at(29, 29)), "golden");
  assert.equal(playRally(at(29, 29), "A").event, "game-over");
});

test("no rallies after the game is over", () => {
  const done = at(21, 10);
  const result = playRally(done, "B");
  assert.equal(result.event, "game-over");
  assert.equal(result.state, done);
});
