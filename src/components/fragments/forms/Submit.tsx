import { ParentComponentParams } from "../sharedParams";
import Button from "../util/Button";
import Spinner from "../util/Spinner";

export interface SubmitParams extends ParentComponentParams {
  canSubmit: boolean
}

// Submit button which can be replaced with spinner
const Submit = (props: Readonly<SubmitParams>) => {
  return props.canSubmit ? <Button className={props.className} type="submit">{props.children}</Button> : <Spinner />;
};

export default Submit;
