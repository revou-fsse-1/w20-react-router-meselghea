import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, isRouteErrorResponse, useRouteError, } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createPost, updatePost, getPost } from "~/models/post.server";
import { requireUserId, getUserId } from "~/session.server";


export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.slug , "slug not found");
  if (params.slug === "new") {
    return json({ post: null });
  }

  const post = await getPost({ slug: params.slug, userId });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
}

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const slug = intent !== "update" ? formData.get("slug") : params.slug;
  const imageUrl = formData.get("imageUrl");
  const title = formData.get("title");
  const body = formData.get("body");
  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    body: body ? null : "Body is required",
    imageUrl: imageUrl ? null : "image is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }


  invariant(typeof title === "string", "title must be a string");
  invariant(typeof body === "string", "body must be a string");
  invariant(typeof imageUrl === "string", "lyric must be a string");
  invariant(typeof slug === "string", "slug must be a string");

  if (params.slug === "new") {
    await createPost({ slug, title, imageUrl, body, userId });
  } else {
    await updatePost({
      title, imageUrl, body, slug, userId});
  }
  return redirect(`/posts`);
};

export default function PostAdmin() {
  const data = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  
  const navigation = useNavigation();
  const isCreating = navigation.formData?.get("intent") === "create";
  const isUpdating = navigation.formData?.get("intent") === "update";
  const isNewPost = !data.post;

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
      <label className="flex w-full flex-col gap-1">
          <span>Slug: </span>
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            name="slug"
            key={data?.post?.slug ?? "new"}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            defaultValue={data?.post?.slug}
          />
        </label>
      <label className="flex w-full flex-col gap-1">
          <span>imageUrl: </span>
          {errors?.imageUrl ? (
            <em className="text-red-600">{errors.imageUrl}</em>
          ) : null}
          <input
            name="imageUrl"
            key={data?.post?.imageUrl ?? "new"}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            defaultValue={data?.post?.imageUrl}
          />
        </label>
        
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            name="title"
            key={data?.post?.title ?? "new"}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            defaultValue={data?.post?.title}
          />
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          {errors?.body ? (
            <em className="text-red-600">{errors.body}</em>
          ) : null}
          <textarea
            name="body"
            key={data?.post?.body ?? "new"}
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            defaultValue={data?.post?.body}
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          value={isNewPost ? "create" : "update"}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          disabled={isCreating || isUpdating}>
         {isNewPost ? (isCreating ? "Creating..." : "Create") : null}
          {isNewPost? null : isUpdating ? "Updating..." : "Update"}
        </button>
      </div>
    </Form>
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
    return <div>Unauthorized to update this Post</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}