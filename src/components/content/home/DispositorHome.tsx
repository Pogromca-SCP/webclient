import { useState, useEffect } from "react";
import { IncidentResponse, getIncidents } from "../../../api/incidentCalls";
import { useTranslation } from "react-i18next";
import { getAmbulances, AmbulanceResponse } from "../../../api/ambulanceCalls";
import { AmbulanceState, EmergencyType, IncidentType } from "../../../api/enumCalls";
import Link from "../../fragments/navigation/Link";
import Enum from "../../fragments/values/Enum";
import { Container, Row } from "react-bootstrap";
import ProgressChart from "../../fragments/charts/ProgressChart";
import PieChart from "../../fragments/charts/PieChart";
import NavButton from "../../fragments/navigation/NavButton";
import Table from "../../fragments/util/Table";

// Home page for ambulance dispatchers
const DispositorHome = () => {
  const [accidents, setAccidents] = useState<IncidentResponse[]>([]);

  const [ambulances, setAmbulances] = useState({
    available: 0,
    all: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const abort = new AbortController();
    const accReq = getIncidents(abort).then(res => res.json());
    const ambReq = getAmbulances(abort).then(res => res.json());

    Promise.all([accReq, ambReq]).then((data: [IncidentResponse[], AmbulanceResponse[]]) => {
      if (data) {
        setAccidents(data[0].map(d => ({
          ...d,
          accidentReport: {
            ...d.accidentReport,
            date: new Date(d.accidentReport.date)
          }
        })));

        setAmbulances({
          available: data[1].filter(d => d.ambulanceStateType === AmbulanceState.available).length,
          all: data[1].length
        });
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

  const idField = "incidentId";
  const dangerField = "dangerScale";
  const reactionField = "reactionJustification";
  const statusField = "incidentStatusType";

  const cols = [
    { name: "#", property: (x: Readonly<IncidentResponse>) => <Link to={`/reports/${x.incidentId}`}>{x.incidentId}</Link>, sortBy: idField, filterBy: idField },
    { name: t("Report.DangerScale"), property: dangerField, filterBy: dangerField, sortBy: dangerField },
    { name: t("Report.Justification"), property: reactionField, sortBy: reactionField, filterBy: reactionField },
    { name: t("Report.StatusType"), property: (x: Readonly<IncidentResponse>) => <Enum enum={IncidentType} value={x.incidentStatusType} />, filterBy: statusField, sortBy: statusField, filterEnum: IncidentType }
  ];

  const chartData = [];
  const defColor = "#777777";
  const accepted = accidents.filter(a => a.incidentStatusType === IncidentType.accepted);

  for (const eType in EmergencyType.values) {
    const tmp = {
      name: t(`${EmergencyType.name}.${eType}`),
      value: accidents.filter(a => a.accidentReport.emergencyType === eType).length,
      fill: EmergencyType.values[eType].light ?? defColor,
      fillDark: EmergencyType.values[eType].dark ?? defColor
    };

    if (tmp.value > 0) {
      chartData.push(tmp);
    }
  }

  if (chartData.length < 1) {
    chartData.push({
      name: "",
      value: 1,
      fill: defColor,
      fillDark: defColor
    });
  }

  return (
    <Container className="mt-5 justify-content-center text-center">
      <h1 className="mb-3">{t("HomePage.Dispositor")}</h1>
      <Row xs={3} className="justify-content-around">
        <ProgressChart width={350} height={350} value={ambulances.all !== 0 ? (ambulances.available / ambulances.all) * 100 : 0} innerRadius="100" label tooltip color={{
          r: 255,
          g: 162,
          b: 0
        }} full={t("HomePage.AmbulanceAvailable")} empty={t("HomePage.AmbulanceUnavailable")} />
        <PieChart width={350} height={350} data={chartData} innerRadius="90" label legend tooltip />
        <ProgressChart width={350} height={350} value={accidents.length !== 0 ? (accepted.length / accidents.length) * 100 : 0} innerRadius="100" label tooltip color={{
          r: 0,
          g: 146,
          b: 255
        }} full={t("HomePage.ReportAccepted")} empty={t("HomePage.ReportPending")} />
      </Row>
      <Row xs={3} className="text-center">
        <h3>{t("HomePage.AmbulancesAvailable")}</h3>
        <h3>{t("HomePage.Incidents")}</h3>
        <h3>{t("HomePage.ReportsAccepted")}</h3>
      </Row>
      <Row className="my-3 justify-content-center">
        <NavButton to="/map" className="w-25">{t("HomePage.OpenMap")}</NavButton>
      </Row>
      <h2>{t("Report.Reports")}</h2>
      <Row className="my-3">
        <Table columns={cols} data={accidents} isLoading={isLoading} />
      </Row>
    </Container>
  );
};

export default DispositorHome;
