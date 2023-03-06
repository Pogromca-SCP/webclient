import { AmbulanceResponse } from "../../../api/ambulanceCalls";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { useRoles } from "../../../hooks/useAuth";
import { hasPerm, ambulanceManagement } from "../../../helpers/authHelper";
import { getAmbulances } from "../../../api/ambulanceCalls";
import { AmbulanceState, AmbulanceClass, AmbulanceType } from "../../../api/enumCalls";
import { addAmbulances } from "../../../api/incidentCalls";
import { unknownError, networkError } from "../sharedStrings";
import FormCheck from "../../fragments/forms/FormCheck";
import Link from "../../fragments/navigation/Link";
import Enum from "../../fragments/values/Enum";
import { Container } from "react-bootstrap";
import Spinner from "../../fragments/util/Spinner";
import Button from "../../fragments/util/Button";
import Error from "../../fragments/forms/Error";
import Table from "../../fragments/util/Table";

interface Ambulance extends AmbulanceResponse {
  assigned: boolean
}

// Displays ambulances that can be assigned to incident
const AssignAmbulance = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const { reportId } = useParams();
  const { t } = useTranslation();
  const abort = useAbort();
  const roles = useRoles();
  const ambulanceAccess = hasPerm(roles, ambulanceManagement);

  useEffect(() => {
    const abortUpdate = new AbortController();

    getAmbulances(abortUpdate).then(res => res.json()).then((data: AmbulanceResponse[]) => {
      if (data) {
        setAmbulances(data.filter(a => a.ambulanceStateType === AmbulanceState.available).map(a => ({
          ...a,
          assigned: false
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
  }, []);

  const submit = () => {
    if (reportId === undefined) {
      return;
    }

    setError(undefined);
    const toAdd = ambulances.filter(a => a.assigned).map(a => a.licensePlate);

    if (toAdd.length < 1) {
      setError("");
      return;
    }

    addAmbulances(parseInt(reportId), toAdd, abort).then(res => {
      if (res.ok) {
        setAmbulances(ambulances.filter(a => !a.assigned));
        setError("");
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

  const licenseField = "licensePlate";
  const classField = "ambulanceClass";
  const typeField = "ambulanceType";

  const assign = (x: Ambulance) => setAmbulances(ambulances.map(a => a === x ? ({
    ...a,
    assigned: !x.assigned
  }) : a));

  const cols = [
    { name: t("Report.Assigned"), property: (x: Readonly<Ambulance>) => <FormCheck value={x.assigned} onChange={e => assign(x)} disabled={error === undefined} /> },
    { name: t("Ambulance.LicensePlate"), property: (x: Readonly<Ambulance>) => ambulanceAccess ? <Link to={`/ambulances/${x.licensePlate}`}>{x.licensePlate}</Link> : x.licensePlate, filterBy: licenseField, sortBy: licenseField },
    { name: t("Ambulance.Class"), property: (x: Readonly<Ambulance>) => <Enum enum={AmbulanceClass} value={x.ambulanceClass} />, filterBy: classField, sortBy: classField, filterEnum: AmbulanceClass },
    { name: t("Ambulance.Type"), property: (x: Readonly<Ambulance>) => <Enum enum={AmbulanceType} value={x.ambulanceType} />, filterBy: typeField, sortBy: typeField, filterEnum: AmbulanceType }
  ];

  return (
    <Container className="my-3 justify-content-center text-center">
      <h1>{t("HomePage.AmbulancesAvailable")}</h1>
      {isLoading || error === undefined ? <Spinner className="my-3" /> : <Button onClick={submit} className="my-3">{t("Report.Assign")}</Button>}
      <Error className="mb-3 text-start" error={error} />
      <Table columns={cols} data={ambulances} isLoading={isLoading} />
    </Container>
  );
};

export default AssignAmbulance;
