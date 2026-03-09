"use client";

import { PLAYERS, type Position } from "@/data/tutorial-steps";

interface BadmintonCourtProps {
  readonly positions: readonly Position[];
  readonly serverId: string;
}

// Landscape court: left = Team A (bottom conceptually), right = Team B (top conceptually)
// courtHalf: "bottom" (A team) → left side, "top" (B team) → right side
// side: "left" → top in landscape, "right" → bottom in landscape
function getPlayerCoords(
  pos: Position,
  courtPadding: number,
  courtWidth: number,
  courtHeight: number
): { x: number; y: number } {
  const xPct = pos.courtHalf === "bottom" ? 25 : 75;
  const yPct = pos.side === "left" ? 25 : 75;
  return {
    x: courtPadding + (xPct / 100) * courtWidth,
    y: courtPadding + (yPct / 100) * courtHeight,
  };
}

function PlayerAvatar({
  playerId,
  x,
  y,
  isServer,
}: {
  readonly playerId: string;
  readonly x: number;
  readonly y: number;
  readonly isServer: boolean;
}) {
  const player = PLAYERS.find((p) => p.id === playerId);
  if (!player) return null;

  const teamColor = player.team === "A" ? "#f97316" : "#3b82f6";

  return (
    <g style={{ transform: `translate(${x}px, ${y}px)`, transition: "transform 700ms ease-in-out" }}>
      {isServer && (
        <circle r="18" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 2">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      <circle r="14" fill="white" stroke={teamColor} strokeWidth="2.5" />
      <text textAnchor="middle" dominantBaseline="central" fontSize="13" dy="-1">
        {player.emoji}
      </text>
      <rect x="-16" y="16" width="32" height="13" rx="6" fill={teamColor} />
      <text textAnchor="middle" dominantBaseline="central" y="22.5" fontSize="7" fill="white" fontWeight="bold">
        {player.name}
      </text>
      {isServer && (
        <text textAnchor="middle" dominantBaseline="central" y="-22" fontSize="11">
          🏸
        </text>
      )}
    </g>
  );
}

export default function BadmintonCourt({ positions, serverId }: BadmintonCourtProps) {
  const svgWidth = 480;
  const svgHeight = 260;
  const courtPadding = 16;
  const courtWidth = svgWidth - courtPadding * 2;
  const courtHeight = svgHeight - courtPadding * 2;

  const serverPos = positions.find((p) => p.playerId === serverId);
  const serverCoords = serverPos
    ? getPlayerCoords(serverPos, courtPadding, courtWidth, courtHeight)
    : null;

  const serveTarget = serverCoords
    ? {
        x: serverCoords.x > svgWidth / 2 ? courtPadding + courtWidth * 0.25 : courtPadding + courtWidth * 0.75,
        y: serverCoords.y > svgHeight / 2 ? courtPadding + courtHeight * 0.25 : courtPadding + courtHeight * 0.75,
      }
    : null;

  const serviceBox = serverPos
    ? (() => {
        const pos = getPlayerCoords(serverPos, courtPadding, courtWidth, courtHeight);
        return {
          x: pos.x > svgWidth / 2 ? courtPadding + courtWidth / 2 : courtPadding,
          y: pos.y > svgHeight / 2 ? courtPadding + courtHeight * 0.58 : courtPadding + courtHeight * 0.12,
          w: courtWidth / 2,
          h: courtHeight * 0.30,
        };
      })()
    : null;

  return (
    <div className="w-full mx-auto" role="img" aria-label="배드민턴 코트 포지션 다이어그램">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto drop-shadow-lg">
        <defs>
          <linearGradient id="courtGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3a9d5e" />
            <stop offset="100%" stopColor="#2d8a4e" />
          </linearGradient>
        </defs>

        {/* Court background */}
        <rect
          x={courtPadding} y={courtPadding} width={courtWidth} height={courtHeight}
          rx="6" fill="url(#courtGradient)" stroke="#1e6b3a" strokeWidth="3"
        />

        {/* Court stripes */}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={i}
            x={courtPadding}
            y={courtPadding + (i * courtHeight) / 6}
            width={courtWidth}
            height={courtHeight / 6}
            fill={i % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent"}
          />
        ))}

        {/* Outer boundary */}
        <rect
          x={courtPadding} y={courtPadding} width={courtWidth} height={courtHeight}
          rx="6" fill="none" stroke="white" strokeWidth="2"
        />

        {/* Net line (vertical center) */}
        <line x1={svgWidth / 2} y1={courtPadding} x2={svgWidth / 2} y2={svgHeight - courtPadding} stroke="white" strokeWidth="2" />

        {/* Center horizontal line */}
        <line
          x1={courtPadding} y1={svgHeight / 2} x2={svgWidth - courtPadding} y2={svgHeight / 2}
          stroke="white" strokeWidth="1.5" strokeDasharray="6 4"
        />

        {/* Service lines - left half */}
        <line x1={courtPadding + courtWidth * 0.12} y1={courtPadding} x2={courtPadding + courtWidth * 0.12} y2={svgHeight - courtPadding} stroke="white" strokeWidth="1" opacity="0.5" />
        <line x1={courtPadding + courtWidth * 0.38} y1={courtPadding} x2={courtPadding + courtWidth * 0.38} y2={svgHeight - courtPadding} stroke="white" strokeWidth="1" opacity="0.5" />

        {/* Service lines - right half */}
        <line x1={courtPadding + courtWidth * 0.62} y1={courtPadding} x2={courtPadding + courtWidth * 0.62} y2={svgHeight - courtPadding} stroke="white" strokeWidth="1" opacity="0.5" />
        <line x1={courtPadding + courtWidth * 0.88} y1={courtPadding} x2={courtPadding + courtWidth * 0.88} y2={svgHeight - courtPadding} stroke="white" strokeWidth="1" opacity="0.5" />

        {/* Net bar */}
        <rect x={svgWidth / 2 - 2} y={courtPadding - 3} width="4" height={courtHeight + 6} rx="2" fill="white" opacity="0.8" />

        {/* Court labels */}
        <text x={courtPadding + courtWidth * 0.25} y={courtPadding + 11} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" opacity="0.8">
          A팀 코트 (우리)
        </text>
        <text x={courtPadding + courtWidth * 0.75} y={courtPadding + 11} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" opacity="0.8">
          B팀 코트 (상대)
        </text>

        {/* Side labels */}
        <text x={courtPadding + 3} y={courtPadding + courtHeight * 0.25} fontSize="6" fill="rgba(255,255,255,0.6)" fontWeight="bold" writingMode="vertical-rl">
          홀(좌)
        </text>
        <text x={courtPadding + 3} y={courtPadding + courtHeight * 0.72} fontSize="6" fill="rgba(255,255,255,0.6)" fontWeight="bold" writingMode="vertical-rl">
          짝(우)
        </text>

        {/* Service box highlight */}
        {serviceBox && (
          <rect
            x={serviceBox.x} y={serviceBox.y} width={serviceBox.w} height={serviceBox.h}
            fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="1.5" rx="2"
            style={{ transition: "all 500ms ease-in-out" }}
          />
        )}

        {/* Serve direction line */}
        {serverCoords && serveTarget && (
          <line
            x1={serverCoords.x} y1={serverCoords.y} x2={serveTarget.x} y2={serveTarget.y}
            stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 4" opacity="0.7"
            style={{ transition: "all 500ms ease-in-out" }}
          />
        )}

        {/* Players */}
        {positions.map((pos) => {
          const coords = getPlayerCoords(pos, courtPadding, courtWidth, courtHeight);
          return (
            <PlayerAvatar
              key={pos.playerId}
              playerId={pos.playerId}
              x={coords.x}
              y={coords.y}
              isServer={pos.playerId === serverId}
            />
          );
        })}
      </svg>
    </div>
  );
}
