"use client";

interface ScoreboardProps {
  readonly scoreA: number;
  readonly scoreB: number;
}

export default function Scoreboard({ scoreA, scoreB }: ScoreboardProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <div className="flex flex-col items-center">
        <span className="text-xs font-semibold text-gray-500">A팀</span>
        <span className="text-3xl font-bold text-[#f97316] tabular-nums">
          {scoreA}
        </span>
      </div>
      <span className="text-sm font-medium text-gray-400 mt-3">VS</span>
      <div className="flex flex-col items-center">
        <span className="text-xs font-semibold text-gray-500">B팀</span>
        <span className="text-3xl font-bold text-[#3b82f6] tabular-nums">
          {scoreB}
        </span>
      </div>
    </div>
  );
}
