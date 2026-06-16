import { FilterBar } from "@/components/display/Filterbar";
import { useEffect, useState } from "react";
import type { TabActions, VIEW_MODE } from "@/types/configuration.type";

export type PageFilterProps<T> = {
  entries: Array<T>;
  tabActions: Array<TabActions<T>>;
  setView: (mode: VIEW_MODE) => void;
  onChange: (datas: Array<T>) => void;
};

export function PageFilter<T extends Record<string, unknown>>({
  entries,
  tabActions,
  setView,
  onChange,
}: PageFilterProps<T>) {
  const [datas, setDatas] = useState<Array<T>>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filtered = datas.filter((data) => {
    let matchTab: boolean = false;
    for (let i = 0; i < tabActions.length; i++) {
      const tabAction = tabActions[i];
      matchTab =
        matchTab || (activeTab == tabAction.value && tabAction.action(data));
    }
    // Recherche générique sur toutes les propriétés string de l'objet
    const matchSearch =
      search === "" ||
      Object.values(data).some((value) => {
        if (value && typeof value === "string") {
          return value.toLowerCase().includes(search.toLowerCase());
        }
        return false;
      });
    return matchTab && matchSearch;
  });

  useEffect(() => {
    console.log("Données entrantes : ",entries);
    setDatas(entries);
  }, [entries]);

  useEffect(() => {
    onChange(filtered);
  }, [activeTab, search]);
  return (
    <div className="flex justify-between items-end gap-3 mb-6">
      <div className="flex-1">
        <FilterBar
          tabs={tabActions}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchPlaceholder="Rechercher une donnée..."
          searchValue={search}
          onSearchChange={setSearch}
          setMode={setView}
        />
      </div>
    </div>
  );
}
