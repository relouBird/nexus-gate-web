import { cn } from "@/utils/cn";
import { IndicatorMenu } from "./Menu";
import { dateFormat } from "@/helpers";

// types/list-view.types.ts
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
  width?: string;
  align?: "left" | "center" | "right";
  badge?: boolean;
  prefix?: string;
  suffix?: string;
};

export type ListViewProps<T> = {
  entries: T[];
  onEdit: (data: T) => void;
  onDelete: (data: T) => void;
  onView: (data: T) => void;
  fieldOrder?: Array<keyof T>;
  excludeFields?: Array<keyof T>;
};

// ─── Détecteur de type intelligent ──────────────────────────────────────────────
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

function ListView<T extends Record<string, unknown>>({
  entries,
  onEdit,
  onDelete,
  onView,
  fieldOrder,
  excludeFields = [],
}: ListViewProps<T>) {
  // Analyser la structure du premier élément pour configurer les champs
  const analyzeFields = (item: T): FieldConfig[] => {
    const fields: FieldConfig[] = [];

    for (const [key, value] of Object.entries(item)) {
      if (excludeFields.includes(key)) continue;

      const type = detectFieldType(value);

      let width = "w-auto flex-1";
      let align: "left" | "center" | "right" = "left";
      let badge = false;
      let prefix = "";
      const suffix = "";

      switch (key) {
        case "id":
        case "code":
          width = "w-1/8";
          align = "left";
          badge = true;
          prefix = "#";
          break;
        case "label":
        case "nom":
        case "name":
        case "title":
          width = "w-1/5";
          align = "center";
          break;
        case "type":
        case "status":
        case "category":
          width = "w-1/6";
          align = "center";
          badge = true;
          break;
        default:
          if (type === "date") {
            width = "w-1/5";
            align = "center";
          } else if (type === "number") {
            width = "w-1/12";
            align = "right";
          } else if (type === "string") {
            width = "w-2/12";
            align = "center";
          } else if (type === "object") {
            width = "w-3/12";
            align = "center";
          } else if (type === "array") {
            width = "w-2/12";
            align = "center";
          } else if (type === "boolean") {
            width = "w-1/12";
            align = "center";
          }
      }

      fields.push({
        name: key,
        type,
        width,
        align,
        badge,
        prefix,
        suffix,
      });
    }

    // Ordonner les champs selon fieldOrder ou l'ordre détecté
    if (fieldOrder) {
      return fields.sort((a, b) => {
        const aIndex = fieldOrder.indexOf(a.name);
        const bIndex = fieldOrder.indexOf(b.name);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return 0;
      });
    }

    return fields;
  };

  const fields = entries.length > 0 ? analyzeFields(entries[0]) : [];

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

  const getAlignClass = (align?: string): string => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
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
    <div className="rounded-xl border border-base-200 bg-background-50 shadow-xs">
      <ul className="divide-y divide-base-200">
        {entries.map((entrie, index) => {
          const id = String(entrie.id) || String(entrie.code) || index;

          return (
            <li
              key={id}
              onClick={() => onView(entrie)}
              className="flex justify-between items-center gap-4 px-5 py-4 hover:bg-background-soft-50 transition-colors cursor-pointer"
            >
              <div className="w-full flex items-center justify-start">
                {fields.map((field) => {
                  const value = entrie[field.name];
                  const displayValue = formatDisplayValue(value, field);

                  const seeColorArray =
                    Array.isArray(value) && value.length > 0 ? true : false;

                  return (
                    <div
                      key={field.name}
                      className={cn("min-w-0", field.width)}
                    >
                      {field.badge ? (
                        <div
                          className={cn(
                            "grid place-items-center",
                            getAlignClass(field.align),
                          )}
                        >
                          <div
                            className={cn(
                              "inline-flex items-center font-medium text-xs",
                              field.name === "code" || field.name === "id"
                                ? "rounded-full bg-primary-100 text-secondary-500/40 px-1.5 py-0.5"
                                : "rounded-full bg-base-100 text-text-secondary px-2 py-0.5",
                            )}
                          >
                            {field.prefix}
                            {displayValue}
                            {field.suffix}
                          </div>
                        </div>
                      ) : field.type === "date" ? (
                        <p
                          className={cn(
                            "text-xs text-text-secondary truncate",
                            getAlignClass(field.align),
                          )}
                        >
                          {displayValue}
                        </p>
                      ) : field.type === "number" ? (
                        <p
                          className={cn(
                            "text-sm font-semibold text-title-50",
                            getAlignClass(field.align),
                          )}
                        >
                          {displayValue}
                        </p>
                      ) : field.type === "array" ? (
                        <p
                          className={cn(
                            "text-sm text-title-50 truncate",
                            getAlignClass(field.align),
                          )}
                        >
                          <span
                            className={
                              seeColorArray
                                ? "bg-success-50 text-success-600"
                                : "bg-background-soft-100 text-text-tertiary"
                            }
                          >
                            {displayValue}
                          </span>
                        </p>
                      ) : field.type === "object" ? (
                        <p
                          className={cn(
                            "text-sm text-title-50 truncate",
                            getAlignClass(field.align),
                          )}
                        >
                          <span
                            className={
                              displayValue.length > 5
                                ? "bg-success-50 text-success-600"
                                : "bg-background-soft-100 text-text-tertiary"
                            }
                          >
                            {displayValue}
                          </span>
                        </p>
                      ) : (
                        <p
                          className={cn(
                            "text-sm text-title-50 truncate",
                            getAlignClass(field.align),
                          )}
                        >
                          {displayValue}
                        </p>
                      )}
                    </div>
                  );
                })}
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ListView;
