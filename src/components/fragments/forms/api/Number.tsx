import { NumberControlParams } from "../sharedFormsParams";
import FormControl from "../FormControl";

// Number constraint validation component
const Number = (props: Readonly<NumberControlParams>) => {
  return <FormControl type="number" {...props} />;
};

export default Number;
