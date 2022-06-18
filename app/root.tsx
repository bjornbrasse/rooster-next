import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
} from 'remix';
import type { MetaFunction } from 'remix';
import styles from './tailwind.css';
import { DialogProvider } from '~/contexts/dialog';
import { ScheduleProvider } from '~/contexts/schedule';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ErrorPage } from './components/errors';
import * as React from 'react';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles, as: 'css' },
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
      integrity:
        'sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==',
      crossOrigin: 'anonymous',
      referrerPolicy: 'no-referrer',
    },
  ];
};

export const meta: MetaFunction = () => {
  const description = `Schedule your team tasks`;
  return {
    charset: 'utf-8',
    description,
    keywords: 'Rooster',
    // 'twitter:image': 'https://remix-jokes.lol/social.png',
    // 'twitter:card': 'summary_large_image',
    // 'twitter:creator': '@remix_run',
    // 'twitter:site': '@remix_run',
    // 'twitter:title': 'Remix Jokes',
    // 'twitter:description': description,
    visualViewport: 'width=device-width,initial-scale=1',
  };
};

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        {title ? <title>{title}</title> : null}
        <Links />
      </head>
      <body className="h-screen">
        <div id="dialog" />
        <div id="portal" />
        {children}
        {process.env.NODE_ENV === 'development' && <LiveReload />}
        {/* <Scripts /> */}
        <ScrollRestoration />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <DndProvider backend={HTML5Backend}>
        <ScheduleProvider>
          <DialogProvider>
            <Outlet />
          </DialogProvider>
        </ScheduleProvider>
      </DndProvider>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const location = useLocation();
  console.error('CatchBoundary', caught);

  if (caught.status === 404) {
    return (
      <html lang="en" className="dark">
        <head>
          <title>Oh no...</title>
          <Links />
        </head>
        <body className="bg-white transition duration-500 dark:bg-gray-900">
          <ErrorPage
            heroProps={{
              title: "404 - Oh no, you found a page that's missing stuff.",
              subtitle: `"${location.pathname}" is not a page on kentcdodds.com. So sorry.`,
              // image: (
              //   <MissingSomething className="rounded-lg" aspectRatio="3:4" />
              // ),
              // action: <ArrowLink href="/">Go home</ArrowLink>,
            }}
          />
          <Scripts />
        </body>
      </html>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
