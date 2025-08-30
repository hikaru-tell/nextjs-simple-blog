import { prisma } from '@/lib/prisma';

export async function getPosts() {
  //記事カード用、全体の取得
  return await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPost(id: string) {
  //記事詳細の取得
  return await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });
}

export async function searchPosts(search: string) {
  //記事検索
  const decodedSearch = decodeURIComponent(search);
  const normalizedSearch = decodedSearch.replace(/[|s　]+/g, ' ').trim();
  const searchWords = decodedSearch.split('').filter(Boolean);

  const filters = searchWords.map((word) => ({
    OR: [{ title: { contains: word } }, { content: { contains: word } }],
  }));

  return await prisma.post.findMany({
    where: { AND: filters },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}
