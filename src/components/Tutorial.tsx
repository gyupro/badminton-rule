"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { TUTORIAL_STEPS, RULE_SUMMARY, PLAYERS } from "@/data/tutorial-steps";
import BadmintonCourt from "./BadmintonCourt";
import Scoreboard from "./Scoreboard";
import StepIndicator from "./StepIndicator";
import Quiz from "./Quiz";

function RuleSummaryCard() {
  return (
    <div className="animate-fade-in">
      <h3 className="text-base font-bold text-gray-800 mb-3 text-center">
        핵심 규칙 한눈에 보기
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {RULE_SUMMARY.map((rule) => (
          <div
            key={rule.title}
            className="bg-gray-50 rounded-xl p-3 text-center"
          >
            <div className="text-xl mb-1">{rule.icon}</div>
            <div className="text-xs font-bold text-gray-700 mb-0.5">{rule.title}</div>
            <div className="text-[11px] text-gray-500 leading-tight">{rule.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const touchStartX = useRef(0);

  const step = TUTORIAL_STEPS[currentStep];

  const goNext = useCallback(() => {
    setCurrentStep((prev) =>
      prev < TUTORIAL_STEPS.length - 1 ? prev + 1 : prev
    );
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showQuiz) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, showQuiz]);

  // Touch swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (delta > 50) goPrev();
      if (delta < -50) goNext();
    },
    [goNext, goPrev]
  );

  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isSummaryStep = step.isIntro && step.step === 7;

  // Determine serving team
  const servingTeam = step.serverId
    ? (PLAYERS.find((p) => p.id === step.serverId)?.team ?? "")
    : "";

  if (showQuiz) {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-gray-50 to-gray-100 flex items-start justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 mt-4 sm:mt-8">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-[#f97316]/10 text-[#f97316] text-xs font-bold rounded-full mb-2">
              퀴즈 타임!
            </span>
            <h1 className="text-xl font-bold text-gray-800">배드민턴 규칙 퀴즈</h1>
          </div>
          <Quiz
            onBack={() => {
              setShowQuiz(false);
              setCurrentStep(0);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-dvh bg-gradient-to-b from-gray-50 to-gray-100 flex items-start justify-center p-3 sm:p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden mt-2 sm:mt-4">
        {/* Header */}
        <div className="text-center pt-5 pb-3 px-5 sm:pt-6 sm:pb-4 sm:px-6">
          <span className="inline-block px-3 py-1 bg-[#f97316]/10 text-[#f97316] text-xs font-bold rounded-full mb-2">
            초심자를 위한
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <span>🏸</span> 배드민턴 룰 교실
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            복식 경기, 헷갈리는 위치 선정 완벽 정리!
          </p>
        </div>

        {/* Court - no key prop so players animate between positions */}
        <div className="px-3 sm:px-4">
          <BadmintonCourt positions={step.positions} serverId={step.serverId} />
        </div>

        {/* Bottom section */}
        <div className="px-5 pb-5 pt-2 sm:px-6 sm:pb-6">
          {/* Scoreboard */}
          <Scoreboard
            scoreA={step.scoreA}
            scoreB={step.scoreB}
            servingTeam={servingTeam as "A" | "B" | ""}
          />

          {/* Step content */}
          <div className="animate-fade-in min-h-[160px]" key={`content-${currentStep}`}>
            {isSummaryStep ? (
              <RuleSummaryCard />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-[#f97316] text-white text-xs font-bold rounded">
                    STEP {step.step}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-gray-800">
                    {step.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {step.description}
                </p>

                {step.tip && (
                  <div className="bg-[#fef9c3] rounded-xl px-4 py-3 flex items-start gap-2 mb-3">
                    <span className="text-sm mt-0.5">💡</span>
                    <p className="text-sm text-gray-700">
                      {step.tip.replace("💡 ", "")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mt-2 mb-3">
            <StepIndicator
              totalSteps={TUTORIAL_STEPS.length}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={currentStep === 0}
              aria-label="이전 단계"
              className={`flex-1 h-12 rounded-xl border-2 flex items-center justify-center gap-1 text-sm font-semibold transition-all ${
                currentStep === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 cursor-pointer active:scale-[0.98]"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              이전
            </button>

            {isLastStep ? (
              <button
                onClick={() => setShowQuiz(true)}
                aria-label="퀴즈 시작"
                className="flex-1 h-12 bg-[#f97316] text-white rounded-xl text-sm font-semibold hover:bg-[#ea580c] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                📝 퀴즈 도전!
              </button>
            ) : (
              <button
                onClick={goNext}
                aria-label="다음 단계"
                className="flex-1 h-12 bg-[#f97316] text-white rounded-xl text-sm font-semibold hover:bg-[#ea580c] transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98]"
              >
                다음
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
