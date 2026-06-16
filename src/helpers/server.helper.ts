// ─── Helpers ──────────────────────────────────────────────────

import { ServerTypes, StatusTypes, type Server } from "@/types/nexusgate.type";

export function getServerStatus(
  server: Server,
): "online" | "offline" | "tunnel" {
  if (server.type === ServerTypes.CLOUD) {
    return server.status === StatusTypes.ONLINE ? "online" : "offline";
  }
  return server.tunnelSession?.isActive ? "tunnel" : "offline";
}

export function getStatusLabel(server: Server): string {
  if (server.type === ServerTypes.CLOUD) return "En ligne";
  return server.tunnelSession?.isActive ? "Tunnel actif" : "Hors ligne";
}

export function getMethodColor(method: string): string {
  const map: Record<string, string> = {
    GET: "text-blue-600 bg-blue-50",
    POST: "text-green-700 bg-green-50",
    PUT: "text-amber-700 bg-amber-50",
    PATCH: "text-amber-700 bg-amber-50",
    DELETE: "text-red-600 bg-red-50",
  };
  return map[method] ?? "text-gray-600 bg-gray-100";
}

export function getStatusCodeColor(code: number): string {
  if (code < 300) return "text-green-700";
  if (code < 400) return "text-amber-600";
  if (code < 500) return "text-orange-600";
  return "text-red-600";
}
