import { RawTextControlParams } from "../sharedFormsParams";
import FormControl from "../FormControl";

export interface LengthParams extends RawTextControlParams {
  length: number,
  minLength?: number
}

// Length constraint validation component
const Length = (props: Readonly<LengthParams>) => {
  return <FormControl pattern={`\\S{${props.minLength === undefined ? props.length : `${props.minLength},${props.length}`}}`} {...props} />;
};

export default Length;
