import { Navigate, Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuthStore } from "@/stores/auth.store";
import { useStore } from "zustand";

export function LayoutDefault() {
  // Remplacez cette condition par votre vraie logique d'authentification (ex: token dans localStorage)
  const { accessToken } = useStore(useAuthStore);

  if (!accessToken) {
    return <Navigate to={"/auth/login"} replace />;
  }
  return (
    <div className="min-h-screen bg-background-soft-50 font-sans">
      <Sidebar />
      <main className="mx-auto max-w-7xl ml-64 pt-16">
        <Topbar />
        <div className="px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
