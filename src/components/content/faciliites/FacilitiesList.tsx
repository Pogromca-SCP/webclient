import { useState, useEffect } from "react";
import { usePopup } from "../../../hooks/usePopup";
import { useTranslation } from "react-i18next";
import { useRoles } from "../../../hooks/useAuth";
import { useAbort } from "../../../hooks/useAbort";
import { hasPerm, facilityManagement } from "../../../helpers/authHelper";
import { FacilityResponse, getFacilities, deleteFacility } from "../../../api/facilityCalls";
import Table, {TableColumnParams} from "../../fragments/util/Table";
import Link from "../../fragments/navigation/Link";
import Enum from "../../fragments/values/Enum";
import { FacilityType } from "../../../api/enumCalls";
import Delete from "../../fragments/forms/Delete";
import ConfirmPopup from "../../fragments/popups/ConfirmPopup";
import { Container, Row, Col } from "react-bootstrap";
import NavButton from "../../fragments/navigation/NavButton";

// Displays a list of all facilities
const FacilitiesList = () => {
  const [facilities, setFacilities] = useState<FacilityResponse[]>([]);
  const [removed, setRemoved] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const popup = usePopup();
  const { t } = useTranslation();
  const roles = useRoles();
  const abort = useAbort();
  const canRemove = hasPerm(roles, facilityManagement);

  useEffect(() => {
    const abortUpdate = new AbortController();

    getFacilities(abortUpdate).then(res => res.json()).then((data: FacilityResponse[]) => {
      if (data) {
        setFacilities(data);
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
    if (!canRemove) {
      return;
    }

    setRemoved([...removed, id]);
    
    deleteFacility(id, abort).then(res => {
      if (res.ok) {
        setFacilities(facilities.filter(f => f.facilityId !== id));
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

  const idField = "facilityId";
  const typeField = "facilityType";
  const nameField = "name";

  const cols: TableColumnParams<FacilityResponse>[] = [
    { name: "#", property: (x: Readonly<FacilityResponse>) => <Link to={x.facilityId.toString()}>{x.facilityId}</Link>, sortBy: idField, filterBy: idField },
    { name: t("Facility.Type"), property: (x: Readonly<FacilityResponse>) => <Enum enum={FacilityType} value={x.facilityType} />, sortBy: typeField, filterBy: typeField, filterEnum: FacilityType },
    { name: t("Facility.Name"), property: nameField, sortBy: nameField, filterBy: nameField }
  ];

  if (canRemove) {
    cols.push({
      name: t("Common.Remove"),
      property: (x: Readonly<FacilityResponse>) => <Delete onClick={() => popup(<ConfirmPopup text={t("Facility.ConfirmRemove")} onConfirm={() => remove(x.facilityId)} />)} canDelete={!removed.includes(x.facilityId)} />
    });
  }

  return (
    <Container className="mt-3 justify-content-center text-center">
      <h3>{t("Facility.Facilities")}</h3>
      {canRemove ? (
        <Row className="my-2 justify-content-end">
          <Col />
          <Col md="auto">
            <NavButton to="/newfacility">+</NavButton>
          </Col>
        </Row>
      ) : ""}
      <Table columns={cols} data={facilities} isLoading={isLoading} />
    </Container>
  );
};

export default FacilitiesList;
