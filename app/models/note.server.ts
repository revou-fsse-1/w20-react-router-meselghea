import type { Note } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type { Note };

export function getNote({
  id,
  userId,
}: Pick<Note, "id"> & { userId: string }) {
  return prisma.note.findFirst({
    select: {
      id: true,
      body: true,
      title: true,
      imageUrl: true,
      user: {
        select: {
          name: true,
        },
      },
    },
    where: { id, userId },
  });
}

export function getNoteListItems() {
  return prisma.note.findMany({
    select: {
      id: true,
      title: true,
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function createNote({
  imageUrl,
  body,
  title,
  userId,
}: Pick<Note, "body" | "title" | "imageUrl"> & { userId: string }) {
  
  return prisma.note.create({
    data: {
      imageUrl,
      title,
      body,
      userId,
    },
  });
}

export function deleteNote({
  id,
  userId,
}: Pick<Note, "id"> & { userId: string }) {
  return prisma.note.deleteMany({
    where: { id, userId },
  });
}

export function updateNote(
  noteId: string,
  updatedNote: Partial<Note>
): Promise<Note> {
  return prisma.note.update({
    where: { id: noteId },
    data: updatedNote,
  });
}