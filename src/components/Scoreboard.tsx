"use client";

import { getGamePhase, type MatchState } from "@/lib/rules";
import { TEAM_COLOR } from "./BadmintonCourt";

interface ScoreboardProps {
  readonly state: MatchState;
  readonly showServe?: boolean;
}

const PHASE_LABEL = { normal: null, deuce: "듀스 · 2점 차로 승리", golden: "골든 포인트 · 30점 선취 승리" } as const;

export default function Scoreboard({ state, showServe = true }: ScoreboardProps) {
  const { scoreA, scoreB, servingTeam } = state;
  const phase = PHASE_LABEL[getGamePhase(state)];
  const serving = showServe ? servingTeam : null;

  return (
    <div className="py-1.5">
      <div
        className="flex items-center justify-center gap-3"
        role="status"
        aria-live="polite"
        aria-label={`점수 A팀 ${scoreA} 대 B팀 ${scoreB}${serving ? `, ${serving}팀 서브` : ""}`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-gray-500 w-10 text-right">
            {serving === "A" && "🏸 "}A팀
          </span>
          <span
            key={`scoreA-${scoreA}`}
            className="text-2xl font-bold tabular-nums animate-bounce-subtle w-8 text-center"
            style={{ color: TEAM_COLOR.A }}
          >
            {scoreA}
          </span>
        </div>
        <span className="text-xs font-medium text-gray-400">VS</span>
        <div className="flex items-center gap-1.5">
          <span
            key={`scoreB-${scoreB}`}
            className="text-2xl font-bold tabular-nums animate-bounce-subtle w-8 text-center"
            style={{ color: TEAM_COLOR.B }}
          >
            {scoreB}
          </span>
          <span className="text-[11px] font-semibold text-gray-500 w-10">
            B팀{serving === "B" && " 🏸"}
          </span>
        </div>
      </div>
      {phase && (
        <p className="text-center text-[11px] font-bold text-red-500 animate-fade-in">{phase}</p>
      )}
    </div>
  );
}
