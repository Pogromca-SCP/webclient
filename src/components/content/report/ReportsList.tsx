import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePopup } from "../../../hooks/usePopup";
import { useAbort } from "../../../hooks/useAbort";
import { useRoles } from "../../../hooks/useAuth";
import { hasPerm, incidentManagement } from "../../../helpers/authHelper";
import { IncidentResponse, getIncidents, deleteIncident } from "../../../api/incidentCalls";
import Table, { TableColumnParams } from "../../fragments/util/Table";
import Link from "../../fragments/navigation/Link";
import Enum from "../../fragments/values/Enum";
import { IncidentType } from "../../../api/enumCalls";
import Delete from "../../fragments/forms/Delete";
import ConfirmPopup from "../../fragments/popups/ConfirmPopup";
import { Container } from "react-bootstrap";

// Displays all reported incidents
const ReportsList = () => {
  const [reports, setReports] = useState<IncidentResponse[]>([]);
  const [removed, setRemoved] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const popup = usePopup();
  const abort = useAbort();
  const roles = useRoles();
  const canRemove = hasPerm(roles, incidentManagement);

  useEffect(() => {
    const abortUpdate = new AbortController();

    getIncidents(abortUpdate).then(res => res.json()).then((data: IncidentResponse[]) => {
      if (data) {
        setReports(data);
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

  const remove = (id: number) => {
    if (!canRemove) {
      return;
    }

    setRemoved([...removed, id]);
    
    deleteIncident(id, abort).then(res => {
      if (res.ok) {
        setReports(reports.filter(r => r.incidentId !== id));
      } else {
        console.log(res);
      }

      setRemoved(removed.filter(i => i !== id));
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }
      
      console.error(err);
      setRemoved(removed.filter(i => i !== id));
    });
  };

  const idField = "incidentId";
  const statusField = "incidentStatusType";
  const dangerField = "dangerScale";
  const reactionField = "reactionJustification";

  const cols: TableColumnParams<IncidentResponse>[] = [
    { name: "#", property: (x: Readonly<IncidentResponse>) => <Link to={x.incidentId.toString()}>{x.incidentId}</Link>, filterBy: idField, sortBy: idField },
    { name: t("Report.StatusType"), property: (x: Readonly<IncidentResponse>) => <Enum enum={IncidentType} value={x.incidentStatusType} />, filterBy: statusField, sortBy: statusField, filterEnum: IncidentType },
    { name: t("Report.DangerScale"), property: dangerField, filterBy: dangerField, sortBy: dangerField },
    { name: t("Report.Justification"), property: reactionField, filterBy: reactionField, sortBy: reactionField }
  ];

  if (canRemove) {
    cols.push({
      name: t("Common.Remove"),
      property: (x: Readonly<IncidentResponse>) => <Delete onClick={() => popup(<ConfirmPopup text="Report.ConfirmRemove" onConfirm={() => remove(x.incidentId)} />)} canDelete={!removed.includes(x.incidentId)} />
    });
  }

  return (
    <Container className="mt-3 justify-content-center text-center">
      <h1>{t("Report.Reports")}</h1>
      <Table columns={cols} data={reports} isLoading={isLoading} />
    </Container>
  );
};

export default ReportsList;
