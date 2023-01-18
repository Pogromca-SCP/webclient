import { ItemResponse, getItems, EquipmentResponse } from "../../../api/itemCalls";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { licensePlateError } from "../sharedStrings";
import { getItems as getAmbulanceItems, removeItem, addItem, changeItemUnit } from "../../../api/ambulanceCalls";
import EquipmentAmount from "./EquipmentAmount";
import Enum from "../../fragments/values/Enum";
import { ItemType } from "../../../api/enumCalls";
import { Container, Row, Col } from "react-bootstrap";
import NavButton from "../../fragments/navigation/NavButton";
import Table from "../../fragments/util/Table";

interface AmbulanceEquipmentParams {
  add?: boolean
}

interface ItemData extends ItemResponse {
  amount: number,
  unit: string
}

const AmbulanceEquipment = (props: Readonly<AmbulanceEquipmentParams>) => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [update, setUpdate] = useState({
    item: null as number | null,
    processing: false
  });

  const { ambulanceId } = useParams();
  const { t } = useTranslation();
  const abort = useAbort();

  useEffect(() => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    const abortUpdate = new AbortController();
    const itemsReq = getItems(abortUpdate).then(res => res.json());
    const ambReq = getAmbulanceItems(ambulanceId, abortUpdate).then(res => res.json());

    Promise.all([itemsReq, ambReq]).then((data: [ItemResponse[], EquipmentResponse[]]) => {
      if (data) {
        if (props.add) {
          const ambulanceItems = data[1].map(i => i.item.itemId);

          setItems([...data[0].filter(i => !ambulanceItems.includes(i.itemId)).map(i => ({
            ...i,
            amount: 0,
            unit: ""
          }))]);
        } else {
          setItems([...data[1].map(i => ({
            ...i.item,
            amount: i.itemData.count,
            unit: i.itemData.unit
          }))]);
        }
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
  }, [ambulanceId, props.add]);

  const onUpdate = (itemId: number, diff?: number, unit?: string) => {
    if (ambulanceId === undefined) {
      return;
    }

    if (diff === undefined && unit === undefined) {
      setUpdate({
        item: update.item === itemId ? null : itemId,
        processing: false
      });

      return;
    }

    setUpdate({
      item: itemId,
      processing: true
    });

    const requests: Promise<unknown>[] = [];

    if (diff !== undefined) {
      requests.push((diff < 0 ? removeItem(ambulanceId, itemId, abort, -diff) : addItem(ambulanceId, itemId, abort, diff)).then(res => {
        if (res.ok) {
          setItems(items.map(i => i.itemId === itemId ? ({
            ...i,
            amount: i.amount + diff
          }) : i).filter(props.add ? i => i.amount === 0 : i => true));
        } else {
          console.log(res);
        }
      }));
    }

    if (unit !== undefined) {
      requests.push(changeItemUnit(ambulanceId, itemId, unit, abort).then(res => {
        if (res.ok) {
          setItems(items.map(i => i.itemId === itemId ? ({
            ...i,
            unit: unit
          }) : i));
        } else {
          console.log(res);
        }
      }));
    }

    Promise.all(requests).then(res => {
      setUpdate({
        item: null,
        processing: false
      });
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }
      
      console.error(err);
      
      setUpdate({
        item: null,
        processing: false
      });
    });
  };

  const nameField = "name";
  const typeField = "type";
  const descField = "description";

  const cols = [
    { name: t(props.add ? "Equipment.Add" :"Report.Assigned"), property: (x: Readonly<ItemData>) => <EquipmentAmount amount={x.amount} unit={x.unit} editing={update.item === x.itemId} processing={update.processing} update={(diff, unit) => onUpdate(x.itemId, diff, unit)} />, size: 25 },
    { name: t("Equipment.Name"), property: nameField, filterBy: nameField, sortBy: nameField },
    { name: t("Equipment.Type"), property: (x: Readonly<ItemData>) => <Enum enum={ItemType} value={x.type} />, filterBy: typeField, sortBy: typeField },
    { name: t("Equipment.Description"), property: descField, filterBy: descField, sortBy: descField }
  ];

  return (
    <Container className="my-3 justify-content-center text-center">
      <h3>{t(props.add ? "Equipment.Adding" :"Equipment.Ambulance")}</h3>
      <Row className="my-3 justify-content-end">
        <Col />
        <Col md="auto">
          <NavButton to={props.add ? "../equip" : "new"}>{props.add ? t("Common.Back") : "+"}</NavButton>
        </Col>
      </Row>
      <Table columns={cols} data={items} isLoading={isLoading} />
    </Container>
  );
};

export default AmbulanceEquipment;
