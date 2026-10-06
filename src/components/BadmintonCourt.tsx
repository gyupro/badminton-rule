"use client";

import {
  PLAYERS,
  TEAM_NAME,
  getPlayer,
  getReceiverId,
  getServerId,
  type MatchState,
  type Side,
  type Team,
} from "@/lib/rules";

// Real doubles court dimensions in metres (BWF Law 1), drawn in landscape:
// Team A on the left half, Team B on the right half, net in the middle.
const LENGTH = 13.4;
const WIDTH = 6.1;
const NET = LENGTH / 2;
const SHORT_SERVICE = 1.98; // from the net
const DOUBLES_LONG_SERVICE = 0.76; // from the back boundary
const SINGLES_INSET = 0.46; // singles sideline inside the doubles sideline

const SVG_WIDTH = 480;
const PAD_X = 16;
const PAD_TOP = 22;
const PAD_BOTTOM = 8;
const SCALE = (SVG_WIDTH - PAD_X * 2) / LENGTH;
const SVG_HEIGHT = Math.round(PAD_TOP + WIDTH * SCALE + PAD_BOTTOM);

const mx = (m: number) => PAD_X + m * SCALE;
const my = (m: number) => PAD_TOP + m * SCALE;

export const TEAM_COLOR: Readonly<Record<Team, string>> = { A: "#f97316", B: "#3b82f6" };

/**
 * Sides are from the player's own perspective facing the net. Team A faces right,
 * so its right-hand court is at the bottom of the screen; Team B faces left, so
 * its right-hand court is at the top.
 */
function isTopHalf(team: Team, side: Side): boolean {
  return team === "A" ? side === "left" : side === "right";
}

function serviceCourt(team: Team, side: Side) {
  const top = isTopHalf(team, side);
  const x0 = team === "A" ? DOUBLES_LONG_SERVICE : NET + SHORT_SERVICE;
  const x1 = team === "A" ? NET - SHORT_SERVICE : LENGTH - DOUBLES_LONG_SERVICE;
  return { x: mx(x0), y: my(top ? 0 : WIDTH / 2), w: (x1 - x0) * SCALE, h: (WIDTH / 2) * SCALE };
}

function playerCoords(team: Team, side: Side) {
  const court = serviceCourt(team, side);
  return { x: court.x + court.w / 2, y: court.y + court.h / 2 };
}

function sideLabel(side: Side) {
  return side === "right" ? "오른쪽" : "왼쪽";
}

export function describeCourt(state: MatchState, showServe: boolean): string {
  const lines = (["A", "B"] as const).map((team) => {
    const players = PLAYERS.filter((p) => p.team === team)
      .map((p) => `${sideLabel(state.sides[p.id])} ${p.name}`)
      .join(", ");
    return `${TEAM_NAME[team]}: ${players}`;
  });
  if (showServe) {
    lines.push(`서버 ${getPlayer(getServerId(state)).name}, 리시버 ${getPlayer(getReceiverId(state)).name}`);
  }
  return `배드민턴 코트. ${lines.join(". ")}`;
}

function PlayerAvatar({
  playerId,
  x,
  y,
  role,
}: {
  readonly playerId: string;
  readonly x: number;
  readonly y: number;
  readonly role: "server" | "receiver" | null;
}) {
  const player = getPlayer(playerId);
  const color = TEAM_COLOR[player.team];

  return (
    <g className="court-player" style={{ transform: `translate(${x}px, ${y}px)` }}>
      {role === "server" && (
        <circle r="19" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4 3" className="spin-slow" />
      )}
      {role === "receiver" && <circle r="18" fill="none" stroke="white" strokeWidth="2" strokeDasharray="2 3" />}
      <circle r="14" fill="white" stroke={color} strokeWidth="2.5" />
      <text textAnchor="middle" dominantBaseline="central" fontSize="13" dy="-1">
        {player.emoji}
      </text>
      <rect x="-16" y="16" width="32" height="13" rx="6" fill={color} />
      <text textAnchor="middle" dominantBaseline="central" y="22.5" fontSize="7.5" fill="white" fontWeight="bold">
        {player.name}
      </text>
      {role === "server" && (
        <text textAnchor="middle" dominantBaseline="central" y="-25" fontSize="11">
          🏸
        </text>
      )}
      {role === "receiver" && (
        <g transform="translate(0,-25)">
          <rect x="-15" y="-6" width="30" height="12" rx="6" fill="white" opacity="0.9" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="bold" fill="#166534">
            리시브
          </text>
        </g>
      )}
    </g>
  );
}

interface BadmintonCourtProps {
  readonly state: MatchState;
  readonly showServe?: boolean;
}

export default function BadmintonCourt({ state, showServe = true }: BadmintonCourtProps) {
  const serverId = showServe ? getServerId(state) : null;
  const receiverId = showServe ? getReceiverId(state) : null;

  const server = serverId ? getPlayer(serverId) : null;
  const receiver = receiverId ? getPlayer(receiverId) : null;
  const serverCourt = server ? serviceCourt(server.team, state.sides[server.id]) : null;
  const targetCourt = receiver ? serviceCourt(receiver.team, state.sides[receiver.id]) : null;
  const from = server ? playerCoords(server.team, state.sides[server.id]) : null;
  const to = receiver ? playerCoords(receiver.team, state.sides[receiver.id]) : null;

  const line = { stroke: "white", strokeWidth: 1.5 } as const;

  return (
    <figure className="w-full mx-auto">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto drop-shadow-lg"
        role="img"
        aria-label={describeCourt(state, showServe)}
      >
        <defs>
          <linearGradient id="courtGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3a9d5e" />
            <stop offset="100%" stopColor="#2d8a4e" />
          </linearGradient>
          <marker id="serveArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#fbbf24" />
          </marker>
        </defs>

        {/* Team labels */}
        <text x={mx(NET / 2)} y={14} textAnchor="middle" fontSize="10" fontWeight="bold" fill={TEAM_COLOR.A}>
          A팀 (우리) →
        </text>
        <text x={mx(NET + NET / 2)} y={14} textAnchor="middle" fontSize="10" fontWeight="bold" fill={TEAM_COLOR.B}>
          ← B팀 (상대)
        </text>

        {/* Court surface */}
        <rect x={mx(0)} y={my(0)} width={LENGTH * SCALE} height={WIDTH * SCALE} rx="3" fill="url(#courtGradient)" />

        {/* Service court highlights */}
        {serverCourt && (
          <rect
            x={serverCourt.x} y={serverCourt.y} width={serverCourt.w} height={serverCourt.h}
            fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 3"
          />
        )}
        {targetCourt && (
          <rect
            x={targetCourt.x} y={targetCourt.y} width={targetCourt.w} height={targetCourt.h}
            fill="rgba(251,191,36,0.28)" stroke="#fbbf24" strokeWidth="2"
          />
        )}

        {/* Boundary & singles sidelines */}
        <rect x={mx(0)} y={my(0)} width={LENGTH * SCALE} height={WIDTH * SCALE} fill="none" {...line} strokeWidth={2} />
        <line x1={mx(0)} y1={my(SINGLES_INSET)} x2={mx(LENGTH)} y2={my(SINGLES_INSET)} {...line} opacity="0.45" />
        <line x1={mx(0)} y1={my(WIDTH - SINGLES_INSET)} x2={mx(LENGTH)} y2={my(WIDTH - SINGLES_INSET)} {...line} opacity="0.45" />

        {/* Doubles long service lines */}
        <line x1={mx(DOUBLES_LONG_SERVICE)} y1={my(0)} x2={mx(DOUBLES_LONG_SERVICE)} y2={my(WIDTH)} {...line} />
        <line x1={mx(LENGTH - DOUBLES_LONG_SERVICE)} y1={my(0)} x2={mx(LENGTH - DOUBLES_LONG_SERVICE)} y2={my(WIDTH)} {...line} />

        {/* Short service lines */}
        <line x1={mx(NET - SHORT_SERVICE)} y1={my(0)} x2={mx(NET - SHORT_SERVICE)} y2={my(WIDTH)} {...line} />
        <line x1={mx(NET + SHORT_SERVICE)} y1={my(0)} x2={mx(NET + SHORT_SERVICE)} y2={my(WIDTH)} {...line} />

        {/* Centre lines (back boundary → short service line only) */}
        <line x1={mx(0)} y1={my(WIDTH / 2)} x2={mx(NET - SHORT_SERVICE)} y2={my(WIDTH / 2)} {...line} />
        <line x1={mx(NET + SHORT_SERVICE)} y1={my(WIDTH / 2)} x2={mx(LENGTH)} y2={my(WIDTH / 2)} {...line} />

        {/* Net */}
        <rect x={mx(NET) - 2} y={my(0) - 4} width="4" height={WIDTH * SCALE + 8} rx="2" fill="white" />

        {/* Service court labels (own perspective) */}
        {(["A", "B"] as const).flatMap((team) =>
          (["left", "right"] as const).map((side) => {
            const court = serviceCourt(team, side);
            const top = isTopHalf(team, side);
            const nearNetX = team === "A" ? court.x + court.w - 4 : court.x + 4;
            return (
              <text
                key={`${team}-${side}`}
                x={nearNetX}
                y={top ? court.y + 11 : court.y + court.h - 6}
                textAnchor={team === "A" ? "end" : "start"}
                fontSize="8"
                fontWeight="bold"
                fill="rgba(255,255,255,0.75)"
              >
                {side === "right" ? "짝수(오른쪽)" : "홀수(왼쪽)"}
              </text>
            );
          })
        )}

        {/* Serve trajectory */}
        {from && to && (
          <path
            key={`${serverId}-${receiverId}-${state.scoreA}-${state.scoreB}`}
            d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${(from.y + to.y) / 2 - 36} ${to.x - Math.sign(to.x - from.x) * 20} ${to.y + Math.sign(from.y - to.y) * 6}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="6 4"
            markerEnd="url(#serveArrow)"
            className="animate-fade-in"
          />
        )}

        {/* Players */}
        {PLAYERS.map((p) => {
          const coords = playerCoords(p.team, state.sides[p.id]);
          return (
            <PlayerAvatar
              key={p.id}
              playerId={p.id}
              x={coords.x}
              y={coords.y}
              role={p.id === serverId ? "server" : p.id === receiverId ? "receiver" : null}
            />
          );
        })}
      </svg>
      {server && receiver && (
        <figcaption className="text-center text-[11px] sm:text-xs text-gray-500 mt-1" aria-hidden="true">
          🏸 <b style={{ color: TEAM_COLOR[server.team] }}>{server.name}</b> ({sideLabel(state.sides[server.id])})
          {" → "}
          <b style={{ color: TEAM_COLOR[receiver.team] }}>{receiver.name}</b> ({sideLabel(state.sides[receiver.id])}) 대각선
          서브
        </figcaption>
      )}
    </figure>
  );
}
