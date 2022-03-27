import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
  useMatches,
} from 'remix';
import type { MetaFunction } from 'remix';
import styles from './tailwind.css';
import { DialogProvider } from '~/contexts/dialog';
import { ScheduleProvider } from '~/contexts/schedule';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ErrorPage } from './components/errors';
import * as React from 'react';

export function links() {
  return [{ rel: 'stylesheet', href: styles, as: 'css' }];
}

export const meta: MetaFunction = () => {
  return { title: 'Rooster' };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <Links />
      </head>
      <body className="h-screen">
        <DndProvider backend={HTML5Backend}>
          <ScheduleProvider>
            <DialogProvider>
              <Outlet />
            </DialogProvider>
          </ScheduleProvider>
        </DndProvider>
        <div id="dialog" />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
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
