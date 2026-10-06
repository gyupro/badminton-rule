// Badminton doubles scoring & positioning rules (BWF Laws 7, 11).
// Pure functions only, so the tutorial, the practice simulator and the tests
// all share one source of truth.

export type Team = "A" | "B";

// Service court from the player's OWN point of view, facing the net.
export type Side = "left" | "right";

export interface Player {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly team: Team;
}

export const PLAYERS: readonly Player[] = [
  { id: "a1", name: "당근", emoji: "🥕", team: "A" },
  { id: "a2", name: "가지", emoji: "🍆", team: "A" },
  { id: "b1", name: "배추", emoji: "🥬", team: "B" },
  { id: "b2", name: "양파", emoji: "🧅", team: "B" },
];

export const TEAM_NAME: Readonly<Record<Team, string>> = { A: "A팀", B: "B팀" };

export const POINTS_TO_WIN = 21;
export const MAX_POINTS = 30;

export interface MatchState {
  readonly scoreA: number;
  readonly scoreB: number;
  readonly servingTeam: Team;
  readonly sides: Readonly<Record<string, Side>>;
}

export type RallyEvent =
  | "point" // serving side won: score + swap, same server keeps serving
  | "service-over" // receiving side won: score + serve changes hands, nobody moves
  | "game-over";

export interface RallyResult {
  readonly state: MatchState;
  readonly event: RallyEvent;
  readonly winner: Team;
}

export const INITIAL_STATE: MatchState = {
  scoreA: 0,
  scoreB: 0,
  servingTeam: "A",
  sides: { a1: "right", a2: "left", b1: "left", b2: "right" },
};

export function getPlayer(id: string): Player {
  const player = PLAYERS.find((p) => p.id === id);
  if (!player) throw new Error(`Unknown player: ${id}`);
  return player;
}

export function other(team: Team): Team {
  return team === "A" ? "B" : "A";
}

export function scoreOf(state: MatchState, team: Team): number {
  return team === "A" ? state.scoreA : state.scoreB;
}

export function sideForScore(score: number): Side {
  return score % 2 === 0 ? "right" : "left";
}

function playerAt(state: MatchState, team: Team, side: Side): string {
  const player = PLAYERS.find((p) => p.team === team && state.sides[p.id] === side);
  if (!player) throw new Error(`No ${team} player on ${side}`);
  return player.id;
}

/** Server = the serving team's player standing in the court matching their score's parity. */
export function getServerId(state: MatchState): string {
  return playerAt(state, state.servingTeam, sideForScore(scoreOf(state, state.servingTeam)));
}

/** Receiver = the diagonally opposite player, i.e. the one on the same (own-perspective) side. */
export function getReceiverId(state: MatchState): string {
  const serveSide = sideForScore(scoreOf(state, state.servingTeam));
  return playerAt(state, other(state.servingTeam), serveSide);
}

export function getGameWinner(state: MatchState): Team | null {
  const { scoreA: a, scoreB: b } = state;
  if (a === MAX_POINTS || (a >= POINTS_TO_WIN && a - b >= 2)) return "A";
  if (b === MAX_POINTS || (b >= POINTS_TO_WIN && b - a >= 2)) return "B";
  return null;
}

/** e.g. 20:20 → "듀스", 29:29 → "골든 포인트" */
export function getGamePhase(state: MatchState): "normal" | "deuce" | "golden" {
  const { scoreA: a, scoreB: b } = state;
  if (a === MAX_POINTS - 1 && b === MAX_POINTS - 1) return "golden";
  if (a >= POINTS_TO_WIN - 1 && b >= POINTS_TO_WIN - 1) return "deuce";
  return "normal";
}

export function playRally(state: MatchState, winner: Team): RallyResult {
  if (getGameWinner(state)) return { state, event: "game-over", winner };

  const scoreA = state.scoreA + (winner === "A" ? 1 : 0);
  const scoreB = state.scoreB + (winner === "B" ? 1 : 0);

  if (winner === state.servingTeam) {
    // Serving side scores: its two players swap service courts.
    const sides: Record<string, Side> = { ...state.sides };
    for (const p of PLAYERS) {
      if (p.team === winner) sides[p.id] = sides[p.id] === "left" ? "right" : "left";
    }
    const next: MatchState = { scoreA, scoreB, servingTeam: winner, sides };
    return { state: next, event: getGameWinner(next) ? "game-over" : "point", winner };
  }

  // Receiving side scores: service passes over, nobody changes court.
  const next: MatchState = { scoreA, scoreB, servingTeam: winner, sides: state.sides };
  return { state: next, event: getGameWinner(next) ? "game-over" : "service-over", winner };
}

/** Plays a sequence of rally winners from a given state. */
export function playRallies(winners: readonly Team[], from: MatchState = INITIAL_STATE): MatchState {
  return winners.reduce((s, w) => playRally(s, w).state, from);
}

/** Human-readable explanation of what just happened, for the simulator. */
export function describeRally(prev: MatchState, result: RallyResult): string {
  const { state, event, winner } = result;
  const score = scoreOf(state, winner);
  const parity = score % 2 === 0 ? "짝수" : "홀수";
  const courtName = sideForScore(score) === "right" ? "오른쪽" : "왼쪽";
  const server = getPlayer(getServerId(state)).name;

  if (event === "game-over") {
    return `${TEAM_NAME[winner]} 승리! ${state.scoreA}:${state.scoreB}로 게임이 끝났어요.`;
  }
  if (event === "point") {
    return `서브팀(${TEAM_NAME[winner]}) 득점 → ${TEAM_NAME[winner]}끼리 자리 교대. ${score}점(${parity})이라 ${server}님이 ${courtName}에서 계속 서브해요.`;
  }
  const prevServer = getPlayer(getServerId(prev)).name;
  return `리시브팀(${TEAM_NAME[winner]}) 득점 → 서비스 오버! 아무도 자리를 안 바꿔요. ${prevServer}님 대신, ${score}점(${parity})에 맞는 ${courtName} 코트의 ${server}님이 서브해요.`;
}
