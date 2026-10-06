"use client";

interface StepIndicatorProps {
  readonly totalSteps: number;
  readonly currentStep: number;
  readonly onStepClick: (step: number) => void;
}

export default function StepIndicator({ totalSteps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav className="flex items-center justify-center" aria-label="튜토리얼 단계">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onStepClick(i)}
          aria-current={i === currentStep ? "step" : undefined}
          aria-label={`${i + 1}단계로 이동`}
          // 24px hit area around a small visual dot
          className="h-6 px-[3px] flex items-center justify-center cursor-pointer group"
        >
          <span
            className={`block h-2.5 rounded-full transition-all duration-300 ${
              i === currentStep
                ? "w-7 bg-[#f97316]"
                : i < currentStep
                  ? "w-2.5 bg-[#f97316]/40 group-hover:bg-[#f97316]/60"
                  : "w-2.5 bg-gray-300 group-hover:bg-gray-400"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
