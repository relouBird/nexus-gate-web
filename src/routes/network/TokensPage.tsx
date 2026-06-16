import { Overlay } from "@/components/display/Overlay";
import { PageHeader } from "@/components/gen/PageHeader";
import { useSeoHead } from "@/composables/useSeoHead";
import { pause } from "@/constants";
import { useEffect, useState } from "react";

export default function TokensPage() {
  useSeoHead({
    title: "Vos Tokens",
    subtitle: "Gérez et surveillez vos tokens de manière efficace",
    forcePrefix: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Test en mettant une pause
        await pause(3500);
      } catch (error) {
        console.log("Failed to fetch Datas:", String(error));
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      <PageHeader
        title="Vos Tokens"
        buttonName="Génerer un token"
        description="Créer et gérez vos tokens de manière efficace pour sécuriser vos accès aux ressources serveurs"
        onView={() => console.log("View action triggered")}
      />

      <Overlay
        visible={isLoading}
        text={"Chargement des tokens..."}
      >
        <h1>TokensPage</h1>
      </Overlay>
    </div>
  );
}
