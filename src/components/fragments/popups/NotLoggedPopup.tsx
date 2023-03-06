import { useTranslation } from "react-i18next";
import { Container, Row } from "react-bootstrap";
import NavButton from "../navigation/NavButton";

export interface NotLoggedPopupParams {
  redirect?: string
}

// Popup to use when user is not logged in
const NotLoggedPopup = (props: Readonly<NotLoggedPopupParams>) => {
  const { t } = useTranslation();
  const redirect = props.redirect ? `/${props.redirect}` : "";

  return (
    <Container className="text-center">
      <Row className="mt-3">
        <p>{t("Login.AllCapabilities")}</p>
      </Row>
      <Row className="mt-3 justify-content-center">
        <NavButton className="w-50" to={`/login${redirect}`}>{t("Login.SignIn")}</NavButton>
      </Row>
      <Row className="my-3 justify-content-center">
        <NavButton className="w-50" to={`/register${redirect}`}>{t("Login.SignUp")}</NavButton>
      </Row>
    </Container>
  );
};

export default NotLoggedPopup;
