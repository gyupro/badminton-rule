"use client";

import { useState, useCallback } from "react";
import { TUTORIAL_STEPS } from "@/data/tutorial-steps";
import BadmintonCourt from "./BadmintonCourt";
import Scoreboard from "./Scoreboard";
import StepIndicator from "./StepIndicator";
import Quiz from "./Quiz";

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const step = TUTORIAL_STEPS[currentStep];

  const goNext = useCallback(() => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-start justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 mt-8">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-[#f97316]/10 text-[#f97316] text-xs font-bold rounded-full mb-2">
              퀴즈 타임!
            </span>
            <h1 className="text-xl font-bold text-gray-800">
              배드민턴 규칙 퀴즈
            </h1>
          </div>
          <Quiz onBack={() => { setShowQuiz(false); setCurrentStep(0); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-start justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden mt-4">
        {/* Header */}
        <div className="text-center pt-6 pb-4 px-6">
          <span className="inline-block px-3 py-1 bg-[#f97316]/10 text-[#f97316] text-xs font-bold rounded-full mb-2">
            초심자를 위한
          </span>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <span>🏸</span> 배드민턴 룰 교실
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            복식 경기, 헷갈리는 위치 선정 완벽 정리!
          </p>
        </div>

        {/* Court */}
        <div className="px-4 animate-fade-in" key={`court-${currentStep}`}>
          <BadmintonCourt
            positions={step.positions}
            serverId={step.serverId}
          />
        </div>

        {/* Bottom section */}
        <div className="px-6 pb-6 pt-2">
          {/* Scoreboard */}
          <Scoreboard scoreA={step.scoreA} scoreB={step.scoreB} />

          {/* Step content */}
          <div className="animate-slide-in" key={`content-${currentStep}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-[#f97316] text-white text-xs font-bold rounded">
                STEP {step.step}
              </span>
              <h3 className="text-base font-bold text-gray-800">
                {step.title}
              </h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {step.description}
            </p>

            {/* Tip box */}
            <div className="bg-[#fef9c3] rounded-xl px-4 py-3 flex items-start gap-2 mb-4">
              <span className="text-sm mt-0.5">💡</span>
              <p className="text-sm text-gray-700">{step.tip.replace("💡 ", "")}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentStep === 0}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                currentStep === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <StepIndicator
              totalSteps={TUTORIAL_STEPS.length}
              currentStep={currentStep}
            />

            {isLastStep ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-4 py-2.5 bg-[#f97316] text-white rounded-full text-sm font-semibold hover:bg-[#ea580c] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>📝</span> 퀴즈 도전!
                </button>
              </div>
            ) : (
              <button
                onClick={goNext}
                className="px-5 py-2.5 bg-[#f97316] text-white rounded-full text-sm font-semibold hover:bg-[#ea580c] transition-colors flex items-center gap-1 cursor-pointer"
              >
                다음
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
