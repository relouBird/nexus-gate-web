import { Overlay } from "@/components/display/Overlay";
import { PageHeader } from "@/components/gen/PageHeader";
import { useSeoHead } from "@/composables/useSeoHead";
import { pause } from "@/constants";
import { User2 } from "@tailgrids/icons";
import { useEffect, useState } from "react";

export default function UsersPage() {
  useSeoHead({
    title: "Vos Utilisateurs",
    subtitle: "Gérez et surveillez vos utilisateurs de manière efficace",
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
        title="Vos Utilisateurs"
        buttonName="Créer un Utilisateur"
        icon={User2}
        description="Gérez et surveillez vos utilisateurs de manière efficace"
        onView={() => console.log("View action triggered")}
      />

      <Overlay visible={isLoading} text={"Chargement des utilisateurs..."}>
        <h1>UsersPage</h1>
      </Overlay>
    </div>
  );
}
