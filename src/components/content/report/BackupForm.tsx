import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAbort } from "../../../hooks/useAbort";
import { useTranslation } from "react-i18next";
import { useRoles } from "../../../hooks/useAuth";
import { hasPerm, incidentManagement } from "../../../helpers/authHelper";
import { getBackupById, BackupResponse, addBackup, updateBackup } from "../../../api/backupCalls";
import { missingDataError, loadingError, unknownError, networkError } from "../sharedStrings";
import { getEmail } from "../../../helpers/authHelper";
import { Container, Row } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import { BackupType } from "../../../api/enumCalls";
import NotBlank from "../../fragments/forms/api/NotBlank";
import FormCheck from "../../fragments/forms/FormCheck";
import Submit from "../../fragments/forms/Submit";
import Error from "../../fragments/forms/Error";

// Backup add/edit form component
const BackupForm = () => {
  const [backupType, setBackupType] = useState("");
  const [justification, setJustification] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [incidentId, setIncidentId] = useState<number | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const { reportId, backupId } = useParams();
  const navigate = useNavigate();
  const abort = useAbort();
  const { t } = useTranslation();
  const roles = useRoles();
  const canAccept = hasPerm(roles, incidentManagement);

  useEffect(() => {
    if (reportId === undefined || backupId === undefined) {
      return;
    }

    setError(undefined);
    setIncidentId(null);
    const abortUpdate = new AbortController();
    const id = parseInt(reportId);

    getBackupById(parseInt(backupId), abortUpdate).then(res => res.json()).then((data: BackupResponse) => {
      if (data.backupType && data.justification && data.incidentId === id) {
        setBackupType(data.backupType);
        setJustification(data.justification);
        setAccepted(data.accepted);
        setIncidentId(data.incidentId);
        setError("");
      } else {
        console.log(data);
        setError(missingDataError);
      }
    }).catch(err => {
      if (abortUpdate.signal.aborted) {
        return;
      }

      console.error(err);
      setError(loadingError);
    });

    return () => abortUpdate.abort();
  }, [reportId, backupId]);

  const onSubmit = () => {
    const user = getEmail();

    if (reportId === undefined || user === undefined || (backupId !== undefined && incidentId === null)) {
      return;
    }

    setError(undefined);
    
    const backup = {
      backupType: backupType,
      justification: justification,
      accepted: accepted
    };

    (backupId === undefined ? addBackup({
      ...backup,
      requester: user,
      incidentId: parseInt(reportId)
    }, abort) : updateBackup(parseInt(backupId), backup, abort)).then(res => {
      if (res.ok) {
        navigate("../back");
      } else {
        console.log(res);
        setError(unknownError);
      }
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }

      console.log(err);
      setError(networkError);
    });
  };

  return (
    <Container className="my-3 justify-content-center w-50">
      <Form onSubmit={onSubmit}>
        <h1 className="text-center my-3">{t(`Backup.${backupId === undefined ? "Adding" : "Editing"}`)}</h1>
        <Row className="justify-content-center mb-3">
          <EnumSelect id="backupType" label={t("Backup.Type")} required enum={BackupType} value={backupType} onChange={e => setBackupType(e.target.value)} onLoad={setBackupType} />
        </Row>
        <Row className="justify-content-center mb-3">
          <NotBlank id="justification" label={t("Backup.Justification")} required value={justification} onChange={e => setJustification(e.target.value)} />
        </Row>
        <Row className="justify-content-center mb-3 ml-2">
          <FormCheck id="accepted" label={t("Backup.Accepted")} value={accepted} onChange={e => setAccepted(!accepted)} disabled={!canAccept} />
        </Row>
        <Row className="justify-content-center mb-5 mt-3">
          <Submit className="w-50" canSubmit={error !== undefined}>{backupId === undefined ? t("Backup.Create") : t("Common.SaveChanges")}</Submit>
        </Row>
        <Error className="mt-3" error={error} />
      </Form>
    </Container>
  );
};

export default BackupForm;
