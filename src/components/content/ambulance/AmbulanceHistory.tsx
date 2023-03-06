import { useState, useEffect } from "react";
import { AmbulanceStateResponse, getAmbulanceHistory, AmbulanceHistoryResponse, changeAmbulanceState } from "../../../api/ambulanceCalls";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { licensePlateError } from "../sharedStrings";
import { unknownError, networkError } from "../sharedStrings";
import Enum from "../../fragments/values/Enum";
import { AmbulanceState } from "../../../api/enumCalls";
import DateDisplay from "../../fragments/values/DateDisplay";
import { Container, Row, Col } from "react-bootstrap";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import Spinner from "../../fragments/util/Spinner";
import Button from "../../fragments/util/Button";
import Error from "../../fragments/forms/Error";
import Table from "../../fragments/util/Table";

// Displays ambulance states history
const AmbulanceHistory = () => {
  const [states, setStates] = useState<AmbulanceStateResponse[]>([]);
  const [newState, setNewState] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(true);
  const { ambulanceId } = useParams();
  const { t } = useTranslation();
  const abort = useAbort();

  // Loads data to display
  useEffect(() => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    const abortUpdate = new AbortController();
    
    getAmbulanceHistory(ambulanceId, abortUpdate).then(res => res.json()).then((data: AmbulanceHistoryResponse) => {
      if (data.ambulanceHistory) {
        setStates(data.ambulanceHistory.map(s => ({
          type: s.type,
          timestamp: new Date(`${s.timestamp}Z`)
        })));
      }

      setIsLoading(false);
    }).catch(err => {
      if (abortUpdate.signal.aborted) {
        return;
      }

      console.error(err);
      setIsLoading(false);
    });

    return () => abortUpdate.abort();
  }, [ambulanceId]);

  const changeState = () => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    setError(undefined);
    const state = newState;

    changeAmbulanceState(ambulanceId, state, abort).then(res => {
      if (res.status === 200) {
        setStates([...states, {
          type: state,
          timestamp: new Date()
        }]);

        setError("");
      } else if (res.status === 204) {
        console.log(res);
        setError("Ambulance.SameState");
      } else {
        console.log(res);
        setError(unknownError);
      }
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }
      
      console.error(err);
      setError(networkError);
    });
  };

  const typeField = "type";
  const timestampField = "timestamp";

  const cols = [
    { name: t("Ambulance.Status"), property: (x: Readonly<AmbulanceStateResponse>) => <Enum enum={AmbulanceState} value={x.type} />, filterBy: typeField, sortBy: typeField, filterEnum: AmbulanceState },
    { name: t("Common.Since"), property: (x: Readonly<AmbulanceStateResponse>) => <DateDisplay value={x.timestamp} />, filterBy: timestampField, sortBy: timestampField }
  ];

  return (
    <Container className="mt-3 justify-content-center">
      <Row className="my-3 justify-content-end align-items-end">
        <Col>
          <EnumSelect id="newState" enum={AmbulanceState} value={newState} onLoad={setNewState} label={t("Ambulance.ChangeState")} onChange={e => setNewState(e.target.value)} />
        </Col>
        <Col md="auto">
          {error === undefined ? <Spinner /> : <Button onClick={changeState}>+</Button>}
        </Col>
      </Row>
      <Error className="my-3" error={error} />
      <h3 className="text-center">{t("Ambulance.History")}</h3>
      <Table columns={cols} data={states} isLoading={isLoading} />
    </Container>
  );
};

export default AmbulanceHistory;
