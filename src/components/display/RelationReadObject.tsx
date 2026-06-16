import { getRelationLabel } from "@/helpers/form.helper";
import { ArrowAngularTopRight } from "@tailgrids/icons";

export function RelationReadObject<T extends Record<string, unknown>>({
  label,
  item,
  labelKey,
  onClick,
}: {
  label: string;
  item: T;
  labelKey?: string;
  onClick?: (label: string, item: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-input-label-text">{label}</span>
      <span
        className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-500 text-xs font-medium border border-primary-200 w-fit"
        onClick={() => onClick?.(label.toLocaleLowerCase(), item)}
      >
        {getRelationLabel(item, labelKey)}
        {onClick && <ArrowAngularTopRight />}
      </span>
    </div>
  );
}