"use client";

interface StepIndicatorProps {
  readonly totalSteps: number;
  readonly currentStep: number;
}

export default function StepIndicator({
  totalSteps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === currentStep
              ? "w-8 bg-[#f97316]"
              : i < currentStep
                ? "w-2 bg-[#f97316]/40"
                : "w-2 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
