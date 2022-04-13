import { LoaderFunction, MetaFunction, json, useLoaderData } from "remix";
import RecipeList from "~/components/recipe-list";
import Collection from "~/models/Collection.server";

interface CollectionInfo {
  name: string;
  recipes: number[];
}

interface LoaderData {
  collection?: CollectionInfo | undefined;
}

export const meta: MetaFunction = ({ data }) => {
  // Note: Do NOT remove that `?` for accessing the `collection` field from the data
  // I'm not sure if the data returned by the loader is always guaranteed to be
  // there. Don't get fooled by the `as LoaderData` part.
  const title =
    (data as LoaderData)?.collection?.name ?? "Collection Not Found";

  return { title };
};

export const loader: LoaderFunction = async ({ params }) => {
  let collection: CollectionInfo | undefined;

  if (params.id) {
    collection = (await Collection.findById(params.id)) ?? undefined;
  }
  const status = collection ? 200 : 404;
  return json<LoaderData>({ collection }, status);
};

export default function CollectionId(): JSX.Element {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <h3>Collection recipes for {data.collection?.name}</h3>
      <RecipeList recipes={[]} />
    </>
  );
}
