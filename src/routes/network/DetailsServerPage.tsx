// pages/DetailsServerPage.tsx
import { Overlay } from "@/components/display/Overlay";
import { PageHeader } from "@/components/gen/PageHeader";
import { useSeoHead } from "@/composables/useSeoHead";
import { pause } from "@/constants";
import {
  MOCK_SERVERS,
  MOCK_RULES,
  MOCK_RECENT_LOGS,
} from "@/constants/display/mock.constant";
import type { Server, Rule, RequestLog } from "@/types/nexusgate.type";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ServerInfoCard } from "@/components/network/ServerInfoCard";
import RuleModal from "@/components/network/RuleModal";
import LogTable from "@/components/network/LogTable";
import RuleTable from "@/components/network/RuleTable";
import { Gear1 } from "@tailgrids/icons";

// ─── MAIN PAGE ─────────────────────────────────────────────────

export default function DetailsServerPage() {
  const { id } = useParams();

  useSeoHead({
    title: `Serveur ${id}`,
    subtitle: "Gérez vos APIs enregistrées sur la plateforme",
    forcePrefix: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [server, setServer] = useState<Server | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [showRuleModal, setShowRuleModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        await pause(2000);
        // Trouve le server par id (uuid) ou par index selon ton routing
        const found =
          MOCK_SERVERS.find((s) => s.id === id) ??
          MOCK_SERVERS[Number(id)] ??
          null;
        setServer(found);
        if (found) {
          // Règles du server
          const serverRules = MOCK_RULES.filter((r) => r.serverId === found.id);
          setRules(serverRules);
          // Logs du server
          const serverLogs = MOCK_RECENT_LOGS.filter(
            (l) => l.serverId === found.id,
          );
          setLogs(serverLogs);
        }
      } catch (error) {
        console.log("Failed to fetch server:", String(error));
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  function handleToggleRule(ruleId: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r)),
    );
    // TODO: PATCH /config/rules/:id { isActive }
  }

  function handleDeleteRule(ruleId: string) {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
    // TODO: DELETE /config/rules/:id
  }

  function handleAddRule(rule: Rule) {
    setRules((prev) => [rule, ...prev]);
    // TODO: POST /config/servers/:id/rules
  }

  return (
    <div>
      <PageHeader
        title={server ? `Serveur : ${server.name}` : `Serveur : ${id}`}
        description="Surveillez votre serveur et gérez ses règles de sécurité"
        buttonName="Configuration Serveur"
        icon={Gear1}
      />

      <Overlay visible={isLoading} text={`Chargement du serveur ${id}…`}>
        {server && (
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 -mt-3">
            {/* Infos server */}
            <section className="lg:col-span-4">
              <ServerInfoCard server={server} />
            </section>

            {/* Règles */}
            <section className="lg:col-span-5">
              <RuleTable
                rules={rules}
                onToggle={handleToggleRule}
                onDelete={handleDeleteRule}
                onAdd={() => setShowRuleModal(true)}
              />
            </section>

            {/* Logs */}
            <section className="lg:col-span-9">
              <LogTable logs={logs} />
            </section>
          </div>
        )}

        {!server && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-sm font-medium text-gray-600">
              Serveur introuvable
            </p>
            <p className="text-xs text-gray-400">
              L'identifiant{" "}
              <code className="font-mono bg-gray-100 px-1 rounded">{id}</code>{" "}
              ne correspond à aucun serveur.
            </p>
          </div>
        )}
      </Overlay>

      {/* Modale règle */}
      {showRuleModal && server && (
        <RuleModal
          serverId={server.id}
          onClose={() => setShowRuleModal(false)}
          onSave={handleAddRule}
        />
      )}
    </div>
  );
}
