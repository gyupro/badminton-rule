"use client";

import { useState, useCallback, useEffect } from "react";
import {
  INITIAL_STATE,
  PLAYERS,
  TEAM_NAME,
  describeRally,
  getGameWinner,
  getServerId,
  playRally,
  type MatchState,
  type RallyResult,
  type Team,
} from "@/lib/rules";
import BadmintonCourt, { TEAM_COLOR } from "./BadmintonCourt";
import Scoreboard from "./Scoreboard";

const PRESETS: readonly { label: string; state: MatchState }[] = [
  { label: "0:0", state: INITIAL_STATE },
  { label: "듀스 20:20", state: { ...INITIAL_STATE, scoreA: 20, scoreB: 20 } },
  { label: "29:29", state: { ...INITIAL_STATE, scoreA: 29, scoreB: 29, servingTeam: "B" } },
];

interface Pending {
  readonly prev: MatchState;
  readonly result: RallyResult;
}

export default function Practice() {
  const [history, setHistory] = useState<readonly MatchState[]>([INITIAL_STATE]);
  const [message, setMessage] = useState("득점한 팀 버튼을 눌러보세요. 위치와 서버가 규칙대로 바뀝니다.");
  const [guessMode, setGuessMode] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [streak, setStreak] = useState({ correct: 0, total: 0 });

  const state = history[history.length - 1];
  const gameWinner = getGameWinner(state);

  const commit = useCallback((prev: MatchState, result: RallyResult, prefix = "") => {
    setHistory((h) => [...h, result.state]);
    setMessage(prefix + describeRally(prev, result));
  }, []);

  const score = useCallback(
    (team: Team) => {
      if (pending || gameWinner) return;
      const result = playRally(state, team);
      if (guessMode && result.event !== "game-over") {
        setPending({ prev: state, result });
        setMessage(`${TEAM_NAME[team]} 득점! 다음에 서브할 선수는 누구일까요?`);
        return;
      }
      commit(state, result);
    },
    [pending, gameWinner, state, guessMode, commit]
  );

  const guess = useCallback(
    (playerId: string) => {
      if (!pending) return;
      const correct = getServerId(pending.result.state) === playerId;
      setStreak((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
      commit(pending.prev, pending.result, correct ? "⭕ 정답! " : "❌ 아쉬워요. ");
      setPending(null);
    },
    [pending, commit]
  );

  const undo = useCallback(() => {
    setPending(null);
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
    setMessage("한 랠리 되돌렸어요.");
  }, []);

  const reset = useCallback((preset: MatchState = INITIAL_STATE) => {
    setPending(null);
    setHistory([preset]);
    setMessage("새 상황에서 시작해요. 득점한 팀을 눌러보세요.");
  }, []);

  // Keyboard: A / B to score, Z / Backspace to undo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === "a") score("A");
      else if (key === "b") score("B");
      else if (key === "z" || key === "backspace") undo();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [score, undo]);

  const shown = pending ? pending.prev : state;

  return (
    <div>
      <div className="px-2 sm:px-4">
        <BadmintonCourt state={shown} showServe={!pending && !gameWinner} />
      </div>

      <div className="px-4 pb-4 pt-1 sm:px-6 sm:pb-6">
        <Scoreboard state={pending ? pending.result.state : state} showServe={!pending && !gameWinner} />

        <p
          role="status"
          aria-live="polite"
          className={`text-sm leading-relaxed rounded-xl px-3 py-2.5 mb-3 min-h-[64px] ${
            gameWinner ? "bg-green-50 text-green-800 font-semibold" : "bg-gray-50 text-gray-700"
          }`}
        >
          {message}
        </p>

        {pending ? (
          <div className="grid grid-cols-2 gap-2 mb-3 animate-fade-in" role="group" aria-label="다음 서버 선택">
            {PLAYERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => guess(p.id)}
                className="h-12 rounded-xl border-2 bg-white text-sm font-semibold cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all"
                style={{ borderColor: TEAM_COLOR[p.team], color: TEAM_COLOR[p.team] }}
              >
                {p.emoji} {p.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(["A", "B"] as const).map((team) => (
              <button
                key={team}
                type="button"
                onClick={() => score(team)}
                disabled={!!gameWinner}
                aria-keyshortcuts={team}
                className="h-12 rounded-xl text-white text-sm font-semibold cursor-pointer active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-95"
                style={{ backgroundColor: TEAM_COLOR[team] }}
              >
                {TEAM_NAME[team]} 득점 +1
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={undo}
            disabled={history.length <= 1 && !pending}
            className="h-9 px-3 rounded-lg border border-gray-300 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ↶ 되돌리기
          </button>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => reset(preset.state)}
              className="h-9 px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-50"
            >
              {preset.label}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={guessMode}
              onChange={(e) => {
                setGuessMode(e.target.checked);
                if (pending) {
                  commit(pending.prev, pending.result);
                  setPending(null);
                }
              }}
              className="w-4 h-4 accent-[#f97316]"
            />
            서버 맞히기
          </label>
        </div>
        {guessMode && streak.total > 0 && (
          <p className="text-right text-[11px] text-gray-400 mt-1">
            맞힌 횟수 {streak.correct}/{streak.total}
          </p>
        )}
      </div>
    </div>
  );
}
