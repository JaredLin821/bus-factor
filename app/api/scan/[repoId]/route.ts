import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ repoId: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoId } = await params;

    const repo = await prisma.repo.findUnique({
        where: { id: repoId }
    });

    if (!repo) {
        return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }

    // Make sure this repo belongs to the logged-in user
    if (repo.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const treeRes = await fetch(
            `https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}/git/trees/${encodeURIComponent(repo.defaultBranch)}?recursive=1`,
            { headers: { Authorization: `Bearer ${session.user.accessToken}` } }
        );

        if (!treeRes.ok) {
            return NextResponse.json({ error: "Failed to fetch repository tree from GitHub" }, { status: 502 });
        }

        const treeData = await treeRes.json();

        if (!Array.isArray(treeData.tree)) {
            return NextResponse.json({ error: "Unexpected response from GitHub" }, { status: 502 });
        }

        const files = treeData.tree.filter((item: any) => item.type === "blob");

        if (files.length === 0) {
            return NextResponse.json({ error: "No files found in repository" }, { status: 400 });
        }

        const fileResults = await Promise.all(
            files.map(async (file: any) => {
                try {
                    const commitsRes = await fetch(
                        `https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}/commits?path=${encodeURIComponent(file.path)}&per_page=100`,
                        { headers: { Authorization: `Bearer ${session.user.accessToken}` } }
                    );

                    if (!commitsRes.ok) {
                        return { path: file.path, contributors: [], count: 0 };
                    }

                    const commits = await commitsRes.json();

                    if (!Array.isArray(commits)) {
                        return { path: file.path, contributors: [], count: 0 };
                    }

                    const contributors = [
                        ...new Set(
                            commits
                                .map((c: any) => c?.commit?.author?.name)
                                .filter(Boolean)
                        )
                    ];

                    return {
                        path: file.path,
                        contributors,
                        count: contributors.length
                    };
                } catch {
                    return { path: file.path, contributors: [], count: 0 };
                }
            })
        );

        const redFiles = fileResults.filter(f => f.count === 1).length;
        const yellowFiles = fileResults.filter(f => f.count === 2).length;
        const greenFiles = fileResults.filter(f => f.count >= 3).length;
        const overallScore = fileResults.length > 0 ? (greenFiles / fileResults.length) * 100 : 0;

        await prisma.scan.create({
            data: {
                repoId: repo.id,
                overallScore,
                totalFiles: fileResults.length,
                redFiles,
                yellowFiles,
                greenFiles,
                fileResults,
                contributors: [...new Set(fileResults.flatMap(f => f.contributors))]
            }
        });

        return NextResponse.json({ success: true });

    } catch {
        return NextResponse.json({ error: "Scan failed unexpectedly" }, { status: 500 });
    }
}
