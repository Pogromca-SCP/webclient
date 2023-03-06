import { NumberControlParams } from "./sharedFormsParams";
import FormControl from "./FormControl";

// Range form component
const Range = (props: Readonly<NumberControlParams>) => {
  return <FormControl type="range" {...props} />;
};

export default Range;
