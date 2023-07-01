import { useState } from "react";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getNoteListItems } from "~/models/note.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const noteListItems = await getNoteListItems();
  return json({ noteListItems });
};

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNoteListItems = data.noteListItems.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-pink-600 p-4 text-white">
        <h1 className="text-3xl font-bold block uppercase">
          <Link to=".">Olabar</Link>
        </h1>
        <p className="text-lg font-bolde block uppercase">{user.name}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className=" p-4 text-xl block uppercase text-pink-600">
            + New Note
          </Link>

          <hr />

          <div className="p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search notes..."
              className="px-3 py-2 border rounded"
            />
          </div>

          {filteredNoteListItems.length === 0 ? (
            <p className="p-4">No notes found</p>
          ) : (
            <ol>
              {filteredNoteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${
                        isActive ? "bg-white" : ""
                      }`
                    }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                  <Link to={`:noteId/edit`} className="text-pink-600">
                    Edit
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}