import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireUserId } from "~/session.server";
import { getPostAll, deletePost } from '~/models/post.server';

export const loader = async ({ params, request }: LoaderArgs) => {
  await requireUserId(request);
  invariant(params.slug, "slugId not found");

  const post = await getPostAll({ slug: params.slug });
  if (!post) {
    throw new Response("Unauthorized to delete this Post", { status: 404 });
  }
  return json({ post });
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.slug, "postId not found");

  await deletePost({ slug: params.slug, userId });
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return redirect("/posts");
};

export default function PostDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.post.title}</h3>
        <img
          src={data.post.imageUrl}
          alt="something useful here" className=" max-w-sm max-h-sm" />
      <p className="py-6">{data.post.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-pink-600 px-4 py-2 text-white hover:bg-pink-800 focus:bg-pink-400"
        >
          Delete
        </button>
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
    return <div>Unauthorized to edit this Post</div>;
  }
  return <div>An unexpected error occurred: {error.statusText}</div>;
}
