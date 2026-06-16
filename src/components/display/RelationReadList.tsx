import { getRelationLabel } from "@/helpers/form.helper";
import { ArrowAngularTopRight } from "@tailgrids/icons";

export function RelationReadList<T extends Record<string, unknown>>({
  label,
  items,
  labelKey,
  onClick,
}: {
  label: string;
  items: T[];
  labelKey?: string;
  onClick?: (label: string, item: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-input-label-text">{label}</span>
      {items.length === 0 ? (
        <p className="text-xs text-text-tertiary italic">Aucun élément lié</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className={
                "px-2.5 py-1 rounded-lg bg-primary-50 text-primary-500 text-xs font-medium border border-primary-200" +
                (onClick
                  ? " flex justify-center items-center gap-1 cursor-pointer"
                  : "")
              }
              onClick={() => onClick?.(label.toLocaleLowerCase(), item)}
            >
              <p>{getRelationLabel(item, labelKey)}</p>

              {onClick && (
                <p>
                  <ArrowAngularTopRight size={16} />
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
