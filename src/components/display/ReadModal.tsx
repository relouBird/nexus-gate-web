// components/modals/ReadModal.tsx
import { Close, MenuBento1 } from "@tailgrids/icons";
import { useRef, useEffect, type ReactNode } from "react";
import { Button } from "../ui/Button";

type ReadModalProps<T> = {
  title: string;
  subtitle?: string;
  items: T[]; // éléments à afficher
  renderItem: (item: T, index: number) => ReactNode; // rendu personnalisé
  getKey?: (item: T, index: number) => string | number;
  onClose: () => void;
};

export function ReadModal<T>({
  title,
  subtitle,
  items,
  renderItem,
  getKey = (_, i) => i,
  onClose,
}: ReadModalProps<T>) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => firstItemRef.current?.focus(), 50);
  }, []);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-100/40 backdrop-blur-sm px-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl rounded-2xl border border-base-200 bg-background-50 shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header - inchangé */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-base-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg grid place-items-center bg-primary-50 text-primary-500">
              <MenuBento1 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-title-50">{title}</h2>
              {subtitle && (
                <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" appearance="fill" onClick={onClose} iconOnly>
            <Close className="size-4" />
          </Button>
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex gap-3">
          {items.map((item, idx) => (
            <div
              key={getKey(item, idx)}
              ref={idx === 0 ? firstItemRef : undefined}
            >
              {renderItem(item, idx)}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center text-text-tertiary py-8">
              Aucun élément à afficher
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
