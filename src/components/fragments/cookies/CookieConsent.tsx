import { useState, useEffect } from "react";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { useTranslation } from "react-i18next";
import { getCookieConsentValue, acceptCookies } from "../../../helpers/cookieHelper";
import { Container, Row, Col } from "react-bootstrap";
import { customVar } from "../sharedParams";
import Button from "../util/Button";

// Custom cookie consent component
const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const darkMode = useDarkMode();
  const { t } = useTranslation();

  useEffect(() => {
    if (!getCookieConsentValue()) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) {
    return <></>;
  }

  const accept = () => {
    acceptCookies();
    setIsVisible(false);
  };

  return (
    <Container className={`consent bg-${customVar(darkMode)}`}>
      <Row className="consent-content">
        <Col className="pt-2">{t("Cookies.Info")}</Col>
        <Col md="auto">
          <Button onClick={accept}>{t("Cookies.Agree")}</Button>
        </Col>
        <Col md="auto">
          <Button onClick={accept}>{t("Cookies.Agree")}</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CookieConsent;
