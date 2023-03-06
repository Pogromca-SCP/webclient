import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAbort } from "../../../hooks/useAbort";
import { ItemType } from "../../../api/enumCalls";
import { getItemById, ItemResponse, ItemBase, createItem, updateItem } from "../../../api/itemCalls";
import { missingDataError, loadingError, unknownError, networkError } from "../sharedStrings";
import Form from "../../fragments/forms/Form";
import { Row } from "react-bootstrap";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import NotBlank from "../../fragments/forms/api/NotBlank";
import InDate from "../../fragments/forms/api/Date";
import Submit from "../../fragments/forms/Submit";
import NavButton from "../../fragments/navigation/NavButton";
import Error from "../../fragments/forms/Error";

// Equipment item add/edit form component
const EquipmentForm = () => {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [manu, setManu] = useState("");
  const [exp, setExp] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const abort = useAbort();
  const single = type === ItemType.singleUse;
  const multi = type === ItemType.multiUse;
  const medical = type === ItemType.medical;

  useEffect(() => {
    if (itemId === undefined) {
      return;
    }

    const abortUpdate = new AbortController();
    setError("");

    getItemById(parseInt(itemId), abortUpdate).then(res => res.json()).then((data: ItemResponse) => {
      if (data.type && data.name) {
        setType(data.type);
        setName(data.name ?? "");
        setDesc(data.description ?? "");
        setManu(data.manufacturer ?? "");
        setExp(data.expirationDate?.toString() ?? "");
      } else {
        setError(missingDataError);
      }
    }).catch(err => {
      console.error(err);
      setError(loadingError);
    });

    return () => abortUpdate.abort();
  }, [itemId]);

  // Certain fields can only be assigned to certain item types
  const onSubmit = () => {
    setError(undefined);

    const item: ItemBase = {
      name: name
    };

    if (!multi) {
      item.description = desc;

      if (!single) {
        item.manufacturer = manu;
      }
    }

    (itemId === undefined ? createItem({
      ...item,
      expiration_date: medical ? new Date(exp) : undefined,
      type: type
    }, abort) : updateItem(parseInt(itemId), {
      ...item,
      expirationDate: medical ? new Date(exp) : undefined
    }, abort)).then(res => {
      if (res.ok) {
        navigate("/equipments");
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

  return (
    <Form onSubmit={onSubmit} className="my-3">
      <h3 className="text-center">{t("Equipment.Adding")}</h3>
      <Row className="justify-content-center">
        <EnumSelect id="type" label={t("Equipment.Type")} className="my-3 w-50" enum={ItemType} required value={type} onChange={e => setType(e.target.value)} onLoad={setType} disabled={itemId !== undefined} />
      </Row>
      <Row className="justify-content-center">
        <NotBlank id="name" label={t("Equipment.Name")} className="mb-3 w-50" required value={name} onChange={e => setName(e.target.value)} />
      </Row>
      {multi ? "" : (
        <Row className="justify-content-center">
          <NotBlank id="description" label={t("Equipment.Description")} className="mb-3 w-50" required value={desc} onChange={e => setDesc(e.target.value)} />
        </Row>
      )}
      {single || multi ? "" : (
        <Row className="justify-content-center">
          <NotBlank id="manufacturer" label={t("Equipment.Manufacturer")} className="mb-3 w-50" required value={manu} onChange={e => setManu(e.target.value)} />
        </Row>
      )}
      {medical ? (
        <Row className="justify-content-center">
          <InDate id="expirationDate" label={t("Equipment.Expiration")} className="mb-3 w-50" required value={exp} onChange={e => setExp(e.target.value)} />
        </Row>
      ) : ""}
      <Row className="justify-content-center">
        <Submit className="mb-3 w-25" canSubmit={error !== undefined}>{t(itemId === undefined ? "Equipment.Add" : "Common.SaveChanges")}</Submit>
      </Row>
      <Row className="justify-content-center">
        <NavButton className="mb-3 w-25" to="/equipments">{t("Common.Cancel")}</NavButton>
      </Row>
      <Row className="mx-3 justify-content-center">
        <Error className="w-50" error={error} />
      </Row>
    </Form>
  );
};

export default EquipmentForm;
