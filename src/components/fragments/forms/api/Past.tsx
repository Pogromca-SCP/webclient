import { DateControlParams } from "../sharedFormsParams";
import { useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import Dat from "./Date";

// Past constraint validation component
const Past = (props: Readonly<DateControlParams>) => {
  const [error, setError] = useState(props.error);
  const { t } = useTranslation();

  const onUpdate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!props.onChange) {
      return;
    }

    setError(props.error);
    const value = e.target.value;
    
    if (value && new Date(value) >= new Date()) {
      setError(t("Error.Past"));
      return;      
    }

    props.onChange(e);
  };

  const args = {
    ...props,
    onChange: onUpdate
  };

  delete args.error;
  return <Dat error={error} {...args} />;
};

export default Past;
