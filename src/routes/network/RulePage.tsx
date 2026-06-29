import AccessDenied from "@/components/account/AccessDenied";
import { Overlay } from "@/components/display/Overlay";
import { PageHeader } from "@/components/gen/PageHeader";
import { useSeoHead } from "@/composables/useSeoHead";
import { pause } from "@/constants";
import { useMeStore } from "@/stores/me.store";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

export default function RulePage() {
  useSeoHead({
    title: "Mesures et Règles",
    subtitle: "Gérez vos mesures et règles sur les serveurs",
    forcePrefix: true,
  });

  const { user: me } = useStore(useMeStore);

  const canCreate = me?.role === "CREATOR" || me?.role === "ADMIN";

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Test en mettant une pause
        await pause(1500);
      } catch (error) {
        console.log("Failed to fetch Datas:", String(error));
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);


  if (!canCreate) {
    return (
      <div>
        <PageHeader
          title="Utilisateurs"
          description="Gérez les membres de votre équipe"
        />
        <AccessDenied allowedRoles={["CREATOR", "ADMIN"]} />
      </div>
    );
  }
  return (
    <div>
      <PageHeader
        title="Filtres et Règles"
        buttonName="Créer un Filtre ou une Règle"
        description="Gérez vos filtres et règles sur les serveurs pour assurer la sécurité et la conformité des ressources"
        onView={() => console.log("View action triggered")}
      />

      <Overlay visible={isLoading} text={"Chargement des filtres et règles..."}>
        <h1>RulePage</h1>
      </Overlay>
    </div>
  );
}
