import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix';
import type { MetaFunction } from 'remix';
import styles from './tailwind.css';
import { DialogProvider } from '~/contexts/dialog';
import { ScheduleProvider } from '~/contexts/schedule';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

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
