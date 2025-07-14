import { cn } from "@/lib/utils";

export const SuccessAnimation = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative h-24 w-24", className)}>
      <svg className="h-full w-full" viewBox="0 0 52 52">
        <circle
          className="stroke-current text-primary/30"
          cx="26"
          cy="26"
          r="25"
          fill="none"
          strokeWidth="2"
        />
        <path
          className="animate-checkmark stroke-current text-primary"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 27l6 6 15-15"
        />
      </svg>
    </div>
  );
};
