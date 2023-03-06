import { RawTextControlParams } from "./sharedFormsParams";
import { FormGroup, Form } from "react-bootstrap";

// Custom form control with phone number pattern check
const FormPhoneNumber = (props: Readonly<RawTextControlParams>) => {
  return (
    <FormGroup controlId={props.id} className={props.className}>
      {props.label ? <Form.Label className={props.labelClass}>{props.label}{props.required ? <span className="req">*</span> : ""}</Form.Label> : ""}
      <Form.Control required={props.required} className={props.innerClass} type="text" pattern="(\+[0-9]{2})?[0-9]{9}" onChange={props.onChange} value={props.value} placeholder={props.placeholder} disabled={props.disabled} />
      {props.error ? <span className="req">{props.error}</span> : ""}
    </FormGroup>
  );
};

export default FormPhoneNumber;
