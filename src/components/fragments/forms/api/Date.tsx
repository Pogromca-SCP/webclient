import { DateControlParams } from "../sharedFormsParams";
import FormControl from "../FormControl";

// Date constraint validation component
const Date = (props: Readonly<DateControlParams>) => {
  return <FormControl type={props.withTime ? "datetime-local" : "date"} {...props} />;
};

export default Date;
