"use client";

import { PLAYERS, type Position } from "@/data/tutorial-steps";

interface BadmintonCourtProps {
  readonly positions: readonly Position[];
  readonly serverId: string;
}

function getPlayerPosition(pos: Position): { x: number; y: number } {
  const xMap = { left: 25, right: 75 };
  const yMap = { top: 25, bottom: 75 };
  return { x: xMap[pos.side], y: yMap[pos.courtHalf] };
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
    <g
      transform={`translate(${x}, ${y})`}
      className="transition-all duration-700 ease-in-out"
    >
      {isServer && (
        <circle
          r="22"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeDasharray="4 3"
          className="animate-[spin_3s_linear_infinite]"
        >
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
      <circle r="17" fill="white" stroke={teamColor} strokeWidth="2.5" />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="16"
        dy="-1"
      >
        {player.emoji}
      </text>
      <rect
        x="-20"
        y="20"
        width="40"
        height="16"
        rx="8"
        fill={teamColor}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        y="28"
        fontSize="8"
        fill="white"
        fontWeight="bold"
      >
        {player.name}
      </text>
      {isServer && (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          y="-28"
          fontSize="14"
        >
          🏸
        </text>
      )}
    </g>
  );
}

export default function BadmintonCourt({
  positions,
  serverId,
}: BadmintonCourtProps) {
  const svgWidth = 320;
  const svgHeight = 480;
  const courtPadding = 20;
  const courtWidth = svgWidth - courtPadding * 2;
  const courtHeight = svgHeight - courtPadding * 2;

  return (
    <div className="w-full max-w-[340px] mx-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto drop-shadow-lg"
      >
        {/* Court background */}
        <rect
          x={courtPadding}
          y={courtPadding}
          width={courtWidth}
          height={courtHeight}
          rx="6"
          fill="#4ade80"
          stroke="#16a34a"
          strokeWidth="3"
        />

        {/* Court stripes (subtle) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x={courtPadding + (i * courtWidth) / 8}
            y={courtPadding}
            width={courtWidth / 8}
            height={courtHeight}
            fill={i % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent"}
          />
        ))}

        {/* Court lines */}
        {/* Outer boundary */}
        <rect
          x={courtPadding}
          y={courtPadding}
          width={courtWidth}
          height={courtHeight}
          rx="6"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* Center line (horizontal - net) */}
        <line
          x1={courtPadding}
          y1={svgHeight / 2}
          x2={svgWidth - courtPadding}
          y2={svgHeight / 2}
          stroke="white"
          strokeWidth="2"
        />

        {/* Center line (vertical) */}
        <line
          x1={svgWidth / 2}
          y1={courtPadding}
          x2={svgWidth / 2}
          y2={svgHeight - courtPadding}
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />

        {/* Service lines - top */}
        <line
          x1={courtPadding}
          y1={courtPadding + courtHeight * 0.15}
          x2={svgWidth - courtPadding}
          y2={courtPadding + courtHeight * 0.15}
          stroke="white"
          strokeWidth="1"
          opacity="0.6"
        />
        <line
          x1={courtPadding}
          y1={courtPadding + courtHeight * 0.38}
          x2={svgWidth - courtPadding}
          y2={courtPadding + courtHeight * 0.38}
          stroke="white"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Service lines - bottom */}
        <line
          x1={courtPadding}
          y1={courtPadding + courtHeight * 0.62}
          x2={svgWidth - courtPadding}
          y2={courtPadding + courtHeight * 0.62}
          stroke="white"
          strokeWidth="1"
          opacity="0.6"
        />
        <line
          x1={courtPadding}
          y1={courtPadding + courtHeight * 0.85}
          x2={svgWidth - courtPadding}
          y2={courtPadding + courtHeight * 0.85}
          stroke="white"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Net indicator */}
        <rect
          x={courtPadding - 4}
          y={svgHeight / 2 - 2}
          width={courtWidth + 8}
          height="4"
          rx="2"
          fill="white"
          opacity="0.8"
        />

        {/* Court labels */}
        <text
          x={svgWidth / 2}
          y={courtPadding + 12}
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontWeight="bold"
          opacity="0.8"
        >
          B팀 코트 (상대)
        </text>
        <text
          x={svgWidth / 2}
          y={svgHeight - courtPadding - 5}
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontWeight="bold"
          opacity="0.8"
        >
          A팀 코트 (우리)
        </text>

        {/* Side labels */}
        <text
          x={courtPadding + 5}
          y={svgHeight - courtPadding - 18}
          fontSize="7"
          fill="rgba(255,255,255,0.7)"
          fontWeight="bold"
        >
          좌(홀)
        </text>
        <text
          x={svgWidth - courtPadding - 30}
          y={svgHeight - courtPadding - 18}
          fontSize="7"
          fill="rgba(255,255,255,0.7)"
          fontWeight="bold"
        >
          우(짝)
        </text>

        {/* Serve direction line */}
        {(() => {
          const serverPos = positions.find((p) => p.playerId === serverId);
          if (!serverPos) return null;
          const from = getPlayerPosition(serverPos);
          const targetX = from.x > 50 ? 25 : 75;
          const targetY = from.y > 50 ? 25 : 75;
          const sx = courtPadding + (from.x / 100) * courtWidth;
          const sy = courtPadding + (from.y / 100) * courtHeight;
          const ex = courtPadding + (targetX / 100) * courtWidth;
          const ey = courtPadding + (targetY / 100) * courtHeight;
          return (
            <line
              x1={sx}
              y1={sy}
              x2={ex}
              y2={ey}
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.7"
            />
          );
        })()}

        {/* Highlighted service box */}
        {(() => {
          const serverPos = positions.find((p) => p.playerId === serverId);
          if (!serverPos) return null;
          const pos = getPlayerPosition(serverPos);
          const bx =
            pos.x > 50
              ? courtPadding + courtWidth / 2
              : courtPadding;
          const by =
            pos.y > 50
              ? courtPadding + courtHeight * 0.62
              : courtPadding + courtHeight * 0.15;
          const bw = courtWidth / 2;
          const bh = courtHeight * 0.23;
          return (
            <rect
              x={bx}
              y={by}
              width={bw}
              height={bh}
              fill="rgba(251, 191, 36, 0.2)"
              stroke="#fbbf24"
              strokeWidth="1.5"
              rx="2"
            />
          );
        })()}

        {/* Players */}
        {positions.map((pos) => {
          const coords = getPlayerPosition(pos);
          return (
            <PlayerAvatar
              key={pos.playerId}
              playerId={pos.playerId}
              x={courtPadding + (coords.x / 100) * courtWidth}
              y={courtPadding + (coords.y / 100) * courtHeight}
              isServer={pos.playerId === serverId}
            />
          );
        })}
      </svg>
    </div>
  );
}
