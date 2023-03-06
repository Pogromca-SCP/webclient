import { TableViewParams } from "../../sharedViewsParams";
import { useState } from "react";
import { DiseaseResponse } from "../../../../api/diseaseCalls";
import { useTranslation } from "react-i18next";
import { usePopup } from "../../../../hooks/usePopup";
import { useAbort } from "../../../../hooks/useAbort";
import { deleteDisease } from "../../../../api/diseaseCalls";
import Link from "../../../fragments/navigation/Link";
import Delete from "../../../fragments/forms/Delete";
import ConfirmPopup from "../../../fragments/popups/ConfirmPopup";
import Table from "../../../fragments/util/Table";
import NavButton from "../../../fragments/navigation/NavButton";

// Conditions display table
const MedicalConditionTable = (props: Readonly<TableViewParams<DiseaseResponse>>) => {
  const [removed, setRemoved] = useState<number[]>([]);
  const { t } = useTranslation();
  const popup = usePopup();
  const abort = useAbort();

  const remove = (x: Readonly<DiseaseResponse>) => {
    setRemoved([...removed, x.diseaseId]);

    deleteDisease(x.diseaseId, abort).then(res => {
      if (res.ok) {
        if (props.onRemove) {
          props.onRemove(x);
        }
      } else {
        console.log(res);
      }

      setRemoved(removed.filter(i => i !== x.diseaseId));
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }
      
      console.error(err);
      setRemoved(removed.filter(i => i !== x.diseaseId));
    });
  };

  const idField = "diseaseId";
  const nameField = "diseaseName";
  const descField = "description";

  const cols = [
    { name: "#", property: (x: Readonly<DiseaseResponse>) => <Link to={`disease/${x.diseaseId}`}>{x.diseaseId}</Link>, filterBy: idField, sortBy: idField },
    { name: t("Disease.Name"), property: nameField, filterBy: nameField, sortBy: nameField },
    { name: t("Disease.Description"), property: descField, filterBy: descField, sortBy: descField },
    { name: t("Disease.ShareWithBand"), property: (x: Readonly<DiseaseResponse>) => x.shareWithBand ? t("Common.Yes") : t("Common.No") },
    { name: t("Common.Remove"), property: (x: Readonly<DiseaseResponse>) => <Delete onClick={() => popup(<ConfirmPopup text="Disease.ConfirmRemove" onConfirm={() => remove(x)} />)} canDelete={!removed.includes(x.diseaseId)} /> }
  ];

  return (
    <div>
      <h3>{t("Disease.Diseases")}</h3>
      <Table columns={cols} data={props.data} isLoading={props.isLoading} />
      <NavButton to="disease">{t("Common.Add")}</NavButton>
    </div>
  );
};

export default MedicalConditionTable;
