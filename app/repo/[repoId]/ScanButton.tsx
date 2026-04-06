"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ScanButton({ repoId }: { repoId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/scan/${repoId}`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Scan failed");
      } else {
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleScan}
        disabled={loading}
        className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
          loading
            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500 text-white"
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border-2 border-gray-500 border-t-white rounded-full animate-spin"></span>
            Scanning...
          </span>
        ) : (
          "Scan Repository"
        )}
      </button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
