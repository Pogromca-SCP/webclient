import { ChangeEventHandler, useState, ChangeEvent } from "react";
import FormControl from "../FormControl";

export interface PastParams {
  id?: string,
  className?: string,
  label?: string,
  labelClass?: string,
  innerClass?: string,
  required?: boolean,
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  value?: string | number | string[],
  placeholder?: string,
  disabled?: boolean,
  error?: string
}

const Past = (props: Readonly<PastParams>) => {
  const [error, setError] = useState(props.error);

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value && new Date(value) >= new Date(Date.now())) {
      setError("Można podać tylko datę w przeszłości");
      return;      
    }

    if (props.onChange) {
      props.onChange(e);
    }
  };

  return <FormControl type="date" error={error} onChange={onUpdate} {...props} />;
};

export default Past;
