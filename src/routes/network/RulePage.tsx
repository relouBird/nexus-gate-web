import { Overlay } from "@/components/display/Overlay";
import { PageHeader } from "@/components/gen/PageHeader";
import { useSeoHead } from "@/composables/useSeoHead";
import { pause } from "@/constants";
import { useEffect, useState } from "react";

export default function RulePage() {
  useSeoHead({
    title: "Mesures et Règles",
    subtitle: "Gérez vos mesures et règles sur les serveurs",
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
        title="Filtres et Règles"
        buttonName="Créer un Filtre ou une Règle"
        description="Gérez vos filtres et règles sur les serveurs pour assurer la sécurité et la conformité des ressources"
        onView={() => console.log("View action triggered")}
      />

      <Overlay
        visible={isLoading}
        text={"Chargement des filtres et règles..."}
      >
        <h1>RulePage</h1>
      </Overlay>
    </div>
  );
}
