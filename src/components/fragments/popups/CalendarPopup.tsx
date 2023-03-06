import SchedulePopup, { ScheduleParams } from "./SchedulePopup";
import { useTranslation } from "react-i18next";
import { Row } from "react-bootstrap";
import NavButton from "../navigation/NavButton";

export interface CalendarParams extends ScheduleParams {
  url: string,
  label: string
}

const CalendarPopup = (props: Readonly<CalendarParams>) => {
  const { t } = useTranslation();

  return (
    <>
      <SchedulePopup onSave={props.onSave} date={props.date} startTime={props.startTime} endTime={props.endTime} />
      <Row className="mb-3 justify-content-center">
        <NavButton to={props.url} className="w-25" >{t(props.label)}</NavButton>
      </Row>
    </>
  );
};

export default CalendarPopup;
