import { SelectControlParams } from "./sharedFormsParams";
import { FormGroup, Form } from "react-bootstrap";

export interface FormSelectParams extends SelectControlParams {
  options?: string[],
  allValid?: boolean,
  provider?: (opt: string) => number | string | string[]
}

// Custom form select component
const FormSelect = (props: Readonly<FormSelectParams>) => {
  return (
    <FormGroup controlId={props.id} className={props.className}>
      {props.label ? <Form.Label className={props.labelClass}>{props.label}{props.required ? <span className="req">*</span> : ""}</Form.Label> : ""}
      <Form.Select className={props.innerClass} required={props.required} value={props.value} onChange={props.onChange} disabled={props.disabled}>
        {props.options ? props.options.map((opt, index) => <option key={index} value={index === 0 && !props.allValid ? "" : (props.provider ? props.provider(opt) : index)}>{opt}</option>) : ""}
      </Form.Select>
      {props.error ? <span className="req">{props.error}</span> : ""}
    </FormGroup>
  );
};

export default FormSelect;
