import { useState, useEffect } from "react";
import { AccidentReportResponse, getAccidents } from "../../../api/accidentReportCalls";
import { useTranslation } from "react-i18next";
import { getAmbulances, AmbulanceResponse } from "../../../api/ambulanceCalls";
import { AmbulanceState, EmergencyType } from "../../../api/enumCalls";
import Enum from "../../fragments/values/Enum";
import DateDisplay from "../../fragments/values/DateDisplay";
import { Container, Row } from "react-bootstrap";
import ProgressChart from "../../fragments/charts/ProgressChart";
import PieChart from "../../fragments/charts/PieChart";
import NavButton from "../../fragments/navigation/NavButton";
import Table from "../../fragments/util/Table";

const DispositorHome = () => {
  const [accidents, setAccidents] = useState<AccidentReportResponse[]>([]);

  const [ambulances, setAmbulances] = useState({
    available: 0,
    all: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const accReq = getAccidents().then(res => res.json());
    const ambReq = getAmbulances().then(res => res.json());

    Promise.all([accReq, ambReq]).then((data: [AccidentReportResponse[], AmbulanceResponse[]]) => {
      if (data) {
        setAccidents(data[0].map(d => ({
          ...d,
          date: new Date(d.date)
        })));

        setAmbulances({
          available: data[1].filter(d => d.ambulanceStateType === AmbulanceState.available).length,
          all: data[1].length
        });
      }

      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const cols = [
    { name: "Rodzaj zdarzenia", property: (x: Readonly<AccidentReportResponse>) => <Enum enum={EmergencyType} value={x.emergencyType} />, filterBy: "emergencyType", sortBy: "emergencyType" },
    { name: t("Reports.Date"), property: (x: Readonly<AccidentReportResponse>) => <DateDisplay value={x.date} />, sortBy: "date", filterBy: "date" },
    { name: "Liczba ofiar", property: "victimCount", filterBy: "victimCount", sortBy: "victimCount" }
  ];

  const chartData = [];

  for (const eType in EmergencyType.colors) {
    const tmp = {
      name: t(`${EmergencyType.name}.${eType}`),
      value: accidents.filter(a => a.emergencyType === eType).length,
      fill: EmergencyType.colors[eType].light,
      fillDark: EmergencyType.colors[eType].dark
    };

    if (tmp.value > 0) {
      chartData.push(tmp);
    }
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-3 text-center">{t("MainPage.Dispositor")}</h1>
      <Row xs={4} className="justify-content-around">
        <ProgressChart width={350} height={350} value={ambulances.all !== 0 ? (ambulances.available / ambulances.all) * 100 : 0} innerRadius="100" color={{
          r: 255,
          g: 162,
          b: 0
        }} />
        <PieChart width={350} height={350} data={chartData} innerRadius="90" legend tooltip />
        <ProgressChart width={350} height={350} value={79} innerRadius="100" label color={{
          r: 0,
          g: 146,
          b: 255
        }} />
      </Row>
      <Row xs={3} className="text-center">
        <h3>{t("Ambulance.Available")}</h3>
        <h3>{t("MainPage.Incidents")}</h3>
        <h3>{t("Reports.Accepted")}</h3>
      </Row>
      <Row className="mt-5 justify-content-center">
        <NavButton to="/map" className="w-25">{t("MainPage.OpenMap")}</NavButton>
      </Row>
      <Row className="my-5">
        <Table columns={cols} data={accidents} isLoading={isLoading} />
      </Row>
    </Container>
  );
};

export default DispositorHome;
