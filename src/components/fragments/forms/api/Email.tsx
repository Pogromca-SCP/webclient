import { RawTextControlParams } from "../sharedFormsParams";
import FormControl from "../FormControl";

// Email constraint validation component
const Email = (props: Readonly<RawTextControlParams>) => {
  return <FormControl maxLength={100} type="email" {...props} />;
};

export default Email;
