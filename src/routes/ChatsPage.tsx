import { FilterBar} from "@/components/display/Filterbar";
import { useSeoHead } from "@/composables/useSeoHead";
import { useNotify } from "@/helpers/notifications.helper";
import { useCatStore } from "@/stores/cat.store";
import type { CatType } from "@/types/cat.type";
import { useEffect, useRef, useState } from "react";
import { useStore } from "zustand";

import { Message2Reversed, MenuKebab1, Plus } from "@tailgrids/icons";
import { Button } from "@/components/ui/Button";
import { CatFormModal } from "@/components/utils/CatFormModal";
import type { Tab } from "@/types/configuration.type";

const TABS: Tab[] = [
  { label: "Tous", value: "all" },
  { label: "New", value: "active" },
  { label: "Old", value: "old" },
];

// ─── Menu 3 points ───────────────────────────────────────────────────────────
function CatMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        iconOnly
        variant="ghost"
        appearance="fill"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="size-8 rounded-lg grid place-items-center text-text-tertiary hover:bg-background-soft-100 hover:text-title-50 transition-colors"
      >
        <MenuKebab1 className="size-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-base-200 bg-background-50 shadow-md py-1 z-50">
          <Button
            variant="ghost"
            appearance="fill"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-foreground-soft-500 hover:bg-background-soft-100 hover:text-title-50 transition-colors"
          >
            Modifier
          </Button>
          <Button
            variant="ghost"
            appearance="fill"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-error-500 hover:bg-error-50 transition-colors"
          >
            Supprimer
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Vue liste ────────────────────────────────────────────────────────────────
function ListView({
  cats,
  onEdit,
  onDelete,
}: {
  cats: CatType[];
  onEdit: (cat: CatType) => void;
  onDelete: (cat: CatType) => void;
}) {
  return (
    <div className="rounded-xl border border-base-200 bg-background-50 shadow-xs">
      <ul className="divide-y divide-base-200">
        {cats.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center gap-4 px-5 py-4 hover:bg-background-soft-50 transition-colors cursor-pointer"
          >
            <div className="size-10 rounded-full bg-primary-100 grid place-items-center text-primary-500 font-semibold text-sm shrink-0">
              {cat.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-title-50 truncate">
                  {cat.name}
                </p>
              </div>
              <p className="text-xs text-text-secondary truncate mt-0.5">
                {cat.createdAt.toString()}
              </p>
            </div>
            <span className="text-xs text-text-tertiary shrink-0 mr-2">
              {cat.age} ans
            </span>
            <CatMenu
              onEdit={() => onEdit(cat)}
              onDelete={() => onDelete(cat)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Vue grille ───────────────────────────────────────────────────────────────
function GridView({
  cats,
  onEdit,
  onDelete,
}: {
  cats: CatType[];
  onEdit: (cat: CatType) => void;
  onDelete: (cat: CatType) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cats.map((cat) => (
        <div
          key={cat.id}
          className="rounded-xl border border-base-200 bg-background-50 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer p-5 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between">
            <div className="size-12 rounded-xl bg-primary-100 grid place-items-center text-primary-500 font-bold text-lg shrink-0">
              {cat.name.charAt(0)}
            </div>
            <CatMenu
              onEdit={() => onEdit(cat)}
              onDelete={() => onDelete(cat)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-title-50 truncate">
              {cat.name}
            </p>
            <p className="text-xs text-text-secondary mt-0.5 truncate">
              {cat.createdAt.toString()}
            </p>
          </div>

          <div className="pt-3 border-t border-base-200 flex items-center justify-between">
            <span className="text-xs text-text-tertiary">{cat.age} ans</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                cat.age < 15
                  ? "bg-success-50 text-success-500"
                  : "bg-background-soft-100 text-text-tertiary"
              }`}
            >
              {cat.age < 15 ? "New" : "Old"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ChatsPage() {
  const notify = useNotify();

  useSeoHead({
    title: "Chats",
    subtitle: "Apprenez à connaître les chats",
    forcePrefix: true,
  });

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [cats, setCats] = useState<CatType[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [viewModal, setViewModal] = useState<"create" | "update" | null>(null);

  const fetchCats = useCatStore((s) => s.fetchCats);
  const {
    cats: catsStored,
    selectedCat,
    setSelectedCat,
    createCat,
    updateCat,
    deleteCat,
  } = useStore(useCatStore);

  const filtered = cats.filter((c) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "active" && c.age < 15) ||
      (activeTab === "old" && c.age >= 15);
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchCats();
      } catch (error) {
        console.log("Failed to fetch cats:", error);
        notify({
          message: "Failed to fetch cats. Please try again later.",
          color: "error",
          visible: true,
        });
      }
    }
    fetchData();
  }, [fetchCats]);

  useEffect(() => {
    setCats(catsStored);
  }, [catsStored]);

  // Placeholders — tu brancheras tes vrais composants ici
  const handleEdit = (cat: CatType) => {
    setViewModal("update");
    setSelectedCat(cat);
    console.log("Edit:", cat);
    // ouvrir ton modal/drawer d'édition
  };

  // Creation
  const handleCreate = async (cat: Partial<CatType>) => {
    try {
      await createCat(cat as CatType);

      notify({
        message: "Cat created successfuly",
        color: "success",
        visible: true,
      });
    } catch (error) {
      console.log("Failed to create cat:", error);
      notify({
        message: "Failed to create cat. Please try again later.",
        color: "error",
        visible: true,
      });
    }
  };

  // Mise à jour
  const handleUpdate = async (cat: Partial<CatType>) => {
    try {
      await updateCat(String(cat.id), cat as CatType);

      notify({
        message: "Cat updated successfuly",
        color: "success",
        visible: true,
      });
    } catch (error) {
      console.log("Failed to update cat:", error);
      notify({
        message: "Failed to update cat. Please try again later.",
        color: "error",
        visible: true,
      });
    }
  };

  // Suppression
  const handleDelete = async (cat: Partial<CatType>) => {
    try {
      await deleteCat(String(cat.id));

      notify({
        message: "Cat deleted successfuly",
        color: "success",
        visible: true,
      });
    } catch (error) {
      console.log("Failed to delete cat:", error);
      notify({
        message: "Failed to delete cat. Please try again later.",
        color: "error",
        visible: true,
      });
    }
  };
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-title-50">Chats</h1>
          <p className="text-sm text-text-secondary mt-1">
            Gérez vos animaux ici. Ajoutez, modifiez ou supprimez des chats pour
            les garder à jour.
          </p>
        </div>

        {/* Bouton création — à remplacer par ton composant */}
        <div id="create-cat-slot" className="shrink-0">
          <Button
            size="sm"
            className="rounded-lg"
            onClick={() => {
              setViewModal("create");
            }}
          >
            <span>Créer</span>
            <Plus />
          </Button>
        </div>
      </div>

      {/* Filtres + toggle vue */}
      <div className="flex justify-between items-end gap-3 mb-6">
        <div className="flex-1">
          <FilterBar
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchPlaceholder="Rechercher un chat..."
            searchValue={search}
            onSearchChange={setSearch}
            setMode={setViewMode}
          />
        </div>
      </div>

      {/* Contenu */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-base-200 bg-background-50 shadow-xs flex flex-col items-center justify-center py-16 gap-3">
          <Message2Reversed className="size-10 text-text-tertiary" />
          <p className="text-sm text-text-secondary">Aucun chat trouvé</p>
        </div>
      ) : viewMode === "list" ? (
        <ListView cats={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <GridView cats={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/*Modal de creation de chat*/}
      {viewModal === "create" && (
        <CatFormModal
          mode="create"
          onSubmit={handleCreate}
          onClose={() => setViewModal(null)}
        />
      )}
      {/*Modal de mise à jour de chat*/}
      {viewModal !== "create" && viewModal !== null && (
        <CatFormModal
          mode="update"
          cat={selectedCat as CatType}
          onSubmit={handleUpdate}
          onClose={() => setViewModal(null)}
        />
      )}
    </div>
  );
}
