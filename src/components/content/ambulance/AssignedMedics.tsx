import { MedicResponse, getMedics, removeMedics } from "../../../api/ambulanceCalls";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { licensePlateError } from "../sharedStrings";
import Delete from "../../fragments/forms/Delete";
import { Container, Row, Col } from "react-bootstrap";
import NavButton from "../../fragments/navigation/NavButton";
import Table from "../../fragments/util/Table";

// Displays a list of assigned medics
const AssignedMedics = () => {
  const [medics, setMedics] = useState<MedicResponse[]>([]);
  const [removed, setRemoved] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ambulanceId } = useParams();
  const { t } = useTranslation();
  const abort = useAbort();

  // Loads medics to display
  useEffect(() => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    const abortUpdate = new AbortController();

    getMedics(ambulanceId, abortUpdate).then(res => res.json()).then((data: MedicResponse[]) => {
      if (data) {
        setMedics(data);
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

  const remove = (x: number) => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    setRemoved([...removed, x]);
    
    removeMedics(ambulanceId, [x], abort).then(res => {
      if (res.ok) {
        setMedics(medics.filter(m => m.userId !== x));
      } else {
        console.log(res);
      }

      setRemoved(removed.filter(u => u !== x));
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }

      console.error(err);
      setRemoved(removed.filter(u => u !== x));
    });
  };

  const firstField = "firstName";
  const lastField = "lastName";
  const emailField = "email";

  const cols = [
    { name: t("Person.FirstName"), property: firstField, filterBy: firstField, sortBy: firstField },
    { name: t("Person.LastName"), property: lastField, filterBy: lastField, sortBy: lastField },
    { name: t("Person.Email"), property: emailField, filterBy: emailField, sortBy: emailField },
    { name: t("Medic.Unassign"), property: (x: Readonly<MedicResponse>) => <Delete onClick={() => remove(x.userId)} canDelete={!removed.includes(x.userId)} /> }
  ];

  return (
    <Container className="my-3 justify-content-center text-center">
      <h1>{t("Medic.Assigned")}</h1>
      <Row className="my-2 justify-content-end">
        <Col />
        <Col md="auto">
          <NavButton to="add">+</NavButton>
        </Col>
      </Row>
      <Table columns={cols} data={medics} isLoading={isLoading} />
    </Container>
  );
};

export default AssignedMedics;
