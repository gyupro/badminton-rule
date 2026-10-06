"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { TUTORIAL_STEPS, RULE_SUMMARY } from "@/data/tutorial-steps";
import BadmintonCourt from "./BadmintonCourt";
import Scoreboard from "./Scoreboard";
import StepIndicator from "./StepIndicator";
import Practice from "./Practice";
import Quiz from "./Quiz";

type Mode = "learn" | "practice" | "quiz";

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "learn", label: "📖 배우기" },
  { id: "practice", label: "🎮 연습하기" },
  { id: "quiz", label: "📝 퀴즈" },
];

const SWIPE_THRESHOLD = 50;

function RuleSummaryCard() {
  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-3 text-center">핵심 규칙 한눈에 보기</h2>
      <ul className="grid grid-cols-2 gap-2">
        {RULE_SUMMARY.map((rule) => (
          <li key={rule.title} className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xl mb-1" aria-hidden="true">
              {rule.icon}
            </div>
            <div className="text-xs font-bold text-gray-700 mb-0.5">{rule.title}</div>
            <div className="text-[11px] text-gray-500 leading-tight">{rule.desc}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChevronIcon({ direction }: { readonly direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

function Learn({ onStartQuiz, onStartPractice }: { readonly onStartQuiz: () => void; readonly onStartPractice: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const step = TUTORIAL_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TUTORIAL_STEPS.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;
      // Only treat clearly horizontal gestures as swipes, so vertical scrolling doesn't flip steps
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx > 0) goPrev();
      else goNext();
    },
    [goNext, goPrev]
  );

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Court — not keyed, so players animate between positions */}
      <div className="px-2 sm:px-4">
        <BadmintonCourt state={step.state} showServe={step.showServe} />
      </div>

      <div className="px-4 pb-4 pt-1 sm:px-6 sm:pb-6">
        <Scoreboard state={step.state} showServe={step.showServe} />

        <div className="animate-fade-in min-h-[120px]" key={currentStep} aria-live="polite">
          {step.kind === "summary" ? (
            <RuleSummaryCard />
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#f97316] text-white text-xs font-bold rounded shrink-0">
                  STEP {currentStep}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-gray-800">{step.title}</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{step.description}</p>
              {step.tip && (
                <div className="bg-[#fef9c3] rounded-xl px-4 py-3 flex items-start gap-2 mb-3">
                  <span className="text-sm mt-0.5" aria-hidden="true">
                    💡
                  </span>
                  <p className="text-sm text-gray-700">
                    <span className="sr-only">팁: </span>
                    {step.tip}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-center mt-2 mb-2">
          <StepIndicator totalSteps={TUTORIAL_STEPS.length} currentStep={currentStep} onStepClick={setCurrentStep} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirstStep}
            className={`flex-1 h-12 rounded-xl border-2 flex items-center justify-center gap-1 text-sm font-semibold transition-all ${
              isFirstStep
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 cursor-pointer active:scale-[0.98]"
            }`}
          >
            <ChevronIcon direction="left" />
            이전
          </button>

          {isLastStep ? (
            <>
              <button
                type="button"
                onClick={onStartPractice}
                className="flex-1 h-12 rounded-xl border-2 border-[#f97316] text-[#f97316] text-sm font-semibold hover:bg-[#f97316]/5 transition-all cursor-pointer active:scale-[0.98]"
              >
                🎮 연습
              </button>
              <button
                type="button"
                onClick={onStartQuiz}
                className="flex-1 h-12 bg-[#f97316] text-white rounded-xl text-sm font-semibold hover:bg-[#ea580c] transition-all cursor-pointer active:scale-[0.98]"
              >
                📝 퀴즈
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="flex-1 h-12 bg-[#f97316] text-white rounded-xl text-sm font-semibold hover:bg-[#ea580c] transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98]"
            >
              다음
              <ChevronIcon direction="right" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Tutorial() {
  const [mode, setMode] = useState<Mode>("learn");

  return (
    <main className="min-h-dvh bg-gradient-to-b from-gray-50 to-gray-100 flex items-start justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden mt-1 sm:mt-4">
        <header className="text-center pt-3 pb-2 px-4 sm:pt-5 sm:pb-3 sm:px-6">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center justify-center gap-1.5">
            <span aria-hidden="true">🏸</span> 배드민턴 룰 교실
          </h1>
          <p className="hidden sm:block text-sm text-gray-400 mt-0.5">복식 경기, 헷갈리는 위치 선정 완벽 정리!</p>

          <div role="tablist" aria-label="학습 모드" className="mt-2 grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                id={`tab-${m.id}`}
                aria-selected={mode === m.id}
                aria-controls="mode-panel"
                onClick={() => setMode(m.id)}
                className={`h-8 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  mode === m.id ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </header>

        <section id="mode-panel" role="tabpanel" aria-labelledby={`tab-${mode}`}>
          {mode === "learn" && (
            <Learn onStartQuiz={() => setMode("quiz")} onStartPractice={() => setMode("practice")} />
          )}
          {mode === "practice" && <Practice />}
          {mode === "quiz" && (
            <div className="px-5 pb-6 pt-2 sm:px-6">
              <Quiz onBack={() => setMode("learn")} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
