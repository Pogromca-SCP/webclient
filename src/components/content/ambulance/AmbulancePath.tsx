import { MapViewHelperParams } from "../sharedViewsParams";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRoles } from "../../../hooks/useAuth";
import { hasPerm, incidentInfo } from "../../../helpers/authHelper";
import { getIncidentPath, AmbulancePathResponse, getAmbulanceIncidents } from "../../../api/ambulanceCalls";
import { licensePlateError, missingDataError, loadingError } from "../sharedStrings";
import Form from "../../fragments/forms/Form";
import FormSelect from "../../fragments/forms/FormSelect";
import { EmergencyType } from "../../../api/enumCalls";
import Range from "../../fragments/forms/Range";
import Number from "../../fragments/forms/api/Number";
import NavButton from "../../fragments/navigation/NavButton";
import Error from "../../fragments/forms/Error";
import { IncidentResponse } from "../../../api/incidentCalls";
import { ambulanceIcon } from "../map/MapIcons";
import MapView from "../../fragments/map/MapView";

interface IncidentData {
  id: number,
  type: string
}

interface AmbulancePathParams extends MapViewHelperParams {
  path: [number, number][],
  setPath: (x: [number, number][]) => void,
  incidents: IncidentData[]
}

// Displays ambulance path during selected incident response
const AmbulancePathView = (props: Readonly<AmbulancePathParams>) => {
  const [incident, setIncident] = useState<number | undefined>(props.incidents[0]?.id);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(props.error);
  const { ambulanceId } = useParams();
  const { t } = useTranslation();
  const roles = useRoles();
  const setPath = props.setPath;
  const update = props.update;
  const incidentAccess = hasPerm(roles, incidentInfo);

  // Updated incident id
  useEffect(() => setIncident(props.incidents[0]?.id), [props.incidents]);

  // Updates error message
  useEffect(() => setError(props.error), [props.error]);

  // Loads ambulance path
  useEffect(() => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    if (incident === undefined) {
      setError("Error.NoData");
      return;
    }

    const abort = new AbortController();
    setError(undefined);

    getIncidentPath(ambulanceId, incident, abort).then(res => res.json()).then((data: AmbulancePathResponse) => {
      if (data.path && data.incidentId === incident) {
        setPath(data.path.map(p => [p.latitude, p.longitude] as [number, number]));
        setOffset(0);
        const value = data.path[0];

        if (value && update) {
          update([value.latitude, value.longitude]);
        }

        setError("");
      } else {
        console.log(data);
        setError(missingDataError);
      }
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.error(err);
        setError(loadingError);
      }
    });

    return () => abort.abort();
  }, [ambulanceId, incident, setPath, update]);

  const onMove = (x: number) => {
    setOffset(x);
    const value = props.path[x];

    if (value && update) {
      update(value);
    }
  };

  return (
    <Form>
      <h1 className="my-3 text-center">{t("Ambulance.Path")}</h1>
      <FormSelect id="timeSpan" className="mb-3" value={incident} options={props.incidents.map(i => `${i.id} - ${t(`${EmergencyType.name}.${i.type}`)}`)} provider={opt => opt.split(" -")[0]} allValid onChange={e => setIncident(parseInt(e.target.value))} />
      <Range id="timeline" className="mb-3" minValue="0" maxValue={props.path.length - 1} value={offset} onChange={e => onMove(parseInt(e.target.value))} />
      <h4 className="text-center mb-3">{t("Map.Location")}</h4>
      <Number id="latitude" className="mb-3" value={props.lat} disabled />
      <Number id="longitude" className="mb-3" value={props.lng} disabled />
      {incidentAccess && incident !== undefined ? <NavButton to={`/reports/${incident}`} className="w-100">{t("Report.Details")}</NavButton> : ""}
      <Error className="mt-3" error={error} />
    </Form>
  );
};

// Mini-map wrapper for ambulance path view
const AmbulancePath = () => {
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [incidents, setIncidents] = useState<IncidentData[]>([]);
  const [error, setError] = useState<string | undefined>("");
  const { t } = useTranslation();
  const { ambulanceId } = useParams();

  // Loads all ambulance related incidents
  useEffect(() => {
    if (ambulanceId === undefined) {
      console.error(licensePlateError);
      return;
    }

    const abort = new AbortController();
    setError(undefined);

    getAmbulanceIncidents(ambulanceId, abort).then(res => res.json()).then((data: Record<string, IncidentResponse[]>) => {
      if (!data) {
        setError(missingDataError);
        return;
      }

      const mapData = (x: Readonly<IncidentResponse[]>) => x.map(i => ({
        id: i.incidentId,
        type: i.accidentReport.emergencyType
      }));

      let tmp: IncidentResponse[] = [];

      for (const key in data) {
        tmp = tmp.concat(data[key]);
      }

      setIncidents(mapData(tmp));
      const loc = tmp[0]?.accidentReport.location;
      setCoords([loc?.latitude ?? 0, loc?.longitude ?? 0]);
      setError("");
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.error(err);
        setError(loadingError);
      }
    });

    return () => abort.abort();
  }, [ambulanceId]);

  const mark = {
    coords: coords,
    desc: t("Ambulance.Ambulance"),
    icon: ambulanceIcon
  };

  return <MapView isLoaded={error !== undefined} center={coords} initialZoom={12} small element={<AmbulancePathView update={setCoords} lat={coords[0]} lng={coords[1]} error={error} path={path} setPath={setPath} incidents={incidents} />} paths={[{
    points: path,
    color: "red"
  }]} marks={[mark]} />;
};

export default AmbulancePath;
