import { ArrowIcon } from "@/components/ui/SplitButton/ArrowIcon";

interface FormSubmitButtonProps {
  label?: string;
  isLoading?: boolean;
  className?: string;
}

export function FormSubmitButton({
  label = "Submit",
  isLoading = false,
  className = "",
}: FormSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`flex w-full items-center overflow-hidden rounded-lg bg-mint disabled:opacity-70 ${className}`}
    >
      <span className="flex-1 py-3.5 text-center text-button font-medium uppercase tracking-wider text-white">
        {isLoading ? "Sending..." : label}
      </span>
      <span className="flex h-full items-center justify-center border-l border-white/20 px-4 py-3.5">
        <ArrowIcon className="h-3.5 w-3.5 text-white" />
      </span>
    </button>
  );
}
