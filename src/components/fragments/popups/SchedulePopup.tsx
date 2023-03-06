import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePopup } from "../../../hooks/usePopup";
import Form from "../forms/Form";
import { Row } from "react-bootstrap";
import Date from "../forms/api/Date";
import Time from "../forms/api/Time";
import Button from "../util/Button";

export interface ScheduleParams {
  onSave: (start: string, end: string) => void,
  date?: string
  startTime?: string,
  endTime?: string
}

// Schedule edition popup
const SchedulePopup = (props: Readonly<ScheduleParams>) => {
  const [start, setStart] = useState(props.startTime ? props.startTime : "08:00");
  const [end, setEnd] = useState(props.endTime ? props.endTime : "16:00");
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const popup = usePopup();

  const onSubmit = () => {
    if (start >= end) {
      setError("Error.ScheduleEnd");
      return;
    }

    setError("");
    props.onSave(start, end);
    popup(null);
  };

  return (
    <Form onSubmit={onSubmit}>
      <h4 className="my-3 text-center">{t("Schedule.SetEvent")}</h4>
      {props.date ? (
        <Row className="mb-3 justify-content-center">
          <Date id="popup-date" className="w-50" label={t("Schedule.Date")} value={props.date} disabled />
        </Row>
      ) : ""}
      <Row className="mb-3 justify-content-center">
        <Time id="popup-start" className="w-50" label={t("Common.Since")} required value={start} onChange={e => setStart(e.target.value)} />
      </Row>
      <Row className="mb-5 justify-content-center">
        <Time id="popup-end" className="w-50" label={t("Common.Until")} required value={end} onChange={e => setEnd(e.target.value)} error={t(error)} />
      </Row>
      <Row className="mb-3 justify-content-center">
        <Button className="w-25" type="submit">{t("Common.Save")}</Button>
      </Row>
    </Form>
  );
};

export default SchedulePopup;
