import { OkParams } from "./OkPopup";
import { useTranslation } from "react-i18next";
import { usePopup } from "../../../hooks/usePopup";
import { Container, Row } from "react-bootstrap";
import Button from "../util/Button";

export interface ConfirmParams extends OkParams {
  onConfirm: () => void
}

// Confirmation popup
const ConfirmPopup = (props: Readonly<ConfirmParams>) => {
  const { t } = useTranslation();
  const popup = usePopup();

  const conf = () => {
    popup(null);
    props.onConfirm();
  };

  return (
    <Container className="text-center">
      <Row className="mt-3">
        <p>{t(props.text)}</p>
      </Row>
      <Row xs={2} className="my-3 justify-content-around">
        <Button className="w-25" onClick={conf}>{t("Common.Ok")}</Button>
        <Button className="w-25" onClick={() => popup(null)}>{t("Common.Cancel")}</Button>
      </Row>
    </Container>
  );
};

export default ConfirmPopup;
