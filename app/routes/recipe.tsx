import { Outlet } from "remix";

/**
 * The React component used for all routes starting with `/recipe`
 *
 * This is mostly used for providing the outermost layout.
 */
export default function RecipePageLayout(): JSX.Element {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}
