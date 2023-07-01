import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  Link
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ id: params.noteId, userId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ id: params.noteId, userId });
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
        <img
          src={data.note.imageUrl}
          alt="something useful here" className=" max-w-sm max-h-sm" />
      <p className="py-6">{data.note.body}</p>
      <p className="py-6 text-sm">Author: {data.note.user.name}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-pink-600 px-4 py-2 text-white hover:bg-pink-800 focus:bg-pink-400"
        >
          Delete
        </button>
        <Link to="/:id/edit" className="block p-4 text-xl text-pink-500">
            Edit
          </Link>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }
 if (error.status === 401) {
    return <div>Unauthorized to delete this note</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
