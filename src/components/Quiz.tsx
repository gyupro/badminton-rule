"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { QUIZ_QUESTIONS, type QuizQuestion } from "@/data/quiz";

const BEST_SCORE_KEY = "badminton-rule:quiz-best";

interface PreparedQuestion {
  readonly question: string;
  readonly options: readonly string[];
  readonly answer: number;
  readonly explanation: string;
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Shuffle question order and option order so the answer position isn't guessable.
function prepare(questions: readonly QuizQuestion[]): PreparedQuestion[] {
  return shuffle(questions).map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return {
      question: q.question,
      options: order.map((i) => q.options[i]),
      answer: order.indexOf(q.answer),
      explanation: q.explanation,
    };
  });
}

function readBest(): number | null {
  try {
    const value = localStorage.getItem(BEST_SCORE_KEY);
    return value === null ? null : Number(value);
  } catch {
    return null;
  }
}

function writeBest(score: number) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // storage unavailable (private mode etc.) — best score just isn't remembered
  }
}

export default function Quiz({ onBack }: { readonly onBack: () => void }) {
  const [questions, setQuestions] = useState(() => prepare(QUIZ_QUESTIONS));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  // Quiz only mounts after user interaction (never server-rendered), so reading storage here is safe.
  const [best, setBest] = useState<number | null>(readBest);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const question = questions[current];
  const selected = answers[current] ?? null;
  const showResult = selected !== null;
  const correctCount = answers.filter((a, i) => a === questions[i].answer).length;
  const total = questions.length;

  const handleSelect = useCallback(
    (index: number) => {
      if (showResult) return;
      setAnswers((prev) => [...prev, index]);
    },
    [showResult]
  );

  const handleNext = useCallback(() => {
    if (current < total - 1) {
      setCurrent((prev) => prev + 1);
      return;
    }
    setIsFinished(true);
    if (best === null || correctCount > best) {
      writeBest(correctCount);
      setBest(correctCount);
    }
  }, [current, total, best, correctCount]);

  const restart = useCallback(() => {
    setQuestions(prepare(QUIZ_QUESTIONS));
    setCurrent(0);
    setAnswers([]);
    setIsFinished(false);
  }, []);

  // Move focus to "next" so keyboard / screen-reader users land on the explanation flow
  useEffect(() => {
    if (showResult) nextButtonRef.current?.focus();
  }, [showResult]);

  // Keyboard: 1–4 to answer, Enter/→ for next
  useEffect(() => {
    if (isFinished) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (!showResult && n >= 1 && n <= question.options.length) {
        handleSelect(n - 1);
      } else if (showResult && e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFinished, showResult, question, handleSelect, handleNext]);

  if (isFinished) {
    const percentage = Math.round((correctCount / total) * 100);
    const emoji = percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪";
    const wrong = questions
      .map((q, i) => ({ q, picked: answers[i] }))
      .filter(({ q, picked }) => picked !== q.answer);

    return (
      <div className="text-center py-4 animate-fade-in">
        <div className="text-6xl mb-3">{emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">퀴즈 완료!</h2>
        <p className="text-lg text-gray-600 mb-1">
          {total}문제 중 <span className="font-bold text-[#f97316]">{correctCount}문제</span> 정답
        </p>
        <p className="text-sm text-gray-500 mb-1">
          {percentage >= 80
            ? "배드민턴 규칙 마스터!"
            : percentage >= 60
              ? "조금만 더 공부하면 완벽해요!"
              : "튜토리얼을 다시 보고 도전해보세요!"}
        </p>
        {best !== null && <p className="text-xs text-gray-400 mb-4">최고 기록 {best}/{total}</p>}

        {wrong.length > 0 && (
          <div className="text-left mb-5">
            <h3 className="text-sm font-bold text-gray-700 mb-2">틀린 문제 다시 보기</h3>
            <ul className="flex flex-col gap-2 max-h-[40dvh] overflow-y-auto">
              {wrong.map(({ q, picked }) => (
                <li key={q.question} className="bg-gray-50 rounded-xl px-3 py-2.5 text-sm">
                  <p className="font-semibold text-gray-800 mb-1">{q.question}</p>
                  <p className="text-red-600 text-xs">✗ 내 답: {q.options[picked]}</p>
                  <p className="text-green-700 text-xs mb-1">✓ 정답: {q.options[q.answer]}</p>
                  <p className="text-gray-500 text-xs">{q.explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 h-12 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            튜토리얼 다시 보기
          </button>
          <button
            type="button"
            onClick={restart}
            className="flex-1 h-12 bg-[#f97316] text-white rounded-xl text-sm font-semibold hover:bg-[#ea580c] transition-colors cursor-pointer"
          >
            다시 풀기
          </button>
        </div>
      </div>
    );
  }

  const isCorrect = selected === question.answer;

  return (
    <div className="animate-fade-in" key={current}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#f97316]">
          Q{current + 1}/{total}
        </span>
        <span className="text-sm text-gray-500">
          정답 {correctCount}/{answers.length}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-[#f97316] transition-all duration-300"
          style={{ width: `${((current + (showResult ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <h2 id="quiz-question" className="text-lg font-bold text-gray-800 mb-4">
        {question.question}
      </h2>

      <div className="flex flex-col gap-2 mb-4" role="group" aria-labelledby="quiz-question">
        {question.options.map((option, i) => {
          let style = "bg-white border-gray-200 text-gray-700 hover:border-[#f97316]/50";
          if (showResult) {
            if (i === question.answer) style = "bg-green-50 border-green-500 text-green-700";
            else if (i === selected) style = "bg-red-50 border-red-500 text-red-700";
            else style = "bg-gray-50 border-gray-200 text-gray-400";
          }
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={showResult}
              aria-pressed={selected === i}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all min-h-[48px] ${style} ${!showResult ? "cursor-pointer active:scale-[0.99]" : ""}`}
            >
              <span className="mr-2 text-sm opacity-60">{i + 1}.</span>
              {option}
              {showResult && i === question.answer && <span className="float-right" aria-label="정답">✓</span>}
              {showResult && i === selected && !isCorrect && <span className="float-right" aria-label="오답">✗</span>}
            </button>
          );
        })}
      </div>

      {showResult && (
        <>
          <div
            role="status"
            className={`rounded-xl px-4 py-3 mb-4 text-sm animate-fade-in border ${
              isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <b className="block mb-0.5">{isCorrect ? "정답이에요! 🎯" : "아쉬워요!"}</b>
            {question.explanation}
          </div>
          <button
            ref={nextButtonRef}
            type="button"
            onClick={handleNext}
            className="w-full h-12 bg-[#f97316] text-white rounded-xl font-semibold hover:bg-[#ea580c] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            {current < total - 1 ? "다음 문제" : "결과 보기"}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
      {!showResult && <p className="text-center text-[11px] text-gray-400 hidden sm:block">키보드 1–4로 답을 고를 수 있어요</p>}
    </div>
  );
}
