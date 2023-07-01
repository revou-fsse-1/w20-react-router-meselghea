import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs, } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  useLoaderData,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import { getEnv } from "./env.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request), 
  ENV: getEnv(),
  });
};

export default function App() {
  const data = useLoaderData()
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script dangerouslySetInnerHTML={{__html: `window.ENV = ${JSON.stringify(data.ENV)}`}}
 />        <LiveReload />
      </body>
    </html>
  );
}
