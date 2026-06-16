import { isSameRelation, getRelationLabel } from "@/helpers/form.helper";
import { cn } from "@/utils/cn";
import { RelationLoadingState } from "./RelationLoadingState";

export function RelationMonoSelector<T extends Record<string, unknown>>({
  label,
  current,
  options,
  onChange,
  labelKey,
  loading,
}: {
  label: string;
  current: T | null;
  options: T[];
  onChange: (item: T | null) => void;
  labelKey?: string;
  loading: boolean;
}) {
  function select(item: T) {
    // Reclique sur le sélectionné → désélectionner
    onChange(current && isSameRelation(current, item) ? null : item);
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
            const selected = current ? isSameRelation(current, item) : false;
            return (
              <button
                key={i}
                type="button"
                onClick={() => select(item)}
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
