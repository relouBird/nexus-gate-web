import { CRUD_ACTION } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Close, InfoSquare, MenuBento1, PenToSquare } from "@tailgrids/icons";
import { cn } from "@/utils/cn";
import { RelationReadList } from "../display/RelationReadList";
import { RelationReadObject } from "../display/RelationReadObject";
import { RelationMultiSelector } from "../display/RelationMultiSelector";
import { RelationMonoSelector } from "../display/RelationMonoSelector";

// ─── Types ────────────────────────────────────────────────────────────────────

type RelationItem = Record<string, unknown>;

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export type FieldConfig = {
  label?: string;
  type?: "text" | "number" | "email" | "textarea";
  placeholder?: string;
  required?: boolean;
};

type FormModalProps<T extends Record<string, unknown>> = {
  name: string;
  mode: CRUD_ACTION;
  setInitialMode: (data: CRUD_ACTION) => void;
  entrie: T | null;
  onClose: () => void;
  onAction?: (label: string, data: RelationItem) => void;
  onSubmit: (data: Partial<T>) => Promise<void> | void;
  /**
   * Champs exclus :
   * - READ     → visibles mais désactivés
   * - CREATE/UPDATE → complètement absents
   */
  excludeFields?: Array<keyof T>;
  /** Config optionnelle par champ (label, type, placeholder, required) */
  fieldsConfig?: Partial<Record<keyof T, FieldConfig>>;
  /**
   * Charge les options disponibles pour les relations.
   * Appelé uniquement en CREATE/UPDATE.
   */
  onLoad?: () => Promise<Record<string, RelationItem[]>>;
  /**
   * Clé à utiliser comme label pour les items de relation.
   * Défaut : cherche "name" → "label" → "code" → "title" → premier string
   */
  relationLabelKey?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function inferInputType(key: string, value: unknown): FieldConfig["type"] {
  if (typeof value === "number") return "number";
  if (key.toLowerCase().includes("email")) return "email";
  if (
    key.toLowerCase().includes("description") ||
    key.toLowerCase().includes("notes")
  )
    return "textarea";
  return "text";
}

// ─── Catégorisation des champs ────────────────────────────────────────────────

type FieldCategory<T extends Record<string, unknown>> =
  | { kind: "scalar"; key: string; value: unknown }
  | { kind: "relation-array"; key: string; value: T[] }
  | { kind: "relation-object"; key: string; value: T };

function categorizeFields<T extends Record<string, unknown>>(
  entrie: T,
  excludeFields: Array<keyof T>,
  mode: CRUD_ACTION,
): FieldCategory<T>[] {
  const isRead = mode === CRUD_ACTION.READ;

  return Object.entries(entrie)
    .filter(([key]) => {
      const isExcluded = excludeFields.includes(key as keyof T);
      // En CREATE/UPDATE → les exclus disparaissent
      // En READ → les exclus restent (read-only)
      if (!isRead && isExcluded) return false;
      return true;
    })
    .map(([key, value]): FieldCategory<T> | null => {
      if (Array.isArray(value)) {
        // Tableau de primitifs → ignoré (pas géré ici)
        if (value.length > 0 && typeof value[0] !== "object") return null;
        return { kind: "relation-array", key, value: value as T[] };
      }
      if (value !== null && typeof value === "object") {
        return { kind: "relation-object", key, value: value as T };
      }
      return { kind: "scalar", key, value };
    })
    .filter((f): f is FieldCategory<T> => f !== null);
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function GenericFormModal<T extends Record<string, unknown>>({
  name,
  mode: initialMode,
  setInitialMode,
  entrie,
  onClose,
  onSubmit,
  excludeFields = [],
  fieldsConfig = {},
  onLoad,
  onAction,
  relationLabelKey,
}: FormModalProps<T>) {
  const [mode, setMode] = useState<CRUD_ACTION>(initialMode);
  const [scalarForm, setScalarForm] = useState<Record<string, string>>({});
  const [relationForm, setRelationForm] = useState<
    Record<string, RelationItem[] | RelationItem | null>
  >({});
  const [relationOptions, setRelationOptions] = useState<
    Record<string, RelationItem[]>
  >({});
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [submitting, setSubmitting] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const isRead = mode === CRUD_ACTION.READ;
  const isUpdate = mode === CRUD_ACTION.UPDATE;

  // ─── Init depuis entrie ──────────────────────────────────────────────────

  useEffect(() => {
    if (!entrie) return;
    const scalars: Record<string, string> = {};
    const relations: Record<string, T[] | T | null> = {};

    for (const [key, value] of Object.entries(entrie)) {
      if (Array.isArray(value)) {
        relations[key] = value as T[];
      } else if (value !== null && typeof value === "object") {
        relations[key] = value as T;
      } else {
        scalars[key] =
          value !== undefined && value !== null ? String(value) : "";
      }
    }
    setScalarForm(scalars);
    setRelationForm(relations);
    setErrors({});
  }, [entrie, mode]);

  // ─── Load options relations ──────────────────────────────────────────────

  useEffect(() => {
    if (isRead || !onLoad) return;
    setLoadingRelations(true);
    onLoad()
      .then(setRelationOptions)
      .catch(() => setRelationOptions({}))
      .finally(() => setLoadingRelations(false));
  }, [mode]);

  // ─── Escape + scroll lock ────────────────────────────────────────────────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, []);

  // ─── Champs catégorisés ──────────────────────────────────────────────────

  const fields = entrie ? categorizeFields(entrie, excludeFields, mode) : [];

  // ─── Validation ─────────────────────────────────────────────────────────

  function validate(): ValidationErrors<T> {
    const errs: ValidationErrors<T> = {};
    if (isRead) return errs;

    for (const field of fields) {
      if (field.kind !== "scalar") continue;
      const isExcluded = excludeFields.includes(field.key as keyof T);
      if (isExcluded) continue;

      const cfg = fieldsConfig[field.key as keyof T];
      if (!(cfg?.required ?? true)) continue;

      const val = (scalarForm[field.key] ?? "").trim();
      if (!val) {
        errs[field.key as keyof T] =
          `Le champ « ${humanize(field.key)} » est requis`;
      } else if (val.length < 2) {
        errs[field.key as keyof T] = "Minimum 2 caractères";
      }
    }
    return errs;
  }

  // ─── Submit ──────────────────────────────────────────────────────────────

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const data: Partial<T> = {};

      for (const [key, value] of Object.entries(scalarForm)) {
        if (excludeFields.includes(key as keyof T)) continue;
        const cfg = fieldsConfig[key as keyof T];
        const type = cfg?.type ?? inferInputType(key, entrie?.[key]);
        (data as Record<string, unknown>)[key] =
          type === "number" ? Number(value) : value.trim();
      }

      for (const [key, value] of Object.entries(relationForm)) {
        if (excludeFields.includes(key as keyof T)) continue;
        (data as Record<string, unknown>)[key] = value;
      }

      if (isUpdate && entrie?.id !== undefined) {
        (data as Record<string, unknown>)["id"] = entrie.id;
      }

      await onSubmit(data);
      onClose();
    } catch {
      // géré par le parent
    } finally {
      setSubmitting(false);
    }
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-100/40 backdrop-blur-sm px-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="generic-modal-title"
        className="w-full max-w-2xl rounded-2xl border border-base-200 bg-background-50 shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-base-200 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "size-9 rounded-lg grid place-items-center",
                isUpdate
                  ? "bg-warning-50 text-warning-500"
                  : isRead
                    ? "bg-success-50 text-success-500"
                    : "bg-primary-50 text-primary-500",
              )}
            >
              {isUpdate ? (
                <PenToSquare className="size-5" />
              ) : isRead ? (
                <MenuBento1 className="size-5" />
              ) : (
                <InfoSquare className="size-5" />
              )}
            </div>
            <div>
              <h2
                id="generic-modal-title"
                className="text-base font-semibold text-title-50"
              >
                {isUpdate
                  ? `Modifier : ${name}`
                  : isRead
                    ? `Détail : ${name}`
                    : `Nouveau : ${name}`}
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {isRead || isUpdate
                  ? String(entrie?.label ?? entrie?.name ?? entrie?.code ?? "")
                  : "Remplissez les informations ci-dessous"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            appearance="fill"
            onClick={onClose}
            iconOnly
            disabled={submitting}
          >
            <Close className="size-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {fields.map((field, index) => {
            const cfg = fieldsConfig[field.key as keyof T] ?? {};
            const label = cfg.label ?? humanize(field.key);
            const isExcluded = excludeFields.includes(field.key as keyof T);

            // Relation tableau
            if (field.kind === "relation-array") {
              if (isRead) {
                return (
                  <RelationReadList<T>
                    key={field.key}
                    label={label}
                    items={field.value}
                    labelKey={relationLabelKey}
                    onClick={onAction}
                  />
                );
              }
              return (
                <RelationMultiSelector<RelationItem>
                  key={field.key}
                  label={label}
                  current={(relationForm[field.key] as RelationItem[]) ?? []}
                  options={relationOptions[label.toLocaleLowerCase()] ?? []}
                  onChange={(items) =>
                    setRelationForm((f) => ({ ...f, [field.key]: items }))
                  }
                  labelKey={relationLabelKey}
                  loading={loadingRelations}
                />
              );
            }

            // Relation objet
            if (field.kind === "relation-object") {
              if (isRead) {
                return (
                  <RelationReadObject<T>
                    key={field.key}
                    label={label}
                    item={field.value}
                    labelKey={relationLabelKey}
                    onClick={onAction}
                  />
                );
              }
              return (
                <RelationMonoSelector<RelationItem>
                  key={field.key}
                  label={label}
                  current={(relationForm[field.key] as T) ?? null}
                  options={relationOptions[label.toLocaleLowerCase()] ?? []}
                  onChange={(item) =>
                    setRelationForm((f) => ({ ...f, [field.key]: item }))
                  }
                  labelKey={relationLabelKey}
                  loading={loadingRelations}
                />
              );
            }

            // Scalaire
            const type = cfg.type ?? inferInputType(field.key, field.value);
            const placeholder =
              cfg.placeholder ?? `Ex : ${label.toLowerCase()}`;
            const disabled = submitting || isRead || (isUpdate && isExcluded);
            const error = errors[field.key as keyof T];
            const isFirst = index === 0;

            const inputClass = cn(
              "w-full rounded-lg border px-3 text-sm bg-input-background text-title-50 placeholder:text-input-placeholder-text",
              "focus:outline-none focus:ring-2 transition-colors",
              disabled && "opacity-60 cursor-default",
              error
                ? "border-error-500 focus:border-input-error-focus-border focus:ring-error-500/20"
                : "border-base-200 focus:border-input-primary-focus-border focus:ring-primary-500/20",
            );

            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`field-${field.key}`}
                  className="text-sm font-medium text-input-label-text"
                >
                  {label}
                  {!isExcluded && !isRead && (cfg.required ?? true) && (
                    <span className="text-error-500 ml-0.5">*</span>
                  )}
                </label>

                {type === "textarea" ? (
                  <textarea
                    id={`field-${field.key}`}
                    ref={
                      isFirst
                        ? (firstInputRef as React.RefObject<HTMLTextAreaElement>)
                        : undefined
                    }
                    value={scalarForm[field.key] ?? ""}
                    onChange={(e) =>
                      setScalarForm((f) => ({
                        ...f,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={3}
                    className={cn(inputClass, "h-auto resize-none py-2")}
                  />
                ) : (
                  <input
                    id={`field-${field.key}`}
                    ref={
                      isFirst
                        ? (firstInputRef as React.RefObject<HTMLInputElement>)
                        : undefined
                    }
                    type={type}
                    value={scalarForm[field.key] ?? ""}
                    onChange={(e) => {
                      setScalarForm((f) => ({
                        ...f,
                        [field.key]: e.target.value,
                      }));
                      setErrors((err) => ({ ...err, [field.key]: undefined }));
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(inputClass, "h-10")}
                  />
                )}

                {error && <p className="text-xs text-error-500">{error}</p>}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-base-200 bg-background-soft-50 shrink-0">
          <button
            onClick={onClose}
            disabled={submitting}
            className="h-9 px-4 rounded-lg text-sm font-medium text-foreground-soft-500 border border-base-200 bg-background-50 hover:bg-background-soft-100 hover:text-title-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>

          {isRead ? (
            <button
              type="button"
              onClick={() => {
                setMode(CRUD_ACTION.UPDATE);
                setInitialMode(CRUD_ACTION.UPDATE);
              }}
              className="h-9 px-4 rounded-lg text-sm font-medium text-white bg-warning-500 hover:bg-warning-600 transition-colors flex items-center gap-2"
            >
              <PenToSquare className="size-4" />
              Modifier
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={cn(
                "h-9 px-4 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-60 flex items-center gap-2",
                isUpdate
                  ? "bg-warning-500 hover:bg-warning-600"
                  : "bg-primary-500 hover:bg-primary-600",
              )}
            >
              {submitting && (
                <svg
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {isUpdate ? "Enregistrer" : "Créer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
