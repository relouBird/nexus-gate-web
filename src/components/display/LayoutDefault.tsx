import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function LayoutDefault() {
  return (
    <div className="min-h-screen bg-background-soft-50 font-sans">
      <Sidebar />
      <main className="mx-auto max-w-7xl ml-64">
        <Topbar />
        <div className="px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
