import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectRepo } from "@/app/actions/connectRepo";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  const response = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=50",
    {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    }
  );
  const repos = await response.json();
  const connectedRepos = await prisma.repo.findMany({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800/50">
        <span className="text-xl font-bold tracking-tight">
          Bus<span className="text-blue-500">Factor</span>
        </span>
        <div className="flex items-center gap-3">
          {session.user.image && (
            <img src={session.user.image} className="w-8 h-8 rounded-full" alt="avatar" />
          )}
          <span className="text-sm text-gray-400">{session.user.name}</span>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Your Repositories</h1>
          <p className="text-gray-400 text-sm mt-1">
            Connect a repo to analyze its bus factor
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {repos.map((repo: any) => {
            const connected = connectedRepos.find(
              (r) => r.fullName === repo.full_name
            );
            return (
              <div
                key={repo.id}
                className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h2 className="font-medium text-sm">{repo.full_name}</h2>
                  <p className="text-gray-500 text-xs mt-1">
                    {repo.description ?? "No description available"}
                  </p>
                </div>
                {connected ? (
                  <a
                    href={`/repo/${connected.id}`}
                    className="bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 text-xs px-4 py-2 rounded-lg transition-colors"
                  >
                    View →
                  </a>
                ) : (
                  <form
                    action={connectRepo.bind(
                      null,
                      repo.name,
                      repo.full_name,
                      repo.owner.login,
                      repo.default_branch
                    )}
                  >
                    <button
                      type="submit"
                      className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-400 text-xs px-4 py-2 rounded-lg transition-colors"
                    >
                      Connect
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
