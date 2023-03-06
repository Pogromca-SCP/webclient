import { TextControlParams } from "./sharedFormsParams";
import { FormGroup, Form } from "react-bootstrap";

export interface FormControlParams extends TextControlParams<HTMLInputElement | HTMLTextAreaElement> {
  minValue?: string | number,
  maxValue?: string | number,
  type?: string,
  pattern?: string,
  step?: string | number
}

// Custom form control component
const FormControl = (props: Readonly<FormControlParams>) => {
  return (
    <FormGroup controlId={props.id} className={props.className}>
      {props.label ? <Form.Label className={props.labelClass}>{props.label}{props.required ? <span className="req">*</span> : ""}</Form.Label> : ""}
      <Form.Control required={props.required} minLength={props.minLength} maxLength={props.maxLength} min={props.minValue} max={props.maxValue} step={props.step} pattern={props.pattern} className={props.innerClass} type={props.type ?? "text"} onChange={props.onChange} value={props.value} placeholder={props.placeholder} disabled={props.disabled} />
      {props.error ? <span className="req">{props.error}</span> : ""}
    </FormGroup>
  );
};

export default FormControl;
