// ─── Guard accès CREATOR ──────────────────────────────────────

import { useNavigate } from "react-router";

export default function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-7 h-7 text-gray-400"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Accès restreint</p>
        <p className="text-xs text-gray-400 mt-1">
          Seul le <span className="font-semibold">CREATOR</span> peut modifier
          les paramètres de l'équipe.
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        ← Retour
      </button>
    </div>
  );
}
