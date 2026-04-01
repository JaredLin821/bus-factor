import {auth} from '@/auth'
import {redirect} from 'next/navigation'
import {connectRepo} from '@/app/actions/connectRepo';

export default async function DashboardPage() {
    const session = await auth();
    if (!session) {
        redirect('/api/auth/signin');
    }

    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
        headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
        }
    })
    const repos = await response.json();

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            {repos.map((repo: any) => (
                <div key={repo.id} className="border border-gray-800 rounded-lg p-4 mb-3 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold">{repo.full_name}</h2>
                        <p className ="text-gray-400 text-sm mt-1">{repo.description ?? "No description available"}</p>
                    </div>
                    <form action={connectRepo.bind(null, repo.name, repo.full_name, repo.owner.login, repo.default_branch)}>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                            Connect
                        </button>
                    </form>
                </div>
            ))}
        </div>
    )
}
