import React from "react";
import { FormGroup, Form, Row } from "react-bootstrap";

interface FormControlParams {
  id?: string,
  className?: string,
  label?: string,
  required?: boolean,
  type?: string,
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  value?: string | number,
  placeholder?: string,
  disabled?: boolean,
  rowClass?: string
}

const FormControl = (props: Readonly<FormControlParams>) => {
  const content = (
    <FormGroup controlId={props.id} className={props.className}>
      {props.label ? <Form.Label>{props.label}</Form.Label> : ""}
      <Form.Control required={props.required} type={props.type ? props.type : "text"} onChange={props.onChange} value={props.value} placeholder={props.placeholder} disabled={props.disabled} />
    </FormGroup>
  );

  if (props.rowClass) {
    return (
      <Row className={props.rowClass}>
        {content}
      </Row>
    );
  }

  return content;
};

export default FormControl;
