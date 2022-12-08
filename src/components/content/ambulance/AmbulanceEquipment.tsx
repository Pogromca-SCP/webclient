import { ItemResponse, getItems, EquipmentResponse } from "../../../api/itemCalls";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { licensePlateError } from "../sharedStrings";
import { getItems as getAmbulanceItems } from "../../../api/ambulanceCalls";
import Enum from "../../fragments/values/Enum";
import { ItemType } from "../../../api/enumCalls";
import { Container, Row, Col } from "react-bootstrap";
import NavButton from "../../fragments/navigation/NavButton";
import Table from "../../fragments/util/Table";

interface ItemData extends ItemResponse {
  amount: number,
  unit: string
}

const AmbulanceEquipment = () => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ambulanceId } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    const itemsReq = getItems().then(res => res.json());
    const ambReq = getAmbulanceItems(ambulanceId).then(res => res.json());

    Promise.all([itemsReq, ambReq]).then((data: [ItemResponse[], EquipmentResponse[]]) => {
      if (data) {
        const ambulanceItems = data[1].map(i => i.item.itemId);

        setItems([...data[1].map(i => ({
          ...i.item,
          amount: i.itemData.count,
          unit: i.itemData.unit
        })), ...data[0].filter(i => !ambulanceItems.includes(i.itemId)).map(i => ({
          ...i,
          amount: 0,
          unit: ""
        }))]);
      }

      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [ambulanceId]);

  const nameField = "name";
  const typeField = "itemType";
  const descField = "description";

  const cols = [
    { name: t("Report.Assigned"), property: (x: Readonly<ItemData>) => <></> },
    { name: t("Equipment.Name"), property: nameField, filterBy: nameField, sortBy: nameField },
    { name: t("Equipment.Type"), property: (x: Readonly<ItemData>) => <Enum enum={ItemType} value={x.itemType} />, filterBy: typeField, sortBy: typeField },
    { name: t("Equipment.Description"), property: descField, filterBy: descField, sortBy: descField }
  ];

  return (
    <Container className="my-3 justify-content-center text-center">
      <h3>{t("Equipment.Ambulance")}</h3>
      <Row className="my-3 justify-content-end">
        <Col />
        <Col md="auto">
          <NavButton to="new">+</NavButton>
        </Col>
      </Row>
      <Table columns={cols} data={items} isLoading={isLoading} />
    </Container>
  );
};

export default AmbulanceEquipment;
