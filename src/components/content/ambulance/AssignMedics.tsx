import { MedicResponse, addMedics } from "../../../api/ambulanceCalls";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { licensePlateError, unknownError, networkError } from "../sharedStrings";
import { getFreeMedics, MedicResponse as UserResponse } from "../../../api/employeeCalls";
import FormCheck from "../../fragments/forms/FormCheck";
import { Container } from "react-bootstrap";
import Spinner from "../../fragments/util/Spinner";
import Button from "../../fragments/util/Button";
import Error from "../../fragments/forms/Error";
import Table from "../../fragments/util/Table";

interface Medic extends MedicResponse {
  assigned: boolean
}

// Displays all medics that can be assigned to ambulance
const AssignMedics = () => {
  const [medics, setMedics] = useState<Medic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const { ambulanceId } = useParams();
  const { t } = useTranslation();
  const abort = useAbort();
  const navigate = useNavigate();

  useEffect(() => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    const abortUpdate = new AbortController();

    getFreeMedics(abortUpdate).then(res => res.json()).then((data: UserResponse[]) => {
      if (data) {
        setMedics(data.map(m => ({
          ...m,
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
  }, [ambulanceId]);

  const submit = () => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    setError(undefined);
    const toAdd = medics.filter(m => m.assigned).map(m => m.userId);

    if (toAdd.length < 1) {
      navigate("../medics");
      return;
    }

    addMedics(ambulanceId, toAdd, abort).then(res => {
      if (res.ok) {
        navigate("../medics");
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

  const assign = (x: Medic) => setMedics(medics.map(m => m === x ? ({
    ...m,
    assigned: !x.assigned
  }) : m));

  const firstField = "firstName";
  const lastField = "lastName";
  const emailField = "email";

  const cols = [
    { name: t("Medic.Assigned"), property: (x: Readonly<Medic>) => <FormCheck value={x.assigned} onChange={e => assign(x)} disabled={error === undefined} /> },
    { name: t("Person.FirstName"), property: firstField, filterBy: firstField, sortBy: firstField },
    { name: t("Person.LastName"), property: lastField, filterBy: lastField, sortBy: lastField },
    { name: t("Person.Email"), property: emailField, filterBy: emailField, sortBy: emailField }
  ];

  return (
    <Container className="my-3 justify-content-center text-center">
      <h1>{t("Medic.Assign")}</h1>
      {isLoading || error === undefined ? <Spinner className="my-3" /> : <Button onClick={submit} className="my-3">{t("Medic.Assign")}</Button>}
      <Error className="mb-3 text-start" error={error} />
      <Table columns={cols} data={medics} isLoading={isLoading} />
    </Container>
  );
};

export default AssignMedics;
