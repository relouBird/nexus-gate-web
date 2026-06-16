// pages/ServersPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSeoHead } from "@/composables/useSeoHead";
import { PageHeader } from "@/components/gen/PageHeader";
import { Overlay } from "@/components/display/Overlay";
import { pause } from "@/constants";
import { MOCK_SERVERS } from "@/constants/display/mock.constant";
import {
  ServerStatusTypes,
  type Server,
  type ServerType,
} from "@/types/nexusgate.type";
import { dateFormat, timeSince } from "@/helpers";
import { getServerStatus } from "@/helpers/server.helper";

// Les composants Icones
import ChevronRight from "@/components/icons/ChevronRight";
import ServerIcon from "@/components/icons/ServerIcon";
import { Globe2 } from "@tailgrids/icons";
import StatusBadge from "@/components/network/StatusBadge";


function TypeBadge({ type }: { type: ServerType }) {
  const config =
    type === "CLOUD"
      ? { bg: "bg-blue-50", text: "text-blue-600", label: "Cloud" }
      : { bg: "bg-orange-50", text: "text-orange-600", label: "Local" };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

// ─── Server card ──────────────────────────────────────────────

function ServerCard({
  server,
  onClick,
}: {
  server: Server;
  onClick: () => void;
}) {
  const status = getServerStatus(server);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all group flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              status === ServerStatusTypes.OFFLINE
                ? "bg-gray-100 text-gray-400"
                : status === ServerStatusTypes.TUNNEL
                  ? "bg-amber-50 text-amber-500 group-hover:bg-amber-100"
                  : "bg-indigo-50 text-indigo-400 group-hover:text-indigo-600 group-hover:bg-indigo-100"
            }`}
          >
            <ServerIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-700 transition-colors">
              {server.name}
            </p>
            <p className="text-xs text-gray-400 font-mono truncate">
              {server.identifier}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0 mt-0.5" />
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={status} isActive />
        <TypeBadge type={server.type} />
        {server.requireToken && (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-600">
            Token requis
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>
            <span className="font-medium text-gray-600">
              {server.rulesCount}
            </span>{" "}
            règle{server.rulesCount !== 1 ? "s" : ""}
          </span>
          {server.type === "LOCAL" && server.tunnelSession && (
            <span>
              Ping{" "}
              <span className="font-medium text-gray-600">
                {timeSince(server.tunnelSession.lastPingAt)}
              </span>
            </span>
          )}
          {server.type === "CLOUD" && server.url && (
            <span className="truncate max-w-35 font-mono text-gray-300">
              {server.url.replace(/^https?:\/\//, "")}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-300">
          {dateFormat(server.updatedAt, "DD/MM/YYYY")}
        </span>
      </div>
    </button>
  );
}

// ─── Filter bar ───────────────────────────────────────────────

type FilterType = "all" | "CLOUD" | "LOCAL";
type FilterStatus = "all" | "online" | "offline";

function FilterBar({
  typeFilter,
  statusFilter,
  search,
  onType,
  onStatus,
  onSearch,
}: {
  typeFilter: FilterType;
  statusFilter: FilterStatus;
  search: string;
  onType: (v: FilterType) => void;
  onStatus: (v: FilterStatus) => void;
  onSearch: (v: string) => void;
}) {
  const typeOpts: { value: FilterType; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "CLOUD", label: "Cloud" },
    { value: "LOCAL", label: "Local" },
  ];
  const statusOpts: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "Tous statuts" },
    { value: "online", label: "En ligne" },
    { value: "offline", label: "Hors ligne" },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
        >
          <circle cx="6.5" cy="6.5" r="4" />
          <path d="M10 10l3 3" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder="Rechercher un serveur..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 transition"
        />
      </div>

      {/* Type pills */}
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
        {typeOpts.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onType(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              typeFilter === opt.value
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Status select */}
      <select
        aria-label="Filtrer par statut"
        value={statusFilter}
        onChange={(e) => onStatus(e.target.value as FilterStatus)}
        className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:border-indigo-300 transition"
      >
        {statusOpts.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 mb-4">
        <ServerIcon className="w-7 h-7" />
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">
        {hasFilters ? "Aucun serveur ne correspond" : "Aucun serveur configuré"}
      </p>
      <p className="text-xs text-gray-400">
        {hasFilters
          ? "Essayez de modifier vos filtres."
          : "Ajoutez votre premier serveur pour commencer."}
      </p>
    </div>
  );
}

// ─── Stats summary bar ────────────────────────────────────────

function SummaryBar({ servers }: { servers: Server[] }) {
  const online = servers.filter(
    (s) => getServerStatus(s) === ServerStatusTypes.ONLINE,
  ).length;
  const tunnel = servers.filter(
    (s) => getServerStatus(s) === ServerStatusTypes.TUNNEL,
  ).length;
  const offline = servers.filter(
    (s) => getServerStatus(s) === ServerStatusTypes.OFFLINE,
  ).length;

  return (
    <div className="flex items-center gap-4 text-xs text-gray-400">
      <span>
        <span className="font-semibold text-gray-700">{servers.length}</span>{" "}
        serveur{servers.length !== 1 ? "s" : ""}
      </span>
      <span className="w-px h-3 bg-gray-200" />
      {online > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {online} en ligne
        </span>
      )}
      {tunnel > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {tunnel} tunnel
        </span>
      )}
      {offline > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          {offline} hors ligne
        </span>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────

export default function ServerPage() {
  useSeoHead({
    title: "Serveurs",
    subtitle: "Gérez vos APIs enregistrées sur la plateforme",
    forcePrefix: true,
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [servers, setServers] = useState<Server[]>([]);
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        await pause(2000);
        setServers(MOCK_SERVERS);
      } catch (error) {
        console.log("Failed to fetch servers:", String(error));
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = servers.filter((s) => {
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (statusFilter !== "all") {
      const status = getServerStatus(s);
      if (statusFilter === "online" && status === ServerStatusTypes.OFFLINE)
        return false;
      if (statusFilter === "offline" && status !== ServerStatusTypes.OFFLINE)
        return false;
    }
    if (
      search &&
      !s.name.toLowerCase().includes(search.toLowerCase()) &&
      !s.identifier.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const hasFilters =
    typeFilter !== "all" || statusFilter !== "all" || search !== "";

  return (
    <div>
      <PageHeader
        title="Serveurs"
        buttonName="Nouveau serveur"
        icon={Globe2}
        description="Gérez les APIs enregistrées et surveillez leur statut en temps réel"
        onView={() => console.log("Créer un serveur")}
      />

      <Overlay visible={isLoading} text="Chargement des serveurs...">
        <div className="flex flex-col gap-4 mt-6">
          {/* Filter bar */}
          <FilterBar
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            search={search}
            onType={setTypeFilter}
            onStatus={setStatusFilter}
            onSearch={setSearch}
          />

          {/* Summary */}
          {filtered.length > 0 && <SummaryBar servers={filtered} />}

          {/* Grid */}
          {filtered.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((server) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  onClick={() => navigate(`/network/servers/${server.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </Overlay>
    </div>
  );
}
