export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800/50">
        <span className="text-xl font-bold tracking-tight">
          Bus<span className="text-blue-500">Factor</span>
        </span>
        <a
          href="/api/auth/signin?callbackUrl=/dashboard"
          className="bg-blue-600 hover:bg-blue-500 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Sign In with GitHub
        </a>
      </nav>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center text-center px-8 py-40">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          Open source knowledge risk analysis
        </div>
        <h1 className="text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          Know who knows <span className="text-blue-500">your code.</span>
        </h1>
        <p className="text-gray-400 text-xl mt-6 max-w-xl leading-relaxed">
          BusFactor identifies knowledge silos in your codebase — before a key
          contributor leaves and takes critical context with them.
        </p>
        <a
          href="/api/auth/signin?callbackUrl=/dashboard"
          className="mt-10 bg-blue-600 hover:bg-blue-500 transition-colors text-white px-8 py-4 rounded-xl text-lg font-medium"
        >
          Analyze your repos →
        </a>
      </main>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 pb-32 max-w-5xl mx-auto w-full">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <div className="text-2xl mb-4">🔴</div>
          <h3 className="font-semibold text-base mb-2">Single Points of Failure</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Files touched by only one contributor — if they leave, no one else
            knows this code.
          </p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <div className="text-2xl mb-4">🟡</div>
          <h3 className="font-semibold text-base mb-2">Knowledge Silos</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Files with limited contributors — risky but not critical yet.
          </p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <div className="text-2xl mb-4">🟢</div>
          <h3 className="font-semibold text-base mb-2">Healthy Distribution</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Files with multiple contributors — knowledge is shared and the team
            is resilient.
          </p>
        </div>
      </section>
    </div>
  );
}
