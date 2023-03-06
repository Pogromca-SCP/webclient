import { useState, useEffect } from "react";
import { IncidentResponse } from "../../../api/incidentCalls";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useRoles } from "../../../hooks/useAuth";
import { hasPerm, incidentInfo } from "../../../helpers/authHelper";
import { licensePlateError } from "../sharedStrings";
import { getAmbulanceIncidents } from "../../../api/ambulanceCalls";
import Link from "../../fragments/navigation/Link";
import Enum from "../../fragments/values/Enum";
import { IncidentType } from "../../../api/enumCalls";
import { Container } from "react-bootstrap";
import Table from "../../fragments/util/Table";

// Displays all ambulance related incidents
const RelatedIncidents = () => {
  const [reports, setReports] = useState<IncidentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { ambulanceId } = useParams();
  const roles = useRoles();
  const canAccess = hasPerm(roles, incidentInfo);

  useEffect(() => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    const abortUpdate = new AbortController();

    getAmbulanceIncidents(ambulanceId, abortUpdate).then(res => res.json()).then((data: Record<string, IncidentResponse[]>) => {
      if (data) {
        let tmp: IncidentResponse[] = [];

        for (const key in data) {
          tmp = tmp.concat(data[key]);
        }

        setReports(tmp);
      }

      setIsLoading(false);
    }).catch(err => {
      if (!abortUpdate.signal.aborted) {
        console.error(err);
        setIsLoading(false);
      }
    });

    return () => abortUpdate.abort();
  }, [ambulanceId]);

  const idField = "incidentId";
  const statusField = "incidentStatusType";
  const dangerField = "dangerScale";
  const reactionField = "reactionJustification";

  const cols = [
    { name: "#", property: (x: Readonly<IncidentResponse>) => canAccess ? <Link to={`/reports/${x.incidentId}`}>{x.incidentId}</Link> : x.incidentId, filterBy: idField, sortBy: idField },
    { name: t("Report.StatusType"), property: (x: Readonly<IncidentResponse>) => <Enum enum={IncidentType} value={x.incidentStatusType} />, filterBy: statusField, sortBy: statusField, filterEnum: IncidentType },
    { name: t("Report.DangerScale"), property: dangerField, filterBy: dangerField, sortBy: dangerField },
    { name: t("Report.Justification"), property: reactionField, filterBy: reactionField, sortBy: reactionField }
  ];

  return (
    <Container className="mt-3 justify-content-center text-center">
      <h1>{t("Ambulance.RelatedIncidents")}</h1>
      <Table columns={cols} data={reports} isLoading={isLoading} />
    </Container>
  );
};

export default RelatedIncidents;
