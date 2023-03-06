import { ParentComponentParams } from "../sharedParams";
import { FormEvent } from "react";
import { Form as Inner } from "react-bootstrap";

export interface FormParams extends ParentComponentParams {
  onSubmit?: () => void
}

// Custom form component
const Form = (props: Readonly<FormParams>) => {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (props.onSubmit) {
      props.onSubmit();
    }
  };

  return <Inner onSubmit={submit} className={props.className}>{props.children}</Inner>;
};

export default Form;
