"use client";

import { useState, useCallback } from "react";
import { QUIZ_QUESTIONS } from "@/data/tutorial-steps";

export default function Quiz({ onBack }: { readonly onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(index);
      setShowResult(true);
      if (index === question.answer) {
        setCorrectCount((prev) => prev + 1);
      }
    },
    [selectedAnswer, question.answer]
  );

  const handleNext = useCallback(() => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  }, [currentQuestion]);

  if (isFinished) {
    const score = correctCount;
    const total = QUIZ_QUESTIONS.length;
    const percentage = Math.round((score / total) * 100);
    const emoji = percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪";

    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">퀴즈 완료!</h2>
        <p className="text-lg text-gray-600 mb-1">
          {total}문제 중 <span className="font-bold text-[#f97316]">{score}문제</span> 정답
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {percentage >= 80
            ? "배드민턴 규칙 마스터!"
            : percentage >= 60
              ? "조금만 더 공부하면 완벽해요!"
              : "튜토리얼을 다시 보고 도전해보세요!"}
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-[#f97316] text-white rounded-full font-semibold hover:bg-[#ea580c] transition-colors cursor-pointer"
        >
          튜토리얼로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[#f97316]">
          Q{currentQuestion + 1}/{QUIZ_QUESTIONS.length}
        </span>
        <span className="text-sm text-gray-500">
          정답: {correctCount}/{currentQuestion + (showResult ? 1 : 0)}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {question.question}
      </h3>

      <div className="flex flex-col gap-2 mb-4" role="radiogroup" aria-label="답변 선택">
        {question.options.map((option, i) => {
          let style = "bg-white border-gray-200 text-gray-700 hover:border-[#f97316]/50";
          if (showResult) {
            if (i === question.answer) {
              style = "bg-green-50 border-green-500 text-green-700";
            } else if (i === selectedAnswer && i !== question.answer) {
              style = "bg-red-50 border-red-500 text-red-700";
            } else {
              style = "bg-gray-50 border-gray-200 text-gray-400";
            }
          }
          return (
            <button
              key={`${currentQuestion}-${i}`}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              role="radio"
              aria-checked={selectedAnswer === i}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all min-h-[48px] ${style} ${!showResult ? "cursor-pointer" : ""}`}
            >
              <span className="mr-2 text-sm opacity-60">{i + 1}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {showResult && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 text-sm text-blue-800 animate-fade-in">
            {question.explanation}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-[#f97316] text-white rounded-full font-semibold hover:bg-[#ea580c] transition-colors flex items-center gap-1 cursor-pointer min-h-[44px]"
            >
              {currentQuestion < QUIZ_QUESTIONS.length - 1 ? "다음 문제" : "결과 보기"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
