import { dateFormat } from "@/helpers";
import { IndicatorMenu } from "./Menu";

export type GridViewProps<T> = {
  entries: T[];
  onEdit: (data: T) => void;
  onDelete: (data: T) => void;
  onView: (data: T) => void;
};

function detectFieldType(value: unknown): FieldConfig["type"] {
  if (value === null || value === undefined) return "unknown";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (typeof value === "string") {
    // Détection de date
    if (!isNaN(new Date(value).getTime()) && value.includes("-")) return "date";
    return "string";
  }
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  return "unknown";
}

// types/grid-view.types.ts
export type FieldConfig = {
  name: string;
  type:
    | "string"
    | "number"
    | "date"
    | "boolean"
    | "array"
    | "object"
    | "unknown";
  value: unknown;
};

function getDetailField(field: FieldConfig): string {
  if (
    field.type == "string" &&
    (field.name == "label" ||
      field.name == "nom" ||
      field.name == "name" ||
      field.name == "title")
  ) {
    return "title";
  } else if (field.name == "id" || field.name == "code") {
    return "id";
  } else if (field.type == "array") {
    return "tab";
  } else if (field.type == "object") {
    return "obj";
  }
  return "default";
}

// ─── Vue grille ───────────────────────────────────────────────────────────────
export default function GridView<T extends Record<string, unknown>>({
  entries,
  onEdit,
  onDelete,
  onView,
}: GridViewProps<T>) {
  // Analyse Chaque Champs
  const analyzeFields = (item: T): FieldConfig[] => {
    const fields: FieldConfig[] = [];

    for (const [key, value] of Object.entries(item)) {
      const type = detectFieldType(value);

      fields.push({
        name: key,
        type,
        value,
      });
    }

    return fields;
  };

  const fields = entries.length > 0 ? analyzeFields(entries[0]) : [];

  const titleFields = fields.filter(
    (field) => getDetailField(field) == "title",
  );

  const idFields = fields.filter((field) => getDetailField(field) == "id");

  const arrayFields = fields.filter((field) => getDetailField(field) == "tab");

  const objFields = fields.filter((field) => getDetailField(field) == "obj");

  const getName = (obj: object | null | undefined): string => {
    if (!obj) return "";

    // On cast en Record<string, any> pour pouvoir lire les clés
    const data = obj as Record<string, string>;

    return data.name ?? data.nom ?? "";
  };

  const formatDisplayValue = (value: unknown, config: FieldConfig): string => {
    if (value === null || value === undefined) return "-";

    switch (config.type) {
      case "date":
        return dateFormat(String(value), "DD/MM/YYYY HH:mm");
      case "boolean":
        return value ? "Oui" : "Non";
      case "array":
        return `${Array.isArray(value) ? value.length : 0} ${config.name}`;
      case "object":
        return getName(value);
      default:
        return String(value);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-base-200 bg-background-50 shadow-xs">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <p className="text-sm text-text-secondary">
            Aucune donnée disponible
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {entries.map((entrie, index) => {
        const id = String(entrie.id) || String(entrie.code) || index;
        return (
          <div
            key={id}
            className="rounded-xl border border-base-200 bg-background-50 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer p-5 flex flex-col gap-3"
            onClick={() => onView(entrie)}
          >
            <div className="flex items-start justify-between">
              {/* <div className="size-12 rounded-xl bg-primary-100 grid place-items-center text-primary-500 font-bold text-lg shrink-0">
              {indicateur.code.charAt(0).toUpperCase()}
            </div> */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-title-50 line-clamp-2">
                  {titleFields.map((field, titleKey) => {
                    return (
                      <span key={"TITLE" + titleKey}>
                        {formatDisplayValue(entrie[field.name], field)}
                      </span>
                    );
                  })}
                </p>
                <p className="text-xs text-text-secondary mt-1 font-mono">
                  {idFields.map((field, idKey) => {
                    const detailsAdd = idFields.length - idKey - 1 > 0;
                    return (
                      <span key={"ID" + idKey}>
                        #{formatDisplayValue(entrie[field.name], field)}
                        <span className="px-1">{detailsAdd ? "-" : ""}</span>
                      </span>
                    );
                  })}
                </p>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <IndicatorMenu
                  onView={() => onView(entrie)}
                  onEdit={() => onEdit(entrie)}
                  onDelete={() => onDelete(entrie)}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-base-200 flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Jointure:</span>

              <div className="flex items-center justify-end gap-0.5">
                {arrayFields.map((field, arrayKey) => {
                  const seeColorArray =
                    Array.isArray(field.value) && field.value.length > 0
                      ? true
                      : false;
                  return (
                    <span
                      key={"ARRAY" + arrayKey}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        seeColorArray
                          ? "bg-success-50 text-success-600"
                          : "bg-background-soft-100 text-text-tertiary"
                      }`}
                    >
                      {formatDisplayValue(entrie[field.name], field)}
                    </span>
                  );
                })}

                {objFields.map((field, arrayKey) => {
                  return (
                    <span
                      key={"OBJ" + arrayKey}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium bg-success-50 text-success-600`}
                    >
                      {formatDisplayValue(entrie[field.name], field)}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
