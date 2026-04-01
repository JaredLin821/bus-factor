"use server";

import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";

export async function connectRepo(name: string, fullName: string, owner: string, defaultBranch: string) {
    const session = await auth();
    if (!session) {
        throw new Error('Unauthorized');
    }
    
    const repo = await prisma.repo.upsert({
  where: {
    fullName_userId: {
      fullName,
      userId: session.user.id,
    }
  },
  update: {},
  create: {
    name,
    fullName,
    owner,
    defaultBranch,
    userId: session.user.id,
  }
})
redirect(`/repo/${repo.id}`);
}