import type { Post } from "@prisma/client";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();

export type { Post};

export function getPostAll({
  slug, 
}: Pick<Post, "slug">) {
  return prisma.post.findFirst({
    select: {
      slug: true,
      body: true,
      title: true,
      imageUrl: true,
    },
    where: { slug }
  });
}

export function getPost({
  slug, userId
}: Pick<Post, "slug"> & {userId: string}) {
  return prisma.post.findFirst({
    select: {
      slug: true,
      body: true,
      title: true,
      imageUrl: true,
    },
    where: { slug, userId }
  });
}

export function getPostListItems() {
  return prisma.post.findMany({
    select: {
      slug: true,
      title: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}


export function createPost({
  slug,
  imageUrl,
  body,
  title,
  userId
}: Pick<Post, "slug"| "body" | "title" | "imageUrl" > & {userId: string}) {
  return prisma.post.create({
    data: {
      slug,
      imageUrl,
      title,
      body,
      userId
    },
  });
}

export function deletePost({
  slug,
  userId,
}: Pick<Post, "slug"> & { userId: string }) {
  return prisma.post.deleteMany({
    where: { slug, userId },
  });
}

export function updatePost(post: Pick<Post, "slug" |"title" | "body" | "imageUrl"> & {userId: string}) {
  return prisma.post.update({ data: post, where: { slug: post.slug } });
}