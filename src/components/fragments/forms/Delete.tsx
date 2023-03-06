import Button from "../util/Button";
import Spinner from "../util/Spinner";

export interface DeleteParams {
  canDelete: boolean,
  onClick?: () => void
}

// Delete button to use in elements lists
const Delete = (props: Readonly<DeleteParams>) => {
  return props.canDelete ? <Button onClick={props.onClick}>X</Button> : <Spinner />;
};

export default Delete;
