import React from "react";
import { useLoaderData, Form } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect, Response } from "@remix-run/node";
import type { Note } from "~/models/note.server";
import { updateNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const noteId = formData.get("id") as string;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const imageUrl = formData.get("imageUrl") as string;

  await updateNote(noteId, { title, body, imageUrl });

  return redirect("/notes");
}

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const { noteId } = params;

  if (!noteId) {
    throw new Response("Not Found", { status: 404 });
  }

  const note = await getNote({ id: noteId, userId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }

  return { note };
};

export default function EditNote() {
  const data = useLoaderData<{ note: Note | null }>();
  const { note } = data || { note: null };

  return (
    <div>
      <h2>Edit Note</h2>
      <Form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={note?.title ?? ""}
          />
        </div>
        <div>
          <label htmlFor="body">Body:</label>
          <textarea id="body" name="body" defaultValue={note?.body ?? ""} />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            defaultValue={note?.imageUrl ?? ""}
          />
        </div>
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}