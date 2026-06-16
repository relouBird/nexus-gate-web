import { Overlay } from "@/components/display/Overlay";
import { PageHeader } from "@/components/gen/PageHeader";
import { useSeoHead } from "@/composables/useSeoHead";
import { pause } from "@/constants";
import { Globe2 } from "@tailgrids/icons";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  useSeoHead({
    title: "Paramètres",
    subtitle: "Gérez les paramètres de votre compte et personnalisez votre expérience",
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
        title="Paramètres"
        buttonName="Gérer les Paramètres"
        icon={Globe2}
        description="Gérez les paramètres de votre compte et personnalisez votre expérience"
        onView={() => console.log("View action triggered")}
      />

      <Overlay
        visible={isLoading}
        text={"Chargement des paramètres..."}
      >
        <h1>SettingsPage</h1>
      </Overlay>
    </div>
  );
}
