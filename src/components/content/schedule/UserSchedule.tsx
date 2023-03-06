import { useState, useEffect } from "react";
import { Schedule as ScheduleData, getEmptySchedule, loadSchedule, formatSchedule } from "../../../api/sharedTypes";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { getSchedule, ScheduleResponse, updateSchedule } from "../../../api/employeeCalls";
import { missingDataError, loadingError, unknownError, networkError } from "../sharedStrings";
import { Container, Row } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import Schedule from "../../fragments/values/Schedule";
import Submit from "../../fragments/forms/Submit";
import Error from "../../fragments/forms/Error";

// Schedule edit form component
const UserSchedule = () => {
  const [data, setData] = useState<ScheduleData>(getEmptySchedule());
  const [error, setError] = useState<string | undefined>("");
  const { t } = useTranslation();
  const abort = useAbort();

  useEffect(() => {
    setError(undefined);
    const abortUpdate = new AbortController();

    getSchedule(abortUpdate).then(res => res.json()).then((data: ScheduleResponse) => {
      if (data.schedule) {
        setData(loadSchedule(data.schedule));
        setError("");
      } else {
        console.log(data);
        setError(missingDataError);
      }
    }).catch(err => {
      if (!abortUpdate.signal.aborted) {
        console.error(err);
        setError(loadingError);
      }
    });

    return () => abortUpdate.abort();
  }, []);

  const onSubmit = () => {
    setError(undefined);

    updateSchedule({
      workSchedule: formatSchedule(data)
    }, abort).then(res => {
      if (res.ok) {
        setError("");
      } else {
        console.log(res);
        setError(unknownError);
      }
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.error(err);
        setError(networkError);
      }
    });
  };

  return (
    <Container className="my-3">
      <h1 className="mb-3">{t("Schedule.Schedule")}</h1>
      <Form onSubmit={onSubmit}>
        <Row className="justify-content-center text-center">
          <Schedule value={data} onChange={x => setData(x)} />
        </Row>
        <Row className="justify-content-center text-center">
          <Submit className="mb-3 w-25" canSubmit={error !== undefined}>{t("Common.SaveChanges")}</Submit>
        </Row>
        <Error error={error} />
      </Form>
    </Container>
  );
};

export default UserSchedule;
