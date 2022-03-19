import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import { ReactNode } from "react";
import SSRProvider from "react-bootstrap/SSRProvider";
import type { MetaFunction } from "remix";
import {
  ErrorBoundaryComponent,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import rootStyles from "~/styles/root.css";
import Navigation from "./components/navigation";

/**
 * Meta tags to add; can be overridden by child routes
 */
export const meta: MetaFunction = () => ({ title: "Our Recipes" });

/**
 * Link tags to add including stylesheets
 */
export const links: LinksFunction = () => [
  {
    // Bootstrap 5.1.3 stylesheet
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    integrity:
      "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3",
    crossOrigin: "anonymous",
  },
  {
    // Our custom global styles
    rel: "stylesheet",
    href: rootStyles,
  },
];

interface DocumentProps {
  children?: ReactNode;
}

function Document({ children }: DocumentProps): JSX.Element {
  // NOTE: We could create a layout component in the components folder
  // or just make a navbar component and bring it here
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <SSRProvider>
          <Navigation />
          {children}
        </SSRProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

/**
 * Default HTML document
 */
export default function App(): JSX.Element {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

/**
 * Root-level catch boundary for thrown responses
 */
export const CatchBoundary: CatchBoundaryComponent = (): JSX.Element => {
  const thrownResponse = useCatch();

  // TODO: proper layout for root catch boundary
  return (
    <Document>
      <h1 className="mb-3">
        {`${thrownResponse.status} ${thrownResponse.statusText}`}
      </h1>
      {process.env.NODE_ENV != "production" && (
        <pre>{JSON.stringify(thrownResponse.data)}</pre>
      )}
    </Document>
  );
};

/**
 * Root-level error boundary for uncaught errors
 */
export const ErrorBoundary: ErrorBoundaryComponent = ({
  error,
}): JSX.Element => (
  // TODO: proper layout for root error boundary
  <Document>
    <h1 className="mb-3">Application Error</h1>
    <p>{error.message}</p>
    {process.env.NODE_ENV !== "production" && <pre>{error.stack}</pre>}
  </Document>
);
