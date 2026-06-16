import { Breadcrumb } from "@/components/ui/Breadcrumb";

// Topbar.tsx
export function Topbar() {
  return (
    <header className="relative top-0 z-50 w-full border-b border-base-200 bg-background-50/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Breadcrumb />

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-1 pr-4 py-1.5 bg-background-soft-50 border cursor-pointer border-base-200 rounded-3xl">
          <button className="relative rounded-full size-9 bg-primary-100 grid place-items-center text-primary-500 font-semibold text-sm hover:bg-primary-200 transition-colors">
            RB
          </button>
          <div>
            <p className="text-sm font-medium text-title-50 font-mono">
              Relou Bird
            </p>
            <p className="text-xs text-title-50/60">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
