import { useState, useEffect } from "react";
import { EventSourceInput } from "@fullcalendar/react";
import { useTranslation } from "react-i18next";
import { getSchedules, EmployeeResponse } from "../../../api/employeeCalls";
import { toScheduleKey, scheduleToDate } from "../../../api/sharedTypes";
import { Container } from "react-bootstrap";
import ViewLoader from "../../fragments/util/ViewLoader";
import Calendar from "../../fragments/util/Calendar";

// Displays all workers schedules
const ScheduleList = () => {
  const [events, setEvents] = useState<EventSourceInput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const abort = new AbortController();

    getSchedules(abort).then(res => res.json()).then((data: EmployeeResponse[]) => {
      if (data) {
        const res = [];
        const dualNum = (x: number) => x > 9 ? x.toString() : `0${x}`;
        let count = 0;

        for (const emp of data) {
          for (const day in emp.schedule) {
            const tmp = emp.schedule[toScheduleKey(day)];
            const date = scheduleToDate(day);

            if (tmp.start && tmp.end && date !== null) {
              res.push({
                id: (count++).toString(),
                title: `${emp.name} ${emp.lastName}`,
                start: new Date(`${date.getFullYear()}-${dualNum(date.getMonth() + 1)}-${dualNum(date.getDate())}T${tmp.start}:00`),
                end: new Date(`${date.getFullYear()}-${dualNum(date.getMonth() + 1)}-${dualNum(date.getDate())}T${tmp.end}:00`)
              });
            }
          }
        }

        setEvents(res);
      }

      setIsLoading(false);
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.error(err);
        setIsLoading(false);
      }
    });

    return () => abort.abort();
  }, []);

  return (
    <Container className="my-5">
      <h1 className="text-center">{t("Staff.Schedules")}</h1>
      <ViewLoader isLoaded={!isLoading} element={<Calendar events={events} />} />
    </Container>
  );
};

export default ScheduleList;
