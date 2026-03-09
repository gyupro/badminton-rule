"use client";

interface ScoreboardProps {
  readonly scoreA: number;
  readonly scoreB: number;
  readonly servingTeam?: "A" | "B" | "";
}

export default function Scoreboard({ scoreA, scoreB, servingTeam }: ScoreboardProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-1.5" role="status" aria-label={`점수: A팀 ${scoreA} 대 B팀 ${scoreB}`}>
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-semibold text-gray-500">
          A팀 {servingTeam === "A" && "🏸"}
        </span>
        <span
          key={`scoreA-${scoreA}`}
          className="text-2xl font-bold text-[#f97316] tabular-nums animate-bounce-subtle"
        >
          {scoreA}
        </span>
      </div>
      <span className="text-xs font-medium text-gray-400">VS</span>
      <div className="flex items-center gap-1.5">
        <span
          key={`scoreB-${scoreB}`}
          className="text-2xl font-bold text-[#3b82f6] tabular-nums animate-bounce-subtle"
        >
          {scoreB}
        </span>
        <span className="text-[11px] font-semibold text-gray-500">
          B팀 {servingTeam === "B" && "🏸"}
        </span>
      </div>
    </div>
  );
}
