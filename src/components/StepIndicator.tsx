"use client";

interface StepIndicatorProps {
  readonly totalSteps: number;
  readonly currentStep: number;
  readonly onStepClick: (step: number) => void;
}

export default function StepIndicator({
  totalSteps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1.5" role="tablist" aria-label="튜토리얼 단계">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <button
          key={i}
          onClick={() => onStepClick(i)}
          role="tab"
          aria-selected={i === currentStep}
          aria-label={`${i + 1}단계`}
          className={`rounded-full transition-all duration-300 min-w-[20px] min-h-[20px] flex items-center justify-center cursor-pointer ${
            i === currentStep
              ? "w-8 h-2.5 bg-[#f97316]"
              : i < currentStep
                ? "w-2.5 h-2.5 bg-[#f97316]/40 hover:bg-[#f97316]/60"
                : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
          }`}
        />
      ))}
    </div>
  );
}
