import { RadioControlParams } from "./sharedFormsParams";
import { FormGroup, Form } from "react-bootstrap";

export interface FormRadioParams extends RadioControlParams {
  labelClass?: string,
  values: string[],
  value?: string
}

// Custom radio buttons component
const FormRadio = (props: Readonly<FormRadioParams>) => {
  return (
    <FormGroup className={props.className}>
      {props.label ? <Form.Label className={props.labelClass}>{props.label}{props.required ? <span className="req">*</span> : ""}</Form.Label> : ""}
      {props.values.map((val, index) => <Form.Check key={index} value={val} id={val} inline type="radio" label={val} className={props.innerClass} required={props.required} disabled={props.disabled} onChange={props.onChange} checked={val === props.value} />)}
      {props.error ? <span className="req">{props.error}</span> : ""}
    </FormGroup>
  );
};

export default FormRadio;
