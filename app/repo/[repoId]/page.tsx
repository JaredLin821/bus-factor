import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ScanButton from "@/app/repo/[repoId]/ScanButton";
import FileList from "@/app/repo/[repoId]/FileList";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ repoId: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  const { repoId } = await params;

  const repo = await prisma.repo.findUnique({
    where: { id: repoId },
  });

  // Not found or doesn't belong to this user
  if (!repo || repo.userId !== session.user.id) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Repository not found</p>
      </div>
    );
  }

  const scan = await prisma.scan.findFirst({
    where: { repoId: repo.id },
    orderBy: { completedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800/50">
        <span className="text-xl font-bold tracking-tight">
          Bus<span className="text-blue-500">Factor</span>
        </span>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Dashboard
        </a>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Repo header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{repo.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{repo.owner}</p>
          </div>
          <ScanButton repoId={repo.id} />
        </div>

        {scan ? (
          <div className="flex flex-col gap-4">
            {/* Score cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{scan.overallScore.toFixed(1)}%</p>
                <p className="text-gray-500 text-xs mt-1">Overall Score</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-400">{scan.redFiles}</p>
                <p className="text-gray-500 text-xs mt-1">High Risk</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">{scan.yellowFiles}</p>
                <p className="text-gray-500 text-xs mt-1">Medium Risk</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{scan.greenFiles}</p>
                <p className="text-gray-500 text-xs mt-1">Healthy</p>
              </div>
            </div>

            {/* File list */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm">File Breakdown</h2>
                <span className="text-gray-500 text-xs">{scan.totalFiles} files</span>
              </div>
              <FileList files={scan.fileResults as any[]} />
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No scan yet — click Scan Repository to analyze this repo</p>
          </div>
        )}
      </div>
    </div>
  );
}
