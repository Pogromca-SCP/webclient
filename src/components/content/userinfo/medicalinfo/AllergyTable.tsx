import { TableViewParams } from "../../sharedViewsParams";
import { useState } from "react";
import { AllergyResponse } from "../../../../api/allergyCalls";
import { useTranslation } from "react-i18next";
import { usePopup } from "../../../../hooks/usePopup";
import { useAbort } from "../../../../hooks/useAbort";
import { deleteAllergy } from "../../../../api/allergyCalls";
import Link from "../../../fragments/navigation/Link";
import Enum from "../../../fragments/values/Enum";
import { AllergyType } from "../../../../api/enumCalls";
import Delete from "../../../fragments/forms/Delete";
import ConfirmPopup from "../../../fragments/popups/ConfirmPopup";
import Table from "../../../fragments/util/Table";
import NavButton from '../../../fragments/navigation/NavButton';

// Allergies display table
const AllergyTable = (props: Readonly<TableViewParams<AllergyResponse>>) => {
  const [removed, setRemoved] = useState<number[]>([]);
  const { t } = useTranslation();
  const popup = usePopup();
  const abort = useAbort();

  const remove = (x: Readonly<AllergyResponse>) => {
    setRemoved([...removed, x.allergyId]);

    deleteAllergy(x.allergyId, abort).then(res => {
      if (res.ok) {
        if (props.onRemove) {
          props.onRemove(x);
        }
      } else {
        console.log(res);
      }

      setRemoved(removed.filter(i => i !== x.allergyId));
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }
      
      console.error(err);
      setRemoved(removed.filter(i => i !== x.allergyId));
    });
  };

  const idField = "allergyId";
  const typeField = "allergyType";
  const nameField = "allergyName";
  const otherField = "other";

  const cols = [
    { name: "#", property: (x: Readonly<AllergyResponse>) => <Link to={`allergy/${x.allergyId}`}>{x.allergyId}</Link>, filterBy: idField, sortBy: idField },
    { name: t("Allergy.Type"), property: (x: Readonly<AllergyResponse>) => <Enum enum={AllergyType} value={x.allergyType} />, filterBy: typeField, sortBy: typeField, filterEnum: AllergyType },
    { name: t("Allergy.Name"), property: nameField, filterBy: nameField, sortBy: nameField },
    { name: t("Allergy.Other"), property: otherField, filterBy: otherField, sortBy: otherField },
    { name: t("Common.Remove"), property: (x: Readonly<AllergyResponse>) => <Delete onClick={() => popup(<ConfirmPopup text="Allergy.ConfirmRemove" onConfirm={() => remove(x)} />)} canDelete={!removed.includes(x.allergyId)} /> }
  ];

  return (
    <div className="mb-3">
      <h3>{t("Allergy.Allergies")}</h3>
      <Table columns={cols} data={props.data} isLoading={props.isLoading} />
      <NavButton to="allergy">{t("Common.Add")}</NavButton>
    </div>
  )
}

export default AllergyTable;
