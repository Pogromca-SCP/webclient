import { IdControlParams } from "./sharedFormsParams";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import { FormGroup, Form } from "react-bootstrap";

export interface FormCheckParams extends IdControlParams<HTMLInputElement> {
  value?: string | number | boolean,
  icon?: L.Icon<L.IconOptions> | L.DivIcon
}

// Custom form checkbox component
const FormCheck = (props: Readonly<FormCheckParams>) => {
  const { t } = useTranslation();
  const size = props.icon?.options.iconSize as number[] ?? [25, 40];

  return (
    <FormGroup className={props.className}>
      <Form.Check id={props.id} className={props.innerClass} required={props.required} label={(
        <>
          {props.icon ? <img src={props.icon.options.iconUrl} alt={t("Icon")} style={{
            height: `${size[1]}px`,
            width: `${size[0]}px`
          }} /> : ""}
          {props.label}
          {props.required ? <span className="req">*</span> : ""}
        </>
      )} onChange={props.onChange} checked={props.value ? true : false} disabled={props.disabled} />
      {props.error ? <span className="req">{props.error}</span> : ""}
    </FormGroup>
  );
};

export default FormCheck;
