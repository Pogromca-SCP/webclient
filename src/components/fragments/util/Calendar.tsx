import FullCalendar, { EventSourceInput, EventClickArg } from "@fullcalendar/react";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { useTranslation } from "react-i18next";
import { customTheme } from "../sharedParams";
import listPlugin from "@fullcalendar/list";
import plLocale from "@fullcalendar/core/locales/pl";
import enLocale from "@fullcalendar/core/locales/en-gb";

export interface CalendarParams {
  events?: EventSourceInput,
  onClick?: (x: DateClickArg) => void,
  onSelect?: (x: EventClickArg) => void
}

// Full calendar wrapper component
const Calendar = (props: Readonly<CalendarParams>) => {
  const darkMode = useDarkMode();
  const { i18n } = useTranslation();

  return (
    <span className={`calendar-${customTheme(darkMode)}`}>
      <FullCalendar plugins={[listPlugin, interactionPlugin]} initialView="listWeek" displayEventTime displayEventEnd selectable headerToolbar={false} initialEvents={props.events} expandRows locale={i18n.language === "pl" ? plLocale : enLocale} dateClick={props.onClick} eventClick={props.onSelect} />
    </span>
  );
};

export default Calendar;
