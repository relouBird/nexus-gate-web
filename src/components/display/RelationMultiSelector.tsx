import { getRelationLabel, isSameRelation } from "@/helpers/form.helper";
import { cn } from "@/utils/cn";
import { RelationLoadingState } from "./RelationLoadingState";

export function RelationMultiSelector<T extends Record<string, unknown>>({
  label,
  current,
  options,
  onChange,
  labelKey,
  loading,
}: {
  label: string;
  current: T[];
  options: T[];
  onChange: (items: T[]) => void;
  labelKey?: string;
  loading: boolean;
}) {
  function toggle(item: T) {
    const already = current.some((c) => isSameRelation(c, item));
    onChange(
      already
        ? current.filter((c) => !isSameRelation(c, item))
        : [...current, item],
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-input-label-text">{label}</span>
      {loading ? (
        <RelationLoadingState />
      ) : options.length === 0 ? (
        <p className="text-xs text-text-tertiary italic">
          Aucune option disponible
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((item, i) => {
            const selected = current.some((c) => isSameRelation(c, item));
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggle(item)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                  selected
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-background-50 text-text-secondary border-base-200 hover:border-primary-300 hover:text-primary-500",
                )}
              >
                {getRelationLabel(item, labelKey)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}