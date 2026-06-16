import { VIEW_MODE } from "@/types/configuration.type";
import { Message2Reversed } from "@tailgrids/icons";
import ListView from "../display/ListView";
import GridView from "../display/GridView";

export type PageContentProps<T> = {
  entries: Array<T>;
  mode: VIEW_MODE;
  onDelete: (data: T) => void;
  onEdit: (data: T) => void;
  onView: (data: T) => void;
  excludeFields: (keyof T)[] | undefined;
};

export default function PageContent<T extends Record<string, unknown>>({
  entries,
  mode,
  onDelete,
  onEdit,
  onView,
  excludeFields,
}: PageContentProps<T>) {
  return (
    <>
      {entries.length === 0 ? (
        <div className="rounded-xl border border-base-200 bg-background-50 shadow-xs flex flex-col items-center justify-center py-16 gap-3">
          <Message2Reversed className="size-10 text-text-tertiary" />
          <p className="text-sm text-text-secondary">Aucun Indicateur trouvé</p>
        </div>
      ) : mode === VIEW_MODE.LIST ? (
        <ListView<T>
          entries={entries}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
          excludeFields={excludeFields}
        />
      ) : (
        <GridView<T>
          entries={entries}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
