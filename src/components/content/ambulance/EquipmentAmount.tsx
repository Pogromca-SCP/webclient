import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Form from "../../fragments/forms/Form";
import { Row } from "react-bootstrap";
import Number from "../../fragments/forms/api/Number";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import { ItemUnit } from "../../../api/enumCalls";
import Enum from "../../fragments/values/Enum";
import Submit from "../../fragments/forms/Submit";
import Button from "../../fragments/util/Button";

interface AmountParams {
  amount: number,
  unit: string,
  editing: boolean,
  processing: boolean,
  update: (diff?: number, unit?: string) => void
}

// Special form component used in ambulance equipment tables
const EquipmentAmount = (props: Readonly<AmountParams>) => {
	const [newAmount, setNewAmount] = useState(props.amount);
  const [newUnit, setNewUnit] = useState(props.unit);
  const { t } = useTranslation();

	useEffect(() => {
    if (!props.editing) {
      setNewAmount(props.amount);
      setNewUnit(props.unit);
    }
  }, [props.amount, props.unit, props.editing]);

  const onSubmit = () => {
    if (!props.editing) {
      props.update();
      return;
    }

    const diff = newAmount - props.amount;
    props.update(diff === 0 ? undefined : diff, newUnit === props.unit ? undefined : newUnit);
  };

	return (
		<Form onSubmit={onSubmit}>
			<Row xs="2" className="justify-content-center">
				{props.editing ? <Number required value={newAmount} onChange={e => setNewAmount(parseFloat(e.target.value))} minValue="0" disabled={props.processing} /> : props.amount}
        {props.editing ? <EnumSelect required value={newUnit} onChange={e => setNewUnit(e.target.value)} onLoad={setNewUnit} enum={ItemUnit} disabled={props.processing} /> : (props.unit ? <Enum enum={ItemUnit} value={props.unit} /> : "")}
			</Row>
      <Row xs="2" className="justify-content-center">
        <Submit className="my-3 w-25" canSubmit={!props.processing}>{t(`Common.${props.editing ? "SaveChanges" : "Edit"}`)}</Submit>
        {props.editing && !props.processing ? <Button className="mx-1 my-3 w-25" onClick={e => props.update()}>{t("Common.Cancel")}</Button> : ""}
      </Row>
		</Form>
	);
};

export default EquipmentAmount;
