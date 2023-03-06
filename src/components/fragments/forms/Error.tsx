import { ClassNameParam } from "../sharedParams";
import { useTranslation } from "react-i18next";
import { Alert } from "react-bootstrap";

export interface ErrorParams extends ClassNameParam {
  error?: string,
  innerLabel?: string
  innerError?: string
}

// Custom form error display component
const Error = (props: Readonly<ErrorParams>) => {
  const { t } = useTranslation();

  return (
    <>
      {props.error ? (
        <Alert variant="danger" className={props.className}>
          <Alert.Heading>{t("Error.Error")}</Alert.Heading>
          <p>{t(props.error)}</p>
          {props.innerError ? (
            <>
              {props.innerLabel ? (
                <p>
                  <b>{t(props.innerLabel)}</b>
                </p>
              ) : ""}
              <p>{t(props.innerError)}</p>
            </>
          ) : ""}
        </Alert>
      ) : ""}
    </>
  );
};

export default Error;
