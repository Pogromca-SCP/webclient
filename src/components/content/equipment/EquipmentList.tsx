import { useState, useEffect } from "react";
import { ItemResponse, getItems } from "../../../api/itemCalls";
import { useTranslation } from "react-i18next";
import { usePopup } from "../../../hooks/usePopup";
import { useAbort } from "../../../hooks/useAbort";
import { deleteItem } from "../../../api/itemCalls";
import Link from "../../fragments/navigation/Link";
import Enum from "../../fragments/values/Enum";
import { ItemType } from "../../../api/enumCalls";
import Delete from "../../fragments/forms/Delete";
import ConfirmPopup from "../../fragments/popups/ConfirmPopup";
import { Container, Row, Col } from "react-bootstrap";
import NavButton from "../../fragments/navigation/NavButton";
import Table from "../../fragments/util/Table";

// Displays all equipment items
const EquipmentList = () => {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [removed, setRemoved] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const popup = usePopup();
  const abort = useAbort();

  useEffect(() => {
    const abortUpdate = new AbortController();

    getItems(abortUpdate).then(res => res.json()).then((data: ItemResponse[]) => {
      if (data) {
        setItems(data);
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

  const remove = (x: number) => {
    setRemoved([...removed, x]);
    
    deleteItem(x, abort).then(res => {
      if (res.ok) {
        setItems(items.filter(i => i.itemId !== x));
      } else {
        console.log(res);
      }

      setRemoved(removed.filter(i => i !== x));
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }

      console.error(err);
      setRemoved(removed.filter(i => i !== x));
    });
  };

  const idField = "itemId";
  const nameField = "name";
  const typeField = "type";
  const descField = "description";

  const cols = [
    { name: "#", property: (x: Readonly<ItemResponse>) => <Link to={x.itemId.toString()}>{x.itemId}</Link>, filterBy: idField, sortBy: idField },
    { name: t("Equipment.Name"), property: nameField, filterBy: nameField, sortBy: nameField },
    { name: t("Equipment.Type"), property: (x: Readonly<ItemResponse>) => <Enum enum={ItemType} value={x.type} />, filterBy: typeField, sortBy: typeField, filterEnum: ItemType },
    { name: t("Equipment.Description"), property: descField, filterBy: descField, sortBy: descField },
    { name: t("Common.Remove"), property: (x: Readonly<ItemResponse>) => <Delete onClick={() => popup(<ConfirmPopup text="Equipment.ConfirmRemove" onConfirm={() => remove(x.itemId)} />)} canDelete={!removed.includes(x.itemId)} /> }
  ];

  return (
    <Container className="my-3 justify-content-center text-center">
      <h3>{t("Equipment.Equipment")}</h3>
      <Row className="my-3 justify-content-end">
        <Col />
        <Col md="auto">
          <NavButton to="/newequipment">+</NavButton>
        </Col>
      </Row>
      <Table columns={cols} data={items} isLoading={isLoading} />
    </Container>
  );
};

export default EquipmentList;
