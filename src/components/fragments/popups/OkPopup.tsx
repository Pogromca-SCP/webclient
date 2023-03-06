import { useTranslation } from "react-i18next";
import { usePopup } from "../../../hooks/usePopup";
import { Container, Row } from "react-bootstrap";
import Button from "../util/Button";

export interface OkParams {
  text: string
}

// Informational popup
const OkPopup = (props: Readonly<OkParams>) => {
  const { t } = useTranslation();
  const popup = usePopup();

  return (
    <Container className="text-center">
      <Row className="mt-3">
        <p>{t(props.text)}</p>
      </Row>
      <Row className="my-3 justify-content-center">
        <Button className="w-25" onClick={() => popup(null)}>{t("Common.Ok")}</Button>
      </Row>
    </Container>
  );
};

export default OkPopup;
