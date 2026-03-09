"use client";

interface ScoreboardProps {
  readonly scoreA: number;
  readonly scoreB: number;
  readonly servingTeam?: "A" | "B" | "";
}

export default function Scoreboard({ scoreA, scoreB, servingTeam }: ScoreboardProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-3" role="status" aria-label={`점수: A팀 ${scoreA} 대 B팀 ${scoreB}`}>
      <div className="flex flex-col items-center">
        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
          A팀 {servingTeam === "A" && <span className="text-[10px]">🏸</span>}
        </span>
        <span
          key={`scoreA-${scoreA}`}
          className="text-3xl font-bold text-[#f97316] tabular-nums animate-bounce-subtle"
        >
          {scoreA}
        </span>
      </div>
      <span className="text-sm font-medium text-gray-400 mt-3">VS</span>
      <div className="flex flex-col items-center">
        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
          B팀 {servingTeam === "B" && <span className="text-[10px]">🏸</span>}
        </span>
        <span
          key={`scoreB-${scoreB}`}
          className="text-3xl font-bold text-[#3b82f6] tabular-nums animate-bounce-subtle"
        >
          {scoreB}
        </span>
      </div>
    </div>
  );
}
