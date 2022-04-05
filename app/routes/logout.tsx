import { ActionFunction, LoaderFunction, redirect } from "remix";
import { logout } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

/**
 * The react component for the UI for this page
 */
export default function Logout() {
  return <></>;
}
