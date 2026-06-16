import { useEffect, useRef, useState } from "react";
import { Close, PenToSquare } from "@tailgrids/icons";
import { cn } from "@/utils/cn";
import type { CatType } from "@/types/cat.type";
import CatIcon from "./CatIcon";
import { Button } from "../ui/Button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "create" | "update";

type Props = {
  mode: Mode;
  cat?: CatType; // obligatoire en mode update
  onClose: () => void;
  onSubmit: (data: Partial<CatType>) => Promise<void> | void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INITIAL_FORM = { name: "", age: "" };

function getInitialForm(mode: Mode, cat?: CatType) {
  if (mode === "update" && cat) {
    return { name: cat.name, age: String(cat.age) };
  }
  return INITIAL_FORM;
}

// ─── Composant ────────────────────────────────────────────────────────────────

export function CatFormModal({ mode, cat, onClose, onSubmit }: Props) {
  const [form, setForm] = useState(() => getInitialForm(mode, cat));
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus auto sur le premier champ
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Fermer sur Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Bloquer le scroll du body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ─── Validation ─────────────────────────────────────────────────────────────

  function validate() {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Le nom est requis.";
    else if (form.name.trim().length < 2) errs.name = "Minimum 2 caractères.";

    const age = Number(form.age);
    if (!form.age) errs.age = "L'âge est requis.";
    else if (isNaN(age) || age < 0) errs.age = "Âge invalide.";
    else if (age > 30) errs.age = "Un chat ne peut pas avoir plus de 30 ans.";

    return errs;
  }

  // ─── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      if (mode === "update" && cat) {
        await onSubmit({
          id: cat.id,
          name: form.name.trim(),
          age: Number(form.age),
          createdAt: cat.createdAt,
        });
      } else {
        await onSubmit({ name: form.name.trim(), age: Number(form.age) });
      }
      onClose();
    } catch {
      // L'erreur est gérée par le parent via notify
    } finally {
      setLoading(false);
    }
  }

  // ─── Overlay click ──────────────────────────────────────────────────────────

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  // ─── UI ─────────────────────────────────────────────────────────────────────

  const isUpdate = mode === "update";

  return (
    /* Overlay */
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-100/40 backdrop-blur-sm px-4"
    >
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-modal-title"
        className="w-full max-w-md rounded-2xl border border-base-200 bg-background-50 shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "size-9 rounded-lg grid place-items-center",
                isUpdate
                  ? "bg-warning-50 text-warning-500"
                  : "bg-primary-50 text-primary-500",
              )}
            >
              {isUpdate ? (
                <PenToSquare className="size-5" />
              ) : (
                <CatIcon className="size-5" />
              )}
            </div>
            <div>
              <h2
                id="cat-modal-title"
                className="text-base font-semibold text-title-50"
              >
                {isUpdate ? "Modifier le chat" : "Nouveau chat"}
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {isUpdate
                  ? `Modification de « ${cat?.name} »`
                  : "Remplissez les informations ci-dessous"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            appearance="fill"
            onClick={onClose}
            disabled={loading}
            className="size-8 rounded-lg grid place-items-center text-text-tertiary hover:bg-background-soft-100 hover:text-title-50 transition-colors disabled:opacity-50"
          >
            <Close className="size-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Champ Nom */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="cat-name"
              className="text-sm font-medium text-input-label-text"
            >
              Nom <span className="text-error-500">*</span>
            </label>
            <input
              id="cat-name"
              ref={firstInputRef}
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                if (errors.name)
                  setErrors((er) => ({ ...er, name: undefined }));
              }}
              placeholder="Ex : Moustache"
              disabled={loading}
              className={cn(
                "h-10 w-full rounded-lg border px-3 text-sm bg-input-background text-title-50 placeholder:text-input-placeholder-text",
                "focus:outline-none focus:ring-2 transition-colors disabled:opacity-60",
                errors.name
                  ? "border-error-500 focus:border-input-error-focus-border focus:ring-error-500/20"
                  : "border-base-200 focus:border-input-primary-focus-border focus:ring-primary-500/20",
              )}
            />
            {errors.name && (
              <p className="text-xs text-error-500">{errors.name}</p>
            )}
          </div>

          {/* Champ Âge */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="cat-age"
              className="text-sm font-medium text-input-label-text"
            >
              Âge <span className="text-error-500">*</span>
            </label>
            <input
              id="cat-age"
              type="number"
              min={0}
              max={30}
              value={form.age}
              onChange={(e) => {
                setForm((f) => ({ ...f, age: e.target.value }));
                if (errors.age) setErrors((er) => ({ ...er, age: undefined }));
              }}
              placeholder="Ex : 3"
              disabled={loading}
              className={cn(
                "h-10 w-full rounded-lg border px-3 text-sm bg-input-background text-title-50 placeholder:text-input-placeholder-text",
                "focus:outline-none focus:ring-2 transition-colors disabled:opacity-60",
                errors.age
                  ? "border-error-500 focus:border-input-error-focus-border focus:ring-error-500/20"
                  : "border-base-200 focus:border-input-primary-focus-border focus:ring-primary-500/20",
              )}
            />
            {errors.age && (
              <p className="text-xs text-error-500">{errors.age}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-base-200 bg-background-soft-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="h-9 px-4 rounded-lg text-sm font-medium text-foreground-soft-500 border border-base-200 bg-background-50 hover:bg-background-soft-100 hover:text-title-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={cn(
              "h-9 px-4 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-60 flex items-center gap-2",
              isUpdate
                ? "bg-warning-500 hover:bg-warning-600"
                : "bg-primary-500 hover:bg-primary-600",
            )}
          >
            {loading && (
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
        </div>
      </div>
    </div>
  );
}
