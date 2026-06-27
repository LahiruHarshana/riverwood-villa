export function Spinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-[2.5px]",
    lg: "w-8 h-8 border-[3px]",
  };

  return (
    <span
      className={`inline-block rounded-full border-[var(--ra-line-strong)] border-t-[var(--ra-sage)] animate-spin ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
