import {
  Search1,
  Calendar,
  Xmark,
  MusicList2,
  DashboardSquare1,
} from "@tailgrids/icons";
import { cn } from "@/utils/cn";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "../ui/Button";
import { useState } from "react";
import { VIEW_MODE, type Tab } from "@/types/configuration.type";

type FilterBarProps = {
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  setMode: (mode: VIEW_MODE) => void;
  showDateRange?: boolean;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  onDateFromChange?: (value: Date | null) => void;
  onDateToChange?: (value: Date | null) => void;
};

export function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  searchPlaceholder = "Rechercher...",
  searchValue = "",
  onSearchChange,
  showDateRange = false,
  dateFrom = null,
  dateTo = null,
  setMode,
  onDateFromChange,
  onDateToChange,
}: FilterBarProps) {
  const [viewMode, setViewMode] = useState<VIEW_MODE>(VIEW_MODE.LIST);
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="flex items-center gap-1 bg-background-soft-100 rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange?.(tab.value)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.value
                  ? "bg-background-50 text-primary-500 shadow-xs"
                  : "text-foreground-soft-500 hover:text-title-50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between items-end gap-3 mb-6">
        <div className="flex-1">
          {/* Search + Date range */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            {onSearchChange && (
              <div className="relative flex-1 min-w-64">
                <Search1 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary pointer-events-none" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-10 pl-9 pr-9 rounded-lg border border-base-200 bg-background-50 text-sm text-title-50 placeholder:text-text-tertiary focus:outline-none focus:border-input-primary-focus-border focus:ring-2 focus:ring-primary-500/20 transition-colors"
                />
                {searchValue && (
                  <Button
                    variant="ghost"
                    iconOnly
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => onSearchChange("")}
                  >
                    <Xmark className="size-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Date range */}
            {showDateRange && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary pointer-events-none" />
                  <label htmlFor="dateFrom">From :</label>
                  <DatePicker
                    value={dateFrom}
                    onChange={onDateFromChange}
                    placeholder="Pick a date"
                  />
                </div>
                <span className="text-text-tertiary text-sm">→</span>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary pointer-events-none" />
                  <label htmlFor="dateTo">To :</label>

                  <DatePicker
                    value={dateTo}
                    onChange={onDateToChange}
                    placeholder="Pick a date"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Toggle liste / grille */}
        <div className="flex items-center gap-1 bg-background-soft-100 rounded-xl p-1 mb-px">
          <button
            onClick={() => {
              setViewMode(VIEW_MODE.LIST);
              setMode(VIEW_MODE.LIST);
            }}
            title="Vue liste"
            className={`size-8 rounded-lg grid place-items-center transition-all ${
              viewMode === VIEW_MODE.LIST
                ? "bg-background-50 text-primary-500 shadow-xs"
                : "text-text-tertiary hover:text-title-50"
            }`}
          >
            <MusicList2 className="size-4" />
          </button>
          <button
            onClick={() => {
              setViewMode(VIEW_MODE.GRID);
              setMode(VIEW_MODE.GRID);
            }}
            title="Vue grille"
            className={`size-8 rounded-lg grid place-items-center transition-all ${
              viewMode === VIEW_MODE.GRID
                ? "bg-background-50 text-primary-500 shadow-xs"
                : "text-text-tertiary hover:text-title-50"
            }`}
          >
            <DashboardSquare1 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
