import { useState, useEffect } from "react";
import { BackupResponse, getBackups, deleteBackup } from "../../../api/backupCalls";
import { useTranslation } from "react-i18next";
import { usePopup } from "../../../hooks/usePopup";
import { useAbort } from "../../../hooks/useAbort";
import Link from "../../fragments/navigation/Link";
import Enum from "../../fragments/values/Enum";
import { BackupType } from "../../../api/enumCalls";
import DateDisplay from "../../fragments/values/DateDisplay";
import FormCheck from "../../fragments/forms/FormCheck";
import Delete from "../../fragments/forms/Delete";
import ConfirmPopup from "../../fragments/popups/ConfirmPopup";
import { Container, Row, Col } from "react-bootstrap";
import NavButton from "../../fragments/navigation/NavButton";
import Table from "../../fragments/util/Table";

const BackupsList = () => {
  const [backups, setBackups] = useState<BackupResponse[]>([]);
  const [removed, setRemoved] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const popup = usePopup();
  const abort = useAbort();

  useEffect(() => {
    const abortUpdate = new AbortController();

    getBackups(abortUpdate).then(res => res.json()).then((data: BackupResponse[]) => {
      if (data) {
        setBackups(data.map(b => ({
          ...b,
          time: new Date(b.time)
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

  const remove = (id: number) => {
    setRemoved([...removed, id]);
    
    deleteBackup(id, abort).then(res => {
      if (res.ok) {
        setBackups(backups.filter(b => b.backupId !== id));
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

  const idField = "backupId";
  const typeField = "backupType";
  const timeField = "time";

  const cols = [
    { name: "#", property: (x: Readonly<BackupResponse>) => <Link to={`edit/${x.backupId}`}>{x.backupId}</Link>, filterBy: idField, sortBy: idField },
    { name: t("Backup.Type"), property: (x: Readonly<BackupResponse>) => <Enum enum={BackupType} value={x.backupType} />, filterBy: typeField, sortBy: typeField },
    { name: t("Backup.Time"), property: (x: Readonly<BackupResponse>) => <DateDisplay value={x.time} />, filterBy: timeField, sortBy: timeField },
    { name: t("Backup.Accepted"), property: (x: Readonly<BackupResponse>) => <FormCheck value={x.accepted} disabled /> },
    { name: t("Common.Remove"), property: (x: Readonly<BackupResponse>) => <Delete onClick={() => popup(<ConfirmPopup text="Backup.ConfirmRemove" onConfirm={() => remove(x.backupId)} />)} canDelete={!removed.includes(x.backupId)} /> }
  ];

  return (
    <Container className="mt-3 justify-content-center text-center">
      <h1>{t("Backup.Backup")}</h1>
      <Row className="my-2 justify-content-end">
        <Col />
        <Col md="auto">
          <NavButton to="new">+</NavButton>
        </Col>
      </Row>
      <Table columns={cols} data={backups} isLoading={isLoading} />
    </Container>
  );
};

export default BackupsList;
