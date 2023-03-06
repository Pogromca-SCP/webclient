import { useState, useEffect } from "react";
import { VictimResponse, getIncidentVictims } from "../../../api/incidentCalls";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Link from "../../fragments/navigation/Link";
import Enum from "../../fragments/values/Enum";
import { Gender, VictimStatus } from "../../../api/enumCalls";
import { Container, Row, Col } from "react-bootstrap";
import NavButton from "../../fragments/navigation/NavButton";
import Table from "../../fragments/util/Table";

// Displays all reported victims
const VictimsList = () => {
  const [victims, setVictims] = useState<VictimResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { reportId } = useParams();

  useEffect(() => {
    if (reportId === undefined) {
      return;
    }

    const abortUpdate = new AbortController();

    getIncidentVictims(parseInt(reportId), abortUpdate).then(res => res.json()).then((data: VictimResponse[]) => {
      if (data) {
        setVictims(data);
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
  }, [reportId]);

  const idField = "victimInfoId";
  const nameField = "firstName";
  const lastField = "lastName";
  const gendField = "gender";
  const statField = "status";

  const cols = [
    { name: "#", property: (x: Readonly<VictimResponse>) => <Link to={`edit/${x.victimInfoId}`}>{x.victimInfoId}</Link>, filterBy: idField, sortBy: idField },
    { name: t("Person.FirstName"), property: nameField, filterBy: nameField, sortBy: nameField },
    { name: t("Person.LastName"), property: lastField, filterBy: lastField, sortBy: lastField },
    { name: t("Person.Gender"), property: (x: Readonly<VictimResponse>) => <Enum enum={Gender} value={x.gender} />, filterBy: gendField, sortBy: gendField, filterEnum: Gender },
    { name: t("Victim.Status"), property: (x: Readonly<VictimResponse>) => <Enum enum={VictimStatus} value={x.status} />, filterBy: statField, sortBy: statField, filterEnum: VictimStatus }
  ];

  return (
    <Container className="mt-3 justify-content-center text-center">
      <h1>{t("Report.Victims")}</h1>
      <Row className="my-2 justify-content-end">
        <Col />
        <Col md="auto">
          <NavButton to="new">+</NavButton>
        </Col>
      </Row>
      <Table columns={cols} data={victims} isLoading={isLoading} />
    </Container>
  );
};

export default VictimsList;
