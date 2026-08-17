interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export function FilterChips({ options, value, onChange, ariaLabel = "Filter options" }: FilterChipsProps) {
  return (
    <div className="admin-filter-chips" role="tablist" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`admin-filter-chip ${active ? "is-active" : ""}`}
          >
            {option.label}
            {typeof option.count === "number" && (
              <span className="admin-filter-chip-count">{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
