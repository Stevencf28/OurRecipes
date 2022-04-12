import { Button } from "react-bootstrap";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  Outlet,
  json,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import Collection from "~/models/Collection.server";
import { requireUser } from "~/utils/auth.server";
import {
  FieldValidationResult,
  validateNonEmpty,
} from "~/utils/inputValidation";

/**
 * Server-side handler of GET requests
 */
export const loader: LoaderFunction = async () => {
  // TODO
  return null;
};

interface ActionDataBase<Status extends string, OpType extends string> {
  status: Status;
  opType: OpType;
}

interface ActionErrorData extends ActionDataBase<"error", "unknown"> {
  error: string;
}

interface AddActionErrorData extends ActionDataBase<"error", "add"> {
  name: FieldValidationResult;
  error?: string;
}

interface AddActionSuccessData extends ActionDataBase<"success", "add"> {}

type ActionData = ActionErrorData | AddActionErrorData | AddActionSuccessData;

/**
 * Server-side handler of POST requests
 *
 * The server expects the following data.
 *
 * - `type: "add"` - type of operation to do
 * - In case of `"add"` operation:
 *   - `name: string` - non-empty name of the collection to add
 *
 * Hidden input fields are useful for specifying the type of the operation to
 * do without require the user to manually enter the data.
 */
export const action: ActionFunction = async ({ request }) => {
  const [user, form] = await Promise.all([
    requireUser(request),
    request.formData(),
  ]);
  const opType = form.get("type");

  if (opType !== "add") {
    return json<ActionErrorData>(
      {
        status: "error",
        opType: "unknown",
        error: 'Unsupported operation type: `type` must be "add"',
      },
      400,
    );
  }

  switch (opType) {
    case "add": {
      // Validate the collection name
      const name = validateNonEmpty(form.get("name"));
      if (name.error) {
        return json<AddActionErrorData>(
          { status: "error", opType: "add", name },
          400,
        );
      }

      // Check if there is already one with same name
      const checkUnique = await Collection.findOne({
        user: user._id,
        name: name.value,
      });
      if (checkUnique) {
        return json<AddActionErrorData>(
          {
            status: "error",
            opType: "add",
            name,
            error: "The name is already in use",
          },
          400,
        );
      }

      // Create a new collection
      const newCollection = new Collection({
        user: user._id,
        name: name.value,
      });
      await newCollection.save();

      // Redirect to the page for the new collection
      return redirect(`/account/collections/${newCollection._id}`);
    } // case "add"

    // to be added
  }
};

/**
 * UI of this page
 */
export default function Collections(): JSX.Element {
  // data for the error intake for add collection
  const actionData = useActionData<ActionData>();

  // Transition for the intake input of the user for add collection
  const { state, type } = useTransition();
  const isLoading = state === "submitting" || type === "actionRedirect";

  // NOTE: Probably put a list of collections on the left side with each item
  // being a link to the collection page, and render the child page using the
  // <Outlet /> component.
  // ex) <NavLink to={collection._id}>{collection.name || "Default"}</NavLink>
  return (
    <>
      <h3>Collections</h3>
      <Form method="post">
        {/* for easy disabling of all fields */}
        <fieldset disabled={isLoading}>
          <input type="hidden" name="type" value="add" />
          <div className="mb-3">
            <label htmlFor="new-name" className="form-label">
              Collection Name
            </label>
            {/* Error Handling */}
            {actionData?.status === "error" && (
              <p className="alert alert-danger" role="alert">
                {actionData.error}
              </p>
            )}
            <input
              type="text"
              name="name"
              id="new-name"
              className="form-control"
              required
            />
          </div>
          {isLoading ? (
            // Show the loading spinner if the form is being submitted
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary mt-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            // When not loading, show the error  if it exists
            actionData?.opType && (
              <div className="error alert alert-danger mt-3 mb-0" role="alert">
                {actionData.status}
              </div>
            )
          )}
          <Button type="submit">Add Collection</Button>
        </fieldset>
      </Form>

      <Outlet />
    </>
  );
}
