import { useState, useEffect } from "react";
import { AccidentReportResponse } from "../../../api/accidentReportCalls";
import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { useRoles } from "../../../hooks/useAuth";
import { hasPerm, incidentManagement } from "../../../helpers/authHelper";
import { getIncidentById, IncidentResponse, updateIncident } from "../../../api/incidentCalls";
import { missingDataError, loadingError, unknownError, networkError } from "../sharedStrings";
import { Container, Row } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import { IncidentType } from "../../../api/enumCalls";
import Number from "../../fragments/forms/api/Number";
import NotBlank from "../../fragments/forms/api/NotBlank";
import Submit from "../../fragments/forms/Submit";
import Button from "../../fragments/util/Button";
import Error from "../../fragments/forms/Error";
import Navtab from "../../fragments/navigation/Navtab";
import { Routes, Route } from "react-router-dom";
import ReportData from "./ReportData";
import ConditionalRoute from "../../fragments/navigation/ConditionalRoute";
import AssignAmbulance from "./AssignAmbulance";
import BackupsList from "./BackupsList";
import BackupForm from "./BackupForm";
import VictimsList from "./VictimsList";
import VictimForm from "./VictimForm";

// Root view with all report details
const ReportView = () => {
  const [statusType, setStatusType] = useState("");
  const [dangerScale, setDangerScale] = useState(1);
  const [reaction, setReaction] = useState("");
  const [accidentData, setAccidentData] = useState<AccidentReportResponse | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [readOnly, setReadOnly] = useState(true);
  const { reportId } = useParams();
  const { t } = useTranslation();
  const abort = useAbort();
  const roles = useRoles();
  const canEdit = hasPerm(roles, incidentManagement);

  useEffect(() => {
    if (reportId !== undefined && readOnly) {
      setError(undefined);
      const abortUpdate = new AbortController();

      getIncidentById(parseInt(reportId), abortUpdate).then(res => res.json()).then((data: IncidentResponse) => {
        if (data.incidentStatusType && data.dangerScale && data.accidentReport) {
          setStatusType(data.incidentStatusType);
          setDangerScale(data.dangerScale);
          setReaction(data.reactionJustification);
          setAccidentData(data.accidentReport);
          setError("");
        } else {
          setError(missingDataError);
        }
      }).catch(err => {
        if (abortUpdate.signal.aborted) {
          return;
        }

        console.error(err);
        setError(loadingError);
      })

      return () => abortUpdate.abort();
    }
  }, [reportId, readOnly]);

  const onSubmit = () => {
    if (reportId === undefined || !canEdit) {
      return;
    }

    if (readOnly) {
      setReadOnly(false);
      setError("");
      return;
    }

    setError(undefined);

    updateIncident(parseInt(reportId), {
      incidentStatusType: statusType,
      dangerScale: dangerScale,
      reactionJustification: reaction
    }, abort).then(res => {
      if (res.ok) {
        setReadOnly(true);
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

  const links = [
    { to: "data", text: t("Common.Details") },
    { to: "back", text: t("Backup.Backup") },
    { to: "vict", text: t("Report.Victims") }
  ];

  if (canEdit) {
    links.push({ to: "ass", text: t("Report.Assign") });
  }

  return (
    <Container fluid className="my-3">
      <h1 className="text-center">{t("Report.Report")}</h1>
      <Row className="justify-content-center">
        <Form onSubmit={onSubmit} className="w-50">
          <EnumSelect id="statusType" className="mb-3" label={t("Report.StatusType")} required enum={IncidentType} value={statusType} onChange={e => setStatusType(e.target.value)} onLoad={setStatusType} disabled={readOnly} />
          <Number id="dangerScale" className="mb-3" label={t("Report.DangerScale")} required value={dangerScale} onChange={e => setDangerScale(parseInt(e.target.value))} minValue="1" maxValue="10" disabled={readOnly} />
          <NotBlank id="reaction" className="mb-3" label={t("Report.Justification")} required value={reaction} onChange={e => setReaction(e.target.value)} disabled={readOnly} />
          {canEdit ? (
            <Row xs="2" className="justify-content-center my-3">
              <Submit className="w-25" canSubmit={error !== undefined}>{readOnly ? t("Common.Edit") : t("Common.Save")}</Submit>
              {readOnly ? "" : <Button type="button" onClick={e => setReadOnly(true)} className="mx-3 w-25">{t("Common.Cancel")}</Button>}
            </Row>
          ) : ""}
          <Error className="mb-3" error={error} />
        </Form>
      </Row>
      <Navtab links={links} />
      <Routes>
        <Route path="" element={<Navigate replace to="data" />} />
        <Route path="data" element={<ReportData data={accidentData} />} />
        <Route path="ass" element={<ConditionalRoute condition={canEdit} element={<AssignAmbulance />} />} />
        <Route path="back" element={<BackupsList />} />
        <Route path="back/new" element={<BackupForm />} />
        <Route path="back/edit/:backupId" element={<BackupForm />} />
        <Route path="vict" element={<VictimsList />} />
        <Route path="vict/new" element={<VictimForm />} />
        <Route path="vict/edit/:victimId" element={<VictimForm />} />
      </Routes>
    </Container>
  );
};

export default ReportView;
