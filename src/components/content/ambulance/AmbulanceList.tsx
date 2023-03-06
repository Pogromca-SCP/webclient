import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePopup } from "../../../hooks/usePopup";
import { useAbort } from "../../../hooks/useAbort";
import { AmbulanceResponse, getAmbulances, deleteAmbulance } from "../../../api/ambulanceCalls";
import Link from "../../fragments/navigation/Link";
import Enum from "../../fragments/values/Enum";
import { AmbulanceClass, AmbulanceType, AmbulanceState } from "../../../api/enumCalls";
import NavButton from "../../fragments/navigation/NavButton";
import Delete from "../../fragments/forms/Delete";
import ConfirmPopup from "../../fragments/popups/ConfirmPopup";
import { Container, Row, Col } from "react-bootstrap";
import Table from "../../fragments/util/Table";

// Displays all ambulances
const AmbulanceList = () => {
  const [ambulances, setAmbulances] = useState<AmbulanceResponse[]>([]); 
  const [removed, setRemoved] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const popup = usePopup();
  const abort = useAbort();

  // Loads ambulances to display
  useEffect(() => {
    const abortUpdate = new AbortController();

    getAmbulances(abortUpdate).then(res => res.json()).then((data: AmbulanceResponse[]) => {
      if (data) {
        setAmbulances(data);
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

  const remove = (plate: string) => {
    setRemoved([...removed, plate]);
    
    deleteAmbulance(plate, abort).then(res => {
      if (res.ok) {
        setAmbulances(ambulances.filter(a => a.licensePlate !== plate));
      } else {
        console.log(res);
      }

      setRemoved(removed.filter(p => p !== plate));
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }

      console.error(err);
      setRemoved(removed.filter(p => p !== plate));
    });
  };

  const licenseField = "licensePlate";
  const classField = "ambulanceClass";
  const typeField = "ambulanceType";
  const stateField = "ambulanceStateType";

  const cols = [
    { name: t("Ambulance.LicensePlate"), property: (x: Readonly<AmbulanceResponse>) => <Link to={x.licensePlate}>{x.licensePlate}</Link>, sortBy: licenseField, filterBy: licenseField },
    { name: t("Ambulance.Class"), property: (x: Readonly<AmbulanceResponse>) => <Enum enum={AmbulanceClass} value={x.ambulanceClass} />, sortBy: classField, filterBy: classField, filterEnum: AmbulanceClass },
    { name: t("Ambulance.Type"), property: (x: Readonly<AmbulanceResponse>) => <Enum enum={AmbulanceType} value={x.ambulanceType} />, sortBy: typeField, filterBy: typeField, filterEnum: AmbulanceType },
    { name: t("Ambulance.Status"), property: (x: Readonly<AmbulanceResponse>) => <Enum enum={AmbulanceState} value={x.ambulanceStateType} />, sortBy: stateField, filterBy: stateField, filterEnum: AmbulanceState },
    { name: t("Common.Remove"), property: (x: Readonly<AmbulanceResponse>) => <Delete onClick={() => popup(<ConfirmPopup text="Ambulance.ConfirmRemove" onConfirm={() => remove(x.licensePlate)} />)} canDelete={!removed.includes(x.licensePlate)} /> }
  ];

  return (
    <Container className="mt-3 justify-content-center text-center">
      <h3>{t("Ambulance.Ambulances")}</h3>
      <Row className="my-2 justify-content-end">
        <Col />
        <Col md="auto">
          <NavButton to="/newambulance">+</NavButton>
        </Col>
      </Row>
      <Table columns={cols} data={ambulances} isLoading={isLoading} />
    </Container>
  );
};

export default AmbulanceList;
