import { useState, useEffect } from "react";
import { AmbulanceResponse, getAmbulances } from "../../../api/ambulanceCalls";
import { AccidentReportResponse, getAccidents } from "../../../api/accidentReportCalls";
import { useTranslation } from "react-i18next";
import Link from "../../fragments/navigation/Link";
import Enum from "../../fragments/values/Enum";
import { AmbulanceClass, AmbulanceType, AmbulanceState, EnumType, EmergencyType } from "../../../api/enumCalls";
import { Container, Row } from "react-bootstrap";
import PieChart from "../../fragments/charts/PieChart";
import Table from "../../fragments/util/Table";

// Home page for ambulance directors
const AdminHome = () => {
  const [ambulances, setAmbulances] = useState<AmbulanceResponse[]>([]);
  const [accidents, setAccidents] = useState<AccidentReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const abort = new AbortController();
    const ambReq = getAmbulances(abort).then(res => res.json());
    const accReq = getAccidents(abort).then(res => res.json());

    Promise.all([ambReq, accReq]).then((data: [AmbulanceResponse[], AccidentReportResponse[]]) => {
      if (data) {
        setAmbulances(data[0]);
        
        setAccidents(data[1].map(a => ({
          ...a,
          date: new Date(`${a.date}Z`)
        })));
      }

      setIsLoading(false);
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }

      console.error(err);
      setIsLoading(false);
    });

    return () => abort.abort();
  }, []);

  const licenseField = "licensePlate";
  const classField = "ambulanceClass";
  const typeField = "ambulanceType";
  const stateField = "ambulanceStateType";

  const cols = [
    { name: t("Ambulance.LicensePlate"), property: (x: Readonly<AmbulanceResponse>) => <Link to={`/ambulances/${x.licensePlate}`}>{x.licensePlate}</Link>, sortBy: licenseField, filterBy: licenseField },
    { name: t("Ambulance.Class"), property: (x: Readonly<AmbulanceResponse>) => <Enum enum={AmbulanceClass} value={x.ambulanceClass} />, sortBy: classField, filterBy: classField, filterEnum: AmbulanceClass },
    { name: t("Ambulance.Type"), property: (x: Readonly<AmbulanceResponse>) => <Enum enum={AmbulanceType} value={x.ambulanceType} />, sortBy: typeField, filterBy: typeField, filterEnum: AmbulanceType },
    { name: t("Ambulance.Status"), property: (x: Readonly<AmbulanceResponse>) => <Enum enum={AmbulanceState} value={x.ambulanceStateType} />, filterBy: stateField, sortBy: stateField, filterEnum: AmbulanceState }
  ];

  const processPieData = (enumType: EnumType, provider: (x: string) => number) => {
    const result = [];
    const defColor = "#777777";

    const defObj = {
      name: "",
      value: 1,
      fill: defColor,
      fillDark: defColor
    };

    for (const val in enumType.values) {
      const tmp = {
        name: t(`${enumType.name}.${val}`),
        value: provider(val),
        fill: enumType.values[val].light ?? defColor,
        fillDark: enumType.values[val].dark ?? defColor
      };

      if (tmp.value > 0) {
        result.push(tmp);
      }
    }

    if (result.length < 1) {
      result.push(defObj);
    }

    return result;
  };

  const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
  const pieDat = processPieData(AmbulanceState, x => ambulances.filter(a => a.ambulanceStateType === x).length);
  const pieDat2 = processPieData(EmergencyType, x => accidents.filter(a => a.date > yesterday && a.emergencyType === x).length);

  return (
    <Container className="mt-5 justify-content-center text-center">
      <h1 className="mb-3">{t("HomePage.Admin")}</h1>
      <Row xs={2} className="justify-content-around">
        <PieChart width={400} height={400} data={pieDat} label legend tooltip innerRadius="100" />
        <PieChart width={400} height={400} data={pieDat2} label legend tooltip innerRadius="100" />
      </Row>
      <Row xs={2} className="text-center">
        <h3>{t("HomePage.AmbulancesState")}</h3>
        <h3>{t("HomePage.Report24h")}</h3>
      </Row>
      <h2 className="my-3">{t("Ambulance.Ambulances")}</h2>
      <Table columns={cols} data={ambulances} isLoading={isLoading} />
    </Container>
  );
};

export default AdminHome;
