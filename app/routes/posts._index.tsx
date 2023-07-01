import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";
import { useOptionalUser } from '~/utils';

export const loader = async () => {
    return json({ posts: await getPosts() });
};

export default function Posts() {
    const { posts } = useLoaderData<typeof loader>();
    const user = useOptionalUser()
    const isAdmin = user?.email === ENV.ADMIN_EMAIL
    return (
      <main>
        <h1>Posts</h1>
        {isAdmin ? <Link to="admin" className="text-red-600 underline">
  Admin
</Link> : null}
        <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              prefetch='intent'
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      </main>
    );
  }