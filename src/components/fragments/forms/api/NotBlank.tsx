import { RawTextControlParams } from "../sharedFormsParams";
import FormControl from "../FormControl";

// Not blank constraint validation component
const NotBlank = (props: Readonly<RawTextControlParams>) => {
  return <FormControl maxLength={100} pattern=".*\S.*" {...props} />;
};

export default NotBlank;
