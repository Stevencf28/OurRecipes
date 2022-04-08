import { useParams } from "remix";

export default function CollectionId(): JSX.Element {
  const params = useParams();

  return <>Collection page for {params.id}</>;
}
