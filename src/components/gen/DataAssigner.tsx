// components/assigners/ParticipantIndicatorAssigner.tsx
import { useState, useMemo } from "react";
import { Search1, Check, Plus } from "@tailgrids/icons";
import { cn } from "@/utils/cn";
// import ListView from "@/components/display/ListView"; // ton composant existant
import type {
  InitiativeType,
  ParticipantType,
  IndicatorsType,
} from "@/types/configuration.type";
import { Spinner } from "../ui/Spinner";

type Props = {
  // Initiatives
  initiatives: InitiativeType[];
  onSelectInitiative: (initiative: InitiativeType | null) => void;
  selectedInitiative: InitiativeType | null;
  // Participants (filtrés par initiative)
  participants: ParticipantType[];
  onSelectParticipant: (participant: ParticipantType | null) => Promise<void>;
  selectedParticipant: ParticipantType | null;
  // Indicateurs (tous disponibles)
  allIndicators: IndicatorsType[];
  // Indicateurs déjà assignés au participant sélectionné (ids)
  assignedIndicatorIds: number[];
  onAssignIndicator: (indicatorId: number) => Promise<void>;
  onUnassignIndicator: (indicatorId: number) => Promise<void>;
  // Loading states
  loading?: boolean;
};

export function ParticipantIndicatorAssigner({
  initiatives,
  onSelectInitiative,
  selectedInitiative,
  participants,
  onSelectParticipant,
  selectedParticipant,
  allIndicators,
  assignedIndicatorIds,
  onAssignIndicator,
  onUnassignIndicator,
  loading = false,
}: Props) {
  // Recherches locales
  const [searchInitiative, setSearchInitiative] = useState("");
  const [searchParticipant, setSearchParticipant] = useState("");
  const [searchIndicator, setSearchIndicator] = useState("");

  // Les loaders
  const [selectedIndLoading, setSelectedIndLoading] = useState<boolean>(false);

  // Filtrer initiatives
  const filteredInitiatives = useMemo(() => {
    if (!searchInitiative) return initiatives;
    const term = searchInitiative.toLowerCase();
    return initiatives.filter((i) => i.nom?.toLowerCase().includes(term));
  }, [initiatives, searchInitiative]);

  // Filtrer participants (déjà filtrés par initiative en amont ? On applique un filtre supplémentaire)
  const filteredParticipants = useMemo(() => {
    let list = participants;
    if (searchParticipant) {
      const term = searchParticipant.toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(term));
    }
    return list;
  }, [participants, searchParticipant]);

  // Filtrer indicateurs (tous, pour l'affichage à droite)
  const filteredIndicators = useMemo(() => {
    if (!searchIndicator) return allIndicators;
    const term = searchIndicator.toLowerCase();
    return allIndicators.filter(
      (ind) =>
        ind.label?.toLowerCase().includes(term) ||
        ind.code?.toLowerCase().includes(term),
    );
  }, [allIndicators, searchIndicator]);

  // Ensemble des ids assignés pour vérification rapide
  const assignedSet = useMemo(
    () => new Set(assignedIndicatorIds),
    [assignedIndicatorIds],
  );

  const handleToggleIndicator = async (indicator: IndicatorsType) => {
    if (!selectedParticipant) return;
    const id = indicator.id!;
    if (assignedSet.has(id)) {
      await onUnassignIndicator(id);
    } else {
      await onAssignIndicator(id);
    }
  };

  return (
    <div className="flex h-130 gap-4 p-4 px-0">
      {/* Colonne gauche : initiatives (haut) + participants (bas) */}
      <div className="flex w-1/3 flex-col gap-4">
        {/* Bloc Initiatives */}
        <div className="flex flex-col rounded-xl border border-base-200 bg-background-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-title-50">Initiatives</h3>
            <div className="relative">
              <Search1 className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchInitiative}
                onChange={(e) => setSearchInitiative(e.target.value)}
                className="h-7 w-32 rounded border border-base-200 pl-6 pr-2 text-xs"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredInitiatives.length === 0 ? (
              <p className="py-4 text-center text-xs text-text-tertiary">
                Aucune initiative
              </p>
            ) : (
              <ul className="space-y-1">
                {filteredInitiatives.map((init) => (
                  <li
                    key={init.id}
                    onClick={() => onSelectInitiative(init)}
                    className={cn(
                      "cursor-pointer rounded-md px-2 py-1 text-sm transition-colors",
                      selectedInitiative?.id === init.id
                        ? "bg-primary-50 text-primary-600 font-medium"
                        : "hover:bg-background-soft-100 text-title-50",
                    )}
                  >
                    {init.nom}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bloc Participants */}
        <div className="flex flex-1 flex-col rounded-xl border border-base-200 bg-background-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-title-50">
              Participants
              {selectedInitiative && (
                <span className="ml-1 text-xs font-normal text-text-tertiary">
                  (de l'initiative sélectionnée)
                </span>
              )}
            </h3>
            <div className="relative">
              <Search1 className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchParticipant}
                onChange={(e) => setSearchParticipant(e.target.value)}
                className="h-7 w-32 rounded border border-base-200 pl-6 pr-2 text-xs"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredParticipants.length === 0 ? (
              <p className="py-8 text-center text-xs text-text-tertiary">
                {selectedInitiative
                  ? "Aucun participant pour cette initiative"
                  : "Sélectionnez une initiative"}
              </p>
            ) : (
              <ul className="space-y-1">
                {filteredParticipants.map((part) => (
                  <li
                    key={part.id}
                    onClick={async () => {
                      setSelectedIndLoading(true);
                      try {
                        await onSelectParticipant(part);
                      } catch (error) {
                        console.log(
                          "Failed to fetch indicators:",
                          String(error),
                        );
                      } finally {
                        setSelectedIndLoading(false);
                      }
                    }}
                    className={cn(
                      "cursor-pointer rounded-md px-2 py-1 text-sm transition-colors",
                      selectedParticipant?.id === part.id
                        ? "bg-primary-50 text-primary-600 font-medium"
                        : "hover:bg-background-soft-100 text-title-50",
                    )}
                  >
                    {part.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Colonne droite : indicateurs avec assignation */}
      <div className="flex w-2/3 flex-col rounded-xl border border-base-200 bg-background-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-title-50">
            Indicateurs
            {selectedParticipant && (
              <span className="ml-2 text-sm font-normal text-text-secondary">
                pour {selectedParticipant.name}
              </span>
            )}
          </h3>
          <div className="relative">
            <Search1 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Rechercher indicateur..."
              value={searchIndicator}
              onChange={(e) => setSearchIndicator(e.target.value)}
              className="h-9 w-64 rounded-lg border border-base-200 bg-background-50 pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        {!selectedParticipant && !selectedIndLoading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-text-tertiary">
            Sélectionnez un participant à gauche
          </div>
        ) : !selectedParticipant && selectedIndLoading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-text-tertiary">
            <Spinner size="xxl" className="text-gray-500" />
          </div>
        ) : selectedParticipant && selectedIndLoading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-text-tertiary">
            <Spinner size="xxl" className="text-gray-500" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {filteredIndicators.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-tertiary">
                Aucun indicateur trouvé
              </p>
            ) : (
              <ul className="divide-y divide-base-200">
                {filteredIndicators.map((ind) => {
                  const isAssigned = assignedSet.has(ind.id!);
                  return (
                    <li
                      key={ind.id}
                      className={cn(
                        "flex items-center justify-between py-3 px-1",
                        isAssigned
                          ? "bg-primary-500/10 text-primary-600 hover:bg-primary-500/20"
                          : "hover:bg-background-soft-50",
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium text-title-50">
                          {ind.label}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {ind.code} • {ind.type}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleIndicator(ind)}
                        disabled={loading}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                          isAssigned
                            ? "bg-primary-100 text-primary-600 hover:bg-primary-200"
                            : "bg-background-soft-100 text-text-tertiary hover:bg-primary-100 hover:text-primary-600",
                        )}
                      >
                        {isAssigned ? (
                          <Check className="size-4" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
